import AmmImpl from "@meteora-ag/dynamic-amm-sdk";
import { NATIVE_MINT } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { StakeForFee } from "../stake-for-fee";
import {
  DEFAULT_KEYPAIR_PATH,
  DEVNET_URL,
  handleSendTransaction,
  initializeMintAndMint,
  loadKeypairFromFile,
} from "./utils";
import { createFeeVault, createPool, lockLiquidityToFeeVault } from "./actions";

const connection = new Connection(DEVNET_URL);
const poolConfigKey = new PublicKey(
  "BdfD7rrTZEWmf8UbEBPVpvM3wUqyrR8swjAy5SNT8gJ2"
);
const mintADecimal = 9;
const mintANativeAmountMultiplier = 10 ** mintADecimal;
const mintAmount = 10_000;
const stakeFarmAmount = 1_000;

async function createPoolAndInteractWithFeeVaultExample() {
  const keypair = loadKeypairFromFile(DEFAULT_KEYPAIR_PATH);
  console.log(`Wallet ${keypair.publicKey} connected`);

  const amountAToMint =
    BigInt(mintAmount) * BigInt(mintANativeAmountMultiplier);
  const amountAToDeposit =
    BigInt(mintAmount - stakeFarmAmount) * BigInt(mintANativeAmountMultiplier); // 1,000 reserve to stake
  const amountB = BigInt(1_000_000);

  console.log("Create mint A");
  const mintA = await initializeMintAndMint(
    connection,
    keypair,
    keypair,
    mintADecimal,
    amountAToMint
  );

  console.log("1. Create dynamic vaults and pool");
  const poolKey = await createPool(
    keypair,
    mintA,
    NATIVE_MINT,
    new BN(amountAToDeposit.toString()),
    new BN(amountB.toString()),
    poolConfigKey
  );

  const pool = await AmmImpl.create(connection, poolKey);

  // ⚠️ `createFeeVault` and `stake` (steps 2 and 5) are deprecated. They fail with the `Deprecated` error once the program upgrade lands on-chain.
  console.log("2. Create fee vault");
  const currentSlot = await connection.getSlot("confirmed");
  const currentOnchainTimestamp = await connection.getBlockTime(currentSlot);
  // Number of top stakers
  const topListLength = 10;
  // Number of seconds to withdraw unstaked token
  const unstakeLockDuration = new BN(3600 * 24);
  // Number of seconds for the swap fee fully dripped to stakers
  const secondsToFullUnlock = new BN(3600 * 24 * 7);
  // Timestamp to start fee distribution / drip to stakers
  const startFeeDistributeTimestamp = new BN(currentOnchainTimestamp + 10); // delay 10 seconds to be able to claim

  await createFeeVault(
    poolKey,
    pool.poolState.tokenAMint,
    keypair,
    topListLength,
    unstakeLockDuration,
    secondsToFullUnlock,
    startFeeDistributeTimestamp
  );

  console.log("3. Lock user LP for fee vault");
  await lockLiquidityToFeeVault(poolKey, pool, keypair, 10_000); // 10_000 means 100% of LP is being lock

  console.log("4. Connect to the fee vault");
  const feeVault = await StakeForFee.create(connection, poolKey);

  console.log("5. Stake amount");
  const stakeAmount = new BN(
    (BigInt(stakeFarmAmount) * BigInt(mintANativeAmountMultiplier)).toString()
  ); // 1,000 stake token (make sure you have enough balance in your wallet)
  const stakeTx = await feeVault.stake(stakeAmount, keypair.publicKey);
  const stakeSignature = await handleSendTransaction(
    connection,
    stakeTx,
    keypair
  );
  console.log("Stake Signature", stakeSignature);

  console.log("6. Get stake balance");
  await feeVault.refreshStates();
  const userEscrow = await feeVault.getUserStakeAndClaimBalance(
    keypair.publicKey
  );
  const stakeBalance =
    userEscrow.stakeEscrow.stakeAmount.toNumber() /
    10 ** feeVault.accountStates.tokenAMint.decimals;
  console.log("Stake Balance", stakeBalance);
  const claimableFeeA =
    (userEscrow.unclaimFee.feeA.toNumber() || 0) /
    10 ** feeVault.accountStates.tokenAMint.decimals;
  console.log("Claimable Fee A", claimableFeeA);
  const claimableFeeB =
    (userEscrow.unclaimFee.feeB.toNumber() || 0) /
    10 ** feeVault.accountStates.tokenBMint.decimals;
  console.log("Claimable Fee B", claimableFeeB);

  // Full exit after the program deprecation: withdraw the ongoing unstake requests, the stake, then claim the fees.
  console.log("7. Withdraw ongoing unstake requests");
  // The unstake lock duration is no longer enforced, so they can be withdrawn immediately.
  const unstakeList = await StakeForFee.getUnstakeByUser(
    connection,
    keypair.publicKey,
    feeVault.feeVaultKey
  );
  for (const { publicKey: unstakeKey } of unstakeList) {
    const withdrawTx = await feeVault.withdraw(unstakeKey, keypair.publicKey);
    const withdrawSignature = await handleSendTransaction(
      connection,
      withdrawTx,
      keypair
    );
    console.log("Withdraw Signature", withdrawSignature);
  }

  console.log("8. Withdraw stake");
  const withdrawStakeTx = await feeVault.withdrawStake(keypair.publicKey);
  const withdrawStakeSignature = await handleSendTransaction(
    connection,
    withdrawStakeTx,
    keypair
  );
  console.log("Withdraw Stake Signature", withdrawStakeSignature);

  // `withdrawStake` settles the pending fees, so claim after it to collect everything.
  console.log("9. Claim fee");
  const claimFeeTx = await feeVault.claimFee(keypair.publicKey);

  const signature = await handleSendTransaction(
    connection,
    claimFeeTx,
    keypair
  );
  console.log(`Claim Fee Signature`, signature);
}

createPoolAndInteractWithFeeVaultExample()
  .then(() => console.log("Done"))
  .catch(console.error);
