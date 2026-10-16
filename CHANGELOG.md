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

## @meteora-ag/stake-for-fee [1.1.0]

Sync with stake-for-fee program [0.1.2].

### Added

- `withdrawStake`. Withdraws the whole stake amount directly from the stake escrow, without an unstake request. Pending fees are settled first and stay claimable with `claimFee`.
- `getPoolLpSupply` helper. LP supply tracked by the dynamic AMM pool (`pool.lpMintSupply`). Throws when it is smaller than the LP mint supply.

### Changed

- `claimFee` claims all pending fees of both tokens. The stake token fee is transferred to the owner stake token ATA (created when missing) instead of being restaked. `maxFee` is now optional and ignored.
- The unstake lock duration is no longer enforced. Ongoing unstake requests can be withdrawn immediately with `withdraw`, without waiting for their release time.

**Breaking**: `getLockedEscrowPendingFee` takes the dynamic AMM pool state as the last parameter. `StakeForFee.getFarmPendingClaimFees` and `StakeForFee.getFarmReleasedFees` take `ammPool`.

### Deprecated

- `createFeeVault`, `createFeeVaultWithParams`, `createFeeVaultInstructions`, `initializeStakeEscrow`, `getOrCreateStakeEscrowInstruction`, `stake`, `unstake` and `cancelUnstake`. The program instructions are deprecated, so the transactions fail with `Deprecated` once they land on-chain.

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
