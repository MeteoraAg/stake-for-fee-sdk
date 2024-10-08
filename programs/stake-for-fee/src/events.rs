use anchor_lang::prelude::*;

#[event]
pub struct VaultCreated {
    pub pool: Pubkey,
    pub token_a_mint: Pubkey,
    pub token_b_mint: Pubkey,
    pub vault: Pubkey,
    pub stake_mint: Pubkey,
    pub creator: Pubkey,
    pub top_list_length: u16,
    pub seconds_to_full_unlock: u64,
    pub unstake_lock_duration: u64,
    pub start_claim_fee_timestamp: i64,
}

#[event]
pub struct StakeEscrowCreated {
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub escrow: Pubkey,
    pub owner: Pubkey,
    pub full_balance_index: u64,
}

#[event]
pub struct ConfigCreated {
    pub config: Pubkey,
    pub index: u64,
    pub seconds_to_full_unlock: u64,
    pub unstake_lock_duration: u64,
    pub join_window_duration: u64,
    pub top_list_length: u16,
}

#[event]
pub struct ConfigClosed {
    pub config: Pubkey,
    pub index: u64,
}

#[event]
pub struct UnstakeCreated {
    pub unstake: Pubkey,
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub new_stake_escrow_amount: u64,
    pub new_stake_escrow_ongoing_total_unstake_amount: u64,
    pub fee_a_pending: u64,
    pub fee_b_pending: u64,
    pub fee_a_per_liquidity_checkpoint: u128,
    pub fee_b_per_liquidity_checkpoint: u128,
    pub start_at: i64,
    pub end_at: i64,
}

#[event]
pub struct CancelUnstakeSucceed {
    pub unstake: Pubkey,
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub new_stake_escrow_amount: u64,
    pub new_stake_escrow_ongoing_total_unstake_amount: u64,
    pub fee_a_pending: u64,
    pub fee_b_pending: u64,
    pub fee_a_per_liquidity_checkpoint: u128,
    pub fee_b_per_liquidity_checkpoint: u128,
}

#[event]
pub struct WithdrawSucceed {
    pub unstake: Pubkey,
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub new_stake_escrow_ongoing_total_unstake_amount: u64,
}

#[event]
pub struct ClaimFeeSucceed {
    pub stake_escrow: Pubkey,
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub fee_a_amount: u64,
    pub fee_b_amount: u64,
    pub total_fee_a_amount: u128,
    pub total_fee_b_amount: u128,
}

#[event]
pub struct FeeEmission {
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub token_a_claimed: u64,
    pub token_b_claimed: u64,
    pub token_a_released: u64,
    pub token_b_released: u64,
    pub cumulative_fee_a_per_liquidity: u128,
    pub cumulative_fee_b_per_liquidity: u128,
    pub effective_stake_amount: u64,
}

#[event]
pub struct AddNewUserToTopHolder {
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub stake_amount: u64,
    pub fee_a_pending: u64,
    pub fee_b_pending: u64,
    pub fee_a_per_liquidity_checkpoint: u128,
    pub fee_b_per_liquidity_checkpoint: u128,
}

#[event]
pub struct RemoveUserFromTopHolder {
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub stake_amount: u64,
    pub fee_a_pending: u64,
    pub fee_b_pending: u64,
    pub fee_a_per_liquidity_checkpoint: u128,
    pub fee_b_per_liquidity_checkpoint: u128,
}

#[event]
pub struct UserStake {
    pub pool: Pubkey,
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub stake_amount: u64,
    pub total_stake_amount: u64,
    pub fee_a_pending: u64,
    pub fee_b_pending: u64,
    pub fee_a_per_liquidity_checkpoint: u128,
    pub fee_b_per_liquidity_checkpoint: u128,
}

#[event]
pub struct ReclaimIndex {
    pub vault: Pubkey,
    pub in_owner: Pubkey,
    pub in_owner_balance: u64,
    pub out_owner: Pubkey,
    pub out_owner_balance: u64,
    pub reclaim_index: u64,
}
