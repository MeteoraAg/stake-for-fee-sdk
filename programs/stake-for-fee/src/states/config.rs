use anchor_lang::prelude::*;

#[account(zero_copy)]
#[derive(InitSpace, Debug, Default)]
pub struct Config {
    pub index: u64,
    /// Seconds for lock escrow claimed fee to be fully dripped to the top stakers
    pub seconds_to_full_unlock: u64,
    /// Seconds for the requested unstake to withdraw the capital
    pub unstake_lock_duration: u64,
    /// Time window (in seconds) for staker to stake before the first lock escrow claim fee happen. This is to ensure that there's enough time for staker to join the list, so the first claim fee with huge amount will be more fairly distributed.
    pub join_window_duration: u64,
    /// Maximum number of stakers in the top list
    pub top_list_length: u16,
    /// Padding
    pub padding_0: [u8; 14],
    /// Padding
    pub padding: [u128; 4],
}
