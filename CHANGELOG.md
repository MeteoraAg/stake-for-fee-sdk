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
