# Stake for Fee

A staking program allows top stakers to earn fee from dynamic-amm

> **Deprecated.** The program disabled `initialize_vault`, `initialize_stake_escrow`, `stake`, `claim_fee`, `request_unstake` and `cancel_unstake`. They fail with `Deprecated`.
> Stakers exit with `claim_fee_and_withdraw_full` (`claimFeeAndWithdrawFull` in the TypeScript SDK), which claims all pending fees, then withdraws the whole stake amount. Existing unstake requests are withdrawn with `withdraw`, which no longer waits for the unstake lock duration.
> See the [TypeScript SDK](./ts-client/README.md) and the [Rust interface](./stake_for_fee_interface/README.md).

## Program ID:

Production: FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP

## Branches and tags

- New development happens on `main`
- Release tags have names like `v0.1.0`
