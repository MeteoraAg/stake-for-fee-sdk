# Meteora M3M3 SDK

<p align="center">
<img align="center" src="https://app.meteora.ag/icons/logo.svg" width="180" height="180" />
</p>
<br>

## Getting started

NPM: https://www.npmjs.com/package/@meteora-ag/m3m3

SDK: https://github.com/MeteoraAg/stake-for-fee-sdk

Discord: https://discord.com/channels/841152225564950528/864859354335412224

<hr>

## Install

1. Install deps

```
npm i @meteora-ag/m3m3 @coral-xyz/anchor @solana/web3.js @solana/spl-token @solana/spl-token-registry
```

2. Initialize StakeForFee instance

```ts
import StakeForFee from "@meteora-ag/m3m3";
import { PublicKey } from "@solana/web3.js";
import { Wallet, AnchorProvider } from "@project-serum/anchor";

// Connection, Wallet, and AnchorProvider to interact with the network
const mainnetConnection = new Connection("https://api.mainnet-beta.solana.com");
const mockWallet = new Wallet(new Keypair());
const provider = new AnchorProvider(mainnetConnection, mockWallet, {
  commitment: "confirmed",
});
// Alternatively, to use Solana Wallet Adapter

const poolAddress = new PublicKey(
  "G2MRSjNjCbFUmMf32Z1aXYhy6pc1ihLyYg6orKedyjJG"
);
const m3m3 = await StakeForFee.create(connection, poolAddress);
```

3. To interact with the StakeForFee

> **Deprecated.** The stake-for-fee program deprecated `initialize_vault`, `initialize_stake_escrow`, `stake`, `request_unstake` and `cancel_unstake`. The SDK functions `createFeeVault`, `createFeeVaultWithParams`, `createFeeVaultInstructions`, `initializeStakeEscrow`, `stake`, `unstake` and `cancelUnstake` are kept, but their transactions fail with the `Deprecated` error once they land on-chain.
> Stakers exit with `withdrawStake`. Existing unstake requests are withdrawn with `withdraw`, which no longer waits for the unstake lock duration. `claimFee` keeps working.

- Full exit (deprecation)

Full exit for stakers after the program deprecation. Withdraw every ongoing unstake request, then the stake, then claim the fees. `withdrawStake` settles the pending fees, so claim after it to collect everything in one claim.

```ts
// 1. Withdraw every ongoing unstake request. They no longer wait for the unstake lock duration.
const unstakeList = await StakeForFee.getUnstakeByUser(
  connection,
  mockWallet.publicKey,
  feeFarm.feeVaultKey
);
for (const { publicKey: unstakeKey } of unstakeList) {
  const withdrawTx = await feeFarm.withdraw(unstakeKey, mockWallet.publicKey);
  await provider.sendAndConfirm(withdrawTx);
}

// 2. Withdraw the whole stake amount. It fails when nothing is staked, so skip it in that case.
await feeFarm.refreshStates();
const { stakeEscrow } = await feeFarm.getUserStakeAndClaimBalance(
  mockWallet.publicKey
);
if (!stakeEscrow.stakeAmount.isZero()) {
  const withdrawStakeTx = await feeFarm.withdrawStake(mockWallet.publicKey);
  await provider.sendAndConfirm(withdrawStakeTx);
}

// 3. Claim all pending fees, including the ones settled by `withdrawStake`.
const claimFeeTx = await feeFarm.claimFee(mockWallet.publicKey);
await provider.sendAndConfirm(claimFeeTx);
```

- Stake (deprecated)

```ts
const stakeAmount = new BN(
  1_000 * 10 ** feeFarm.accountStates.tokenAMint.decimals
); // 1,000 stake token (make sure you have enough balance in your wallet)
const stakeTx = await feeFarm.stake(stakeAmount, mockWallet.publicKey);
const stakeTxHash = await provider.sendAndConfirm(stakeTx); // Transaction hash
```

- Get stake balance and claimable balance

```ts
await feeFarm.refreshStates(); // make sure to refresh states to get the latest data
const userEscrow = await feeFarm.getUserStakeAndClaimBalance(
  mockWallet.publicKey
);
const stakeBalance =
  userStakeEscrow.stakeEscrow.stakeAmount.toNumber() /
  10 ** feeFarm.accountStates.tokenAMint.decimals;
const claimableFeeA = fromLamports(
  userStakeEscrow.unclaimFee.feeA || 0,
  feeFarm.accountStates.tokenAMint.decimals
);
const claimableFeeB = fromLamports(
  userStakeEscrow.unclaimFee.feeB || 0,
  feeFarm.accountStates.tokenBMint.decimals
);
```

- Claim Fee

```ts
// Claims all pending stake token and quote token fees. The stake token fee is no longer restaked.
const claimFeeTx = await feeVault.claimFee(mockWallet.publicKey);
const claimfeeTxHash = await provider.sendAndConfirm(claimFeeTx); // Transaction hash
```

- Withdraw stake

```ts
// Withdraws the whole stake amount without an unstake request.
// Pending fees stay claimable with `claimFee`.
const withdrawStakeTx = await feeVault.withdrawStake(mockWallet.publicKey);
const withdrawStakeTxHash = await provider.sendAndConfirm(withdrawStakeTx); // Transaction hash
```

- Unstake (deprecated, use `withdrawStake`)

```ts
const unstakeKeyPair = new Keypair();
const unstakeTx = await feeVault.unstake(
  userEscrow.stakeEscrow.stakeAmount,
  unstakeKeyPair.publicKey,
  mockWallet.publicKey
);
unstakeTx.partialSign(unstakeKeyPair); // Make sure to partial sign unstakeKeypair
const unstakeTxHash = await provider.sendAndConfirm(unstakeTx); // Transaction hash
```

- Get unstake period (Seconds). No longer enforced by `withdraw`.

```ts
const unstakePeriodInSeconds =
  feeFarm.accountStates.feeVault.configuration.unstakeLockDuration.toNumber();
```

- Cancel unstake (deprecated)

```ts
const cancelUnstakeTx = await feeFarm.cancelUnstake(
  unstakeKeyPair.publicKey,
  mockWallet.publicKey
);
const cancelUnstakeTxHash = await provider.sendAndConfirm(cancelUnstakeTx);
```

- Withdraw an existing unstake request (no longer waits for the unstake lock duration)

```ts
const withdrawTx = await feeFarm.withdraw(
  unstakeKeyPair.publicKey,
  mockWallet.publicKey
);
const withdrawTxHash = await provider.sendAndConfirm(withdrawTx);
```
