# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## @meteora-ag/stake-for-fee [2.0.0]

Sync with stake-for-fee program [0.1.2].

### Added

- `claimFeeAndWithdrawFull`. Claims all pending fees of both tokens, then withdraws the whole stake amount directly from the stake escrow, without an unstake request. The stake token fee is transferred to the owner stake token ATA (created when missing) instead of being restaked, and the quote token fee to the owner quote token ATA (created when missing, unwrapped when it is SOL). A stake escrow without stake amount can still claim its pending fees. Fails with `NothingToExit` when the stake escrow has no stake amount and no pending fees. Existing unstake requests are not affected, complete them with `withdraw`.
- `getPoolLpSupply` helper. LP supply tracked by the dynamic AMM pool (`pool.lpMintSupply`). Throws when it is smaller than the LP mint supply.
- IDL: event `WithdrawStakeSucceed`, errors `Deprecated` (6023) and `NothingToExit` (6024).
- IDL: field `finalFeeClaimed` in `FeeVault`, taken from `padding0` (now 6 bytes). It is set to 1 by the first `claim_fee_crank` or `claimFeeAndWithdrawFull`, even when no lock escrow fee is claimed.
- IDL: dynamic AMM `Pool.partnerInfo` and `Pool.lpMintSupply`, dynamic vault `Vault.version` and `Vault.totalLpSupply`.

### Changed

- The unstake lock duration is no longer enforced. Ongoing unstake requests can be withdrawn immediately with `withdraw`, without waiting for their release time.
- The program claims the lock escrow fee only once, by the first `claim_fee_crank` or `claimFeeAndWithdrawFull`, even when the pending fee is zero. A lock escrow without locked amount is not claimed, but the final claim is still marked as done. `getLockedEscrowPendingFee` returns zero once `feeVault.finalFeeClaimed` is set or when the lock escrow has no locked amount, and no longer applies the minimum claim interval.
- The program distributes all locked fees to the top stakers immediately instead of over `secondsToFullUnlock`. `StakeForFee.getFarmReleasedFees` returns the locked fees plus the pending lock escrow fee, or zero until `feeVault.configuration.startFeeDistributeTimestamp` has passed, which changes the pending fees returned by `getUserStakeAndClaimBalance`, `getStakeEscrowPendingFees` and `StakeForFee.getAllStakedVaultByUser`.
- `getTokenBalances` and `getLockedEscrowPendingFee` use the LP supply tracked by the dynamic vault (`vault.totalLpSupply`) for version 1 vaults, instead of the LP mint supply. `getLockedEscrowPendingFee` also uses the LP supply tracked by the dynamic AMM pool (`pool.lpMintSupply`). They throw when the tracked supply is smaller than the LP mint supply.
- IDL: dynamic AMM `Padding` has the fields `padding0`, `padding1` and `padding2`, and dynamic vault `Vault.strategies` has 29 entries instead of 30, following the upstream dynamic AMM and dynamic vault IDLs.

**Breaking**: `getLockedEscrowPendingFee` takes the dynamic AMM pool state as the last parameter. `StakeForFee.getFarmPendingClaimFees` and `StakeForFee.getFarmReleasedFees` take `ammPool`.

### Deprecated

- `createFeeVault`, `createFeeVaultWithParams`, `createFeeVaultInstructions`, `initializeStakeEscrow`, `getOrCreateStakeEscrowInstruction`, `stake`, `claimFee`, `unstake` and `cancelUnstake`. The program instructions are deprecated, so the transactions fail with `Deprecated` once they land on-chain. Their parameters are unchanged. Pending fees are claimed with `claimFeeAndWithdrawFull`.
- `MIN_LOCK_ESCROW_CLAIM_FEE_DURATION`. The program removed the minimum lock escrow claim fee interval.
- `feeVault.configuration.unstakeLockDuration` and `feeVault.configuration.secondsToFullUnlock` are no longer used by the program. IDL: instructions `updateUnstakeLockDuration` and `updateSecondsToFullUnlock` fail with `Deprecated`.

> **Warning**
>
> - Stop creating stake-for-fee vaults.
> - Do not create a DAMM lock escrow owned by a stake-for-fee vault PDA, or lock LP into one.

### Fixed

- `getLockedEscrowPendingFee` includes `lockEscrow.unclaimedFeePending`, which the dynamic AMM claims together with the new fee.

## stake_for_fee_interface [0.2.0]

Sync with stake-for-fee program [0.1.2].

### Added

- Instruction `claim_fee_and_withdraw_full`. It emits `ClaimFeeSucceed`, and `WithdrawStakeSucceed` only when a stake amount is withdrawn.
- Event `WithdrawStakeSucceed` and errors `Deprecated` (6023) and `NothingToExit` (6024).
- Field `final_fee_claimed` in `FeeVault`, taken from `padding_0` (now `[u8; 6]`). It is set to 1 by the first `claim_fee_crank` or `claim_fee_and_withdraw_full`, even when no lock escrow fee is claimed.

### Changed

- **Breaking**: The crate is generated by Anchor `declare_program!` from `idls/stake_for_fee.json`, replacing the previous generated code. It requires `anchor-lang` 1.2.1 and Rust 1.89 or newer. Forward the `idl-build` feature when your program generates its IDL. See the [README](./stake_for_fee_interface/README.md) for the exported modules.
- Field `padding0` of `FeeVault`, `StakeEscrow`, `Configuration`, `Metrics` and `TopStakerInfo` is renamed `padding_0`. `Unstake` gets the fields `owner` and `vault` added in program [0.1.1], and `padding` is renamed `_padding` (now `[u64; 22]`).

### Deprecated

- `initialize_vault`, `initialize_stake_escrow`, `stake`, `claim_fee`, `request_unstake`, `cancel_unstake`, `update_seconds_to_full_unlock` and `update_unstake_lock_duration` always fail with `Deprecated` on-chain. Their accounts and instruction data are unchanged.

> **Warning**
>
> - Stop creating stake-for-fee vaults.
> - Do not create a DAMM lock escrow owned by a stake-for-fee vault PDA, or lock LP into one.

## common [0.0.2]

### Changed

- **Breaking**: Depends on `anchor-lang` 1.2.1 instead of `solana-sdk` 1.16. The PDA helpers take and return `anchor_lang::prelude::Pubkey`.

## @meteora-ag/stake-for-fee [1.0.10] (PR #35)(https://github.com/MeteoraAg/stake-for-fee-sdk/pull/35)

### Fixed

- Remove `@solana-developers/helpers` dep & replace `@mercurial-finance/dynamic-amm-sdk` with `@meteora-ag/dynamic-amm-sdk`

## @meteora-ag/stake-for-fee [1.0.9] (PR #33)(https://github.com/MeteoraAg/stake-for-fee-sdk/pull/33)

### Fixed

- Move `@mercurial-finance/dynamic-amm-sdk` from a dev dependency to a regular dependency.

## common [0.0.1] (PR #28)(https://github.com/MeteoraAg/stake-for-fee-sdk/pull/28)

- PDA helper to derive accounts

### Added

## @meteora-ag/stake-for-fee [1.0.1] [PR #24](https://github.com/MeteoraAg/stake-for-fee-sdk/pull/24)

### Changed

- Refactor `findLargestStakerNotInTopListFromFullBalanceList` and `findReplaceableTopStaker` to reduce complexity.

## stake-for-fee [0.1.1] [PR #14](https://github.com/MeteoraAg/stake-for-fee-sdk/pull/14)

### Changed

- Breaking change for endpoint `claim_fee`. Now, it can only partial claim quote token. Base token will be automatically restaked.

## @meteora-ag/stake-for-fee [1.0.17] [PR #14](https://github.com/MeteoraAg/stake-for-fee-sdk/pull/14)

### Changed

- Breaking change for function `claimFee`. Now, it can only partial claim quote token. Base token will be automatically restaked.

## @meteora-ag/stake-for-fee [1.0.1] [PR #2](https://github.com/MeteoraAg/stake-for-fee-sdk/pull/2)

### Fixed

- build module
