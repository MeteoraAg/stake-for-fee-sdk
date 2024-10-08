use anchor_lang::prelude::*;

#[account(zero_copy)]
#[derive(InitSpace, Debug, Default)]
pub struct FeeVault {
    /// Lock escrow account
    pub lock_escrow: Pubkey,
    /// Stake mint
    pub stake_mint: Pubkey,
    /// Pool
    pub pool: Pubkey,
    /// Stake token vault
    pub stake_token_vault: Pubkey,
    /// Token a vault
    pub token_a_vault: Pubkey,
    /// Token b vault
    pub token_b_vault: Pubkey,
    /// Top staker list
    pub top_staker_list: Pubkey,
    /// Full balance list
    pub full_balance_list: Pubkey,
    /// Metrics
    pub metrics: Metrics,
    /// Configuration parameters
    pub configuration: Configuration,
    /// Top staker info
    pub top_staker_info: TopStakerInfo,
    /// Creator
    pub creator: Pubkey,
    /// Created at
    pub created_at: i64,
    /// Bump
    pub bump: u8,
    /// Padding
    pub padding_0: [u8; 7],
    /// Padding
    pub padding: [u128; 20],
}

#[zero_copy]
#[derive(InitSpace, Debug, Default)]
pub struct Configuration {
    /// Time required for locked claim fee to be fully dripped
    pub seconds_to_full_unlock: u64,
    /// Unstake lock duration
    pub unstake_lock_duration: u64,
    /// Minimum time to start claim fee from lock escrow
    pub start_claim_fee_timestamp: i64,
    /// padding 0
    pub padding_0: u64,
    /// padding
    pub padding: [u128; 4],
}

#[zero_copy]
#[derive(InitSpace, Debug, Default)]
pub struct Metrics {
    /// Total staked amount
    pub total_staked_amount: u64,
    /// Total stake escrow count
    pub total_stake_escrow_count: u64,
    /// Ongoing total partial unstake amount
    pub ongoing_total_partial_unstake_amount: u64,
    /// padding 0
    pub padding_0: u64,
    /// Total claimed fee a amount
    pub total_fee_a_amount: u128,
    /// Total claimed fee b amount
    pub total_fee_b_amount: u128,
    /// User total claimed fee a
    pub user_total_claimed_fee_a: u128,
    /// User total claimed fee b
    pub user_total_claimed_fee_b: u128,
    /// padding
    pub padding: [u128; 4],
}

#[zero_copy]
#[derive(InitSpace, Debug, Default)]
pub struct TopStakerInfo {
    /// Number of holder in the top list
    pub top_list_length: u64,
    /// Current length, used for resize
    pub current_length: u64,
    /// Effective stake amount. Total stake amount in the top list.
    pub effective_stake_amount: u64,
    /// Last claim fee at
    pub last_claim_fee_at: i64,
    /// Last fee drip updated at
    pub last_updated_at: i64,
    /// Locked fee a
    pub locked_fee_a: u64,
    /// Locked fee b
    pub locked_fee_b: u64,
    /// Padding
    pub padding_0: u64,
    /// cumulative fee a per liquidity
    pub cumulative_fee_a_per_liquidity: u128,
    /// cumulative fee b per liquidity
    pub cumulative_fee_b_per_liquidity: u128,
    /// padding
    pub padding: [u128; 4],
}
