import AmmImpl from "@mercurial-finance/dynamic-amm-sdk";
import { derivePoolAddressWithConfig } from "@mercurial-finance/dynamic-amm-sdk/dist/cjs/src/amm/utils";
import { getAssociatedTokenAddressSync, NATIVE_MINT } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { StakeForFee } from "../stake-for-fee";
import {
  DYNAMIC_AMM_PROGRAM_ID,
  STAKE_FOR_FEE_PROGRAM_ID,
} from "../stake-for-fee/constants";
import { deriveFeeVault } from "../stake-for-fee/helpers";
import {
  DEFAULT_KEYPAIR_PATH,
  DEVNET_URL,
  initializeMintAndMint,
  loadKeypairFromFile,
} from "./utils";

const connection = new Connection(DEVNET_URL);
const poolConfigKey = new PublicKey(
  "BdfD7rrTZEWmf8UbEBPVpvM3wUqyrR8swjAy5SNT8gJ2"
);
const mintADecimal = 9;
const mintANativeAmountMultiplier = 10 ** mintADecimal;

async function createPool(
  keypair: Keypair,
  mintA: PublicKey,
  mintB: PublicKey,
  amountA: BN,
  amountB: BN,
  poolConfigKey: PublicKey
) {
  const transactions =
    await AmmImpl.createPermissionlessConstantProductPoolWithConfig2(
      // @ts-ignore
      connection,
      keypair.publicKey,
      mintA,
      mintB,
      amountA,
      amountB,
      poolConfigKey,
      {
        cluster: "devnet",
      }
    );

  for (const tx of transactions) {
    tx.sign(keypair);
    const signature = await connection.sendRawTransaction(tx.serialize());
    console.log("Signature", signature);
    await connection.confirmTransaction(signature, "finalized");
  }

  const poolKey = derivePoolAddressWithConfig(
    mintA,
    mintB,
    poolConfigKey,
    DYNAMIC_AMM_PROGRAM_ID
  );

  return poolKey;
}

async function createFeeVault(
  poolKey: PublicKey,
  stakeMint: PublicKey,
  keypair: Keypair,
  topListLength: number,
  unstakeLockDuration: BN,
  secondsToFullUnlock: BN,
  startFeeDistributeTimestamp: BN
) {
  const createTx = await StakeForFee.createFeeVault(
    connection,
    poolKey,
    stakeMint,
    keypair.publicKey,
    // @ts-ignore
    {
      topListLength,
      unstakeLockDuration,
      secondsToFullUnlock,
      startFeeDistributeTimestamp,
    }
  );
  createTx.sign(keypair);
  const signature = await connection.sendRawTransaction(createTx.serialize());
  console.log("Signature", signature);
  await connection.confirmTransaction(signature, "finalized");
}

async function lockLiquidityToFeeVault(
  poolKey: PublicKey,
  pool: AmmImpl,
  keypair: Keypair,
  lockBps: number
) {
  const feeVaultKey = deriveFeeVault(poolKey, STAKE_FOR_FEE_PROGRAM_ID);

  const poolLpAta = getAssociatedTokenAddressSync(
    pool.poolState.lpMint,
    keypair.publicKey
  );

  const lpAmount = await connection
    .getTokenAccountBalance(poolLpAta)
    .then((info) => new BN(info.value.amount.toString()));

  const lockBpsBN = new BN(Math.min(10_000, lockBps));
  const lockAmount = lpAmount.mul(lockBpsBN).div(new BN(10_000));

  const lockTx = await pool.lockLiquidity(
    feeVaultKey,
    lockAmount,
    keypair.publicKey
  );
  lockTx.sign(keypair);

  const signature = await connection.sendRawTransaction(lockTx.serialize());
  console.log("Signature", signature);
  await connection.confirmTransaction(signature, "finalized");
}

async function createPoolAndFeeVaultExample() {
  const keypair = loadKeypairFromFile(DEFAULT_KEYPAIR_PATH);
  console.log(`Wallet ${keypair.publicKey} connected`);

  const amountA = BigInt(10_000) * BigInt(mintANativeAmountMultiplier);
  const amountB = BigInt(1_000_000);

  console.log("Create mint A");
  const mintA = await initializeMintAndMint(
    connection,
    keypair,
    keypair,
    mintADecimal,
    amountA
  );

  console.log("1. Create dynamic vaults and pool");
  const poolKey = await createPool(
    keypair,
    mintA,
    NATIVE_MINT,
    new BN(amountA.toString()),
    new BN(amountB.toString()),
    poolConfigKey
  );

  // @ts-ignore
  const pool = await AmmImpl.create(connection, poolKey);

  console.log("2. Lock user LP for fee vault");
  await lockLiquidityToFeeVault(poolKey, pool, keypair, 10000);

  console.log("3. Create fee vault");
  const currentSlot = await connection.getSlot("processed");
  const currentOnchainTimestamp = await connection.getBlockTime(currentSlot);
  // Number of top stakers
  const topListLength = 10;
  // Number of seconds to withdraw unstaked token
  const unstakeLockDuration = new BN(3600 * 24);
  // Number of seconds for the swap fee fully dripped to stakers
  const secondsToFullUnlock = new BN(3600 * 24 * 7);
  // Timestamp to start fee distribution / drip to stakers
  const startFeeDistributeTimestamp = new BN(currentOnchainTimestamp + 86400);

  await createFeeVault(
    poolKey,
    pool.poolState.tokenAMint,
    keypair,
    topListLength,
    unstakeLockDuration,
    secondsToFullUnlock,
    startFeeDistributeTimestamp
  );

  console.log("4. Connect to the fee vault");
  const feeVault = await StakeForFee.create(connection, poolKey);
  console.log(feeVault);
}

createPoolAndFeeVaultExample()
  .then(() => console.log("Done"))
  .catch(console.error);
