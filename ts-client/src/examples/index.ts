import AmmImpl from "@meteora-ag/dynamic-amm-sdk";
import { NATIVE_MINT } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
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
import { U64_MAX } from "../stake-for-fee/constants";

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

  // ⚠️ Deprecated. `createFeeVault` fails with the `Deprecated` error once it lands on-chain.
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

  // ⚠️ Deprecated. Do not create a lock escrow for a stake-for-fee vault or lock LP into it.
  console.log("3. Lock user LP for fee vault");
  await lockLiquidityToFeeVault(poolKey, pool, keypair, 10_000); // 10_000 means 100% of LP is being lock

  console.log("4. Connect to the fee vault");
  const feeVault = await StakeForFee.create(connection, poolKey);

  // ⚠️ Deprecated. `stake` fails with the `Deprecated` error once it lands on-chain.
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

  // ⚠️ Deprecated. `claimFee` fails with the `Deprecated` error once it lands on-chain. Use `claimFeeAndWithdrawFull` instead.
  console.log("7. Claim fee");
  const claimFeeTx = await feeVault.claimFee(
    keypair.publicKey,
    new BN(U64_MAX)
  );

  const signature = await handleSendTransaction(
    connection,
    claimFeeTx,
    keypair
  );
  console.log(`Claim Fee Signature`, signature);

  // ⚠️ Deprecated. `unstake` fails with the `Deprecated` error once it lands on-chain. Use `claimFeeAndWithdrawFull` instead.
  console.log("8. Unstake");
  const unstakeKeyPair = new Keypair();
  const unstakeTx = await feeVault.unstake(
    userEscrow.stakeEscrow.stakeAmount,
    unstakeKeyPair.publicKey,
    keypair.publicKey
  );
  const unstakeSignature = await handleSendTransaction(connection, unstakeTx, [
    unstakeKeyPair,
    keypair,
  ]);
  console.log("Unstake Signature", unstakeSignature);

  // ⚠️ Deprecated. `cancelUnstake` fails with the `Deprecated` error once it lands on-chain.
  console.log("9. Cancel unstaked");
  const cancelUnstake = await feeVault.cancelUnstake(
    unstakeKeyPair.publicKey,
    keypair.publicKey
  );
  const cancelUnstakeSignature = await handleSendTransaction(
    connection,
    cancelUnstake,
    keypair
  );
  console.log("Cancel Unstake Signature", cancelUnstakeSignature);

  // ⚠️ This only works after unstake period is over
  console.log("10. Withdraw unstake");
  const withdrawUnstake = await feeVault.withdraw(
    unstakeKeyPair.publicKey,
    keypair.publicKey
  );
  const withdrawUnstakeSignature = await handleSendTransaction(
    connection,
    withdrawUnstake,
    keypair
  );
  console.log("Withdraw Unstake Signature", withdrawUnstakeSignature);
}

createPoolAndInteractWithFeeVaultExample()
  .then(() => console.log("Done"))
  .catch(console.error);
