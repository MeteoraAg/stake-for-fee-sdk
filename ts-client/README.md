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

> **Deprecated**
>
> - `claimFee` and `unstake`. Use `claimFeeAndWithdrawFull` instead.
> - `createFeeVault`, `createFeeVaultWithParams`, `createFeeVaultInstructions`, `initializeStakeEscrow`, `getOrCreateStakeEscrowInstruction`, `stake`, `cancelUnstake` and `MIN_LOCK_ESCROW_CLAIM_FEE_DURATION`.

> **Warning**
>
> - Stop creating stake-for-fee vaults.
> - Do not create a DAMM lock escrow owned by a stake-for-fee vault PDA, or lock LP into one, e.g. with `AmmImpl.lockLiquidity` and the fee vault as owner.

- Full exit (deprecation)

Full exit for stakers after the program deprecation. Withdraw every ongoing unstake request, then claim all pending fees and withdraw the stake in one transaction with `claimFeeAndWithdrawFull`.

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

// 2. Claim all pending fees, then withdraw the whole stake amount.
// It fails with `NothingToExit` when there is no stake amount and no pending fees, so skip it in that case.
await feeFarm.refreshStates();
const { stakeEscrow, unclaimFee } = await feeFarm.getUserStakeAndClaimBalance(
  mockWallet.publicKey
);
if (
  stakeEscrow &&
  (!stakeEscrow.stakeAmount.isZero() ||
    !unclaimFee.feeA.isZero() ||
    !unclaimFee.feeB.isZero())
) {
  const claimFeeAndWithdrawFullTx = await feeFarm.claimFeeAndWithdrawFull(
    mockWallet.publicKey
  );
  await provider.sendAndConfirm(claimFeeAndWithdrawFullTx);
}
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

- Claim fee and withdraw full

```ts
// Claims all pending stake token and quote token fees, then withdraws the whole stake amount without an unstake request.
// The stake token fee is transferred to the owner instead of being restaked.
// A stake escrow without stake amount can still claim its pending fees.
// Fails with `NothingToExit` when the stake escrow has no stake amount and no pending fees.
const claimFeeAndWithdrawFullTx = await feeVault.claimFeeAndWithdrawFull(
  mockWallet.publicKey
);
const claimFeeAndWithdrawFullTxHash = await provider.sendAndConfirm(
  claimFeeAndWithdrawFullTx
); // Transaction hash
```

- Claim Fee (deprecated, use `claimFeeAndWithdrawFull`)

```ts
const claimFeeTx = await feeVault.claimFee(
  mockWallet.publicKey,
  new BN(U64_MAX)
); // second param is max amount, so usually we just put max number BN.js can support
const claimfeeTxHash = await provider.sendAndConfirm(claimFeeTx); // Transaction hash
```

- Unstake (deprecated, use `claimFeeAndWithdrawFull`)

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

- Get unstake period (Seconds) (deprecated)

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

- Withdraw

```ts
const withdrawTx = await feeFarm.withdraw(
  unstakeKeyPair.publicKey,
  mockWallet.publicKey
);
const withdrawTxHash = await provider.sendAndConfirm(withdrawTx);
```
