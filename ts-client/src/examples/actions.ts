import AmmImpl from "@mercurial-finance/dynamic-amm-sdk";
import {
  DYNAMIC_AMM_PROGRAM_ID,
  STAKE_FOR_FEE_PROGRAM_ID,
} from "../stake-for-fee/constants";
import { deriveFeeVault } from "../stake-for-fee/helpers";
import { derivePoolAddressWithConfig } from "@mercurial-finance/dynamic-amm-sdk/dist/cjs/src/amm/utils";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { DEVNET_URL, handleSendTransaction } from "./utils";
import BN from "bn.js";
import { StakeForFee } from "../stake-for-fee";
import Decimal from "decimal.js";

const connection = new Connection(DEVNET_URL);

export async function createPool(
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

  for (const [index, tx] of transactions.entries()) {
    const signature = await handleSendTransaction(connection, tx, keypair);
    console.log(`Create Pool Signature ${index + 1}`, signature);
  }

  const poolKey = derivePoolAddressWithConfig(
    mintA,
    mintB,
    poolConfigKey,
    DYNAMIC_AMM_PROGRAM_ID
  );

  return poolKey;
}

export async function createFeeVault(
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
  const signature = await handleSendTransaction(connection, createTx, keypair);
  console.log("Create FeeVault Signature", signature);
}

export async function lockLiquidityToFeeVault(
  poolKey: PublicKey,
  pool: AmmImpl,
  keypair: Keypair,
  lockBps: number
) {
  const feeVaultKey = deriveFeeVault(poolKey, STAKE_FOR_FEE_PROGRAM_ID);

  const poolLpAta = getAssociatedTokenAddressSync(
    pool.poolState.lpMint,
    keypair.publicKey,
    // Only needed if dealing with off-curve addresses, like a Squad.
    true
  );

  const lpAmount = await connection
    .getTokenAccountBalance(poolLpAta)
    .then((info) => new BN(info.value.amount.toString()));

  const lockBpsBN = new BN(Math.min(10_000, lockBps));
  const lockAmount = lpAmount.mul(lockBpsBN).div(new BN(10_000));

  const lockTx = await pool.lockLiquidity(
    feeVaultKey,
    lockAmount,
    keypair.publicKey,
    {
      stakeLiquidity: {
        ratio: new Decimal(1), // 0 to 1; 1 means 100%
      },
    }
  );

  const signature = await handleSendTransaction(connection, lockTx, keypair);
  console.log("Create FeeVault Signature", signature);
}
