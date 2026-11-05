# Stake for Fee

A staking program allows top stakers to earn fee from dynamic-amm

> **Deprecated**
>
> - `claim_fee` and `request_unstake`. Use `claim_fee_and_withdraw_full` instead.
> - `initialize_vault`, `initialize_stake_escrow`, `stake`, `cancel_unstake`, `update_seconds_to_full_unlock` and `update_unstake_lock_duration`.

> **Warning**
>
> - Stop creating stake-for-fee vaults.
> - Do not create a DAMM lock escrow owned by a stake-for-fee vault PDA, or lock LP into one.

## Program ID:

Production: FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP

## Branches and tags

- New development happens on `main`
- Release tags have names like `v0.1.0`
