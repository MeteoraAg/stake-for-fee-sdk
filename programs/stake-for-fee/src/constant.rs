#![allow(dead_code)]
use anchor_lang::solana_program::clock::SECONDS_PER_DAY;
use solana_program::pubkey;
use solana_program::pubkey::Pubkey;

// Define the range of top stakers supported
#[cfg(feature = "local")]
pub const MIN_LIST_LENGTH: u16 = 2;
#[cfg(not(feature = "local"))]
pub const MIN_LIST_LENGTH: u16 = 5;

#[cfg(feature = "local")]
pub const MAX_LIST_LENGTH: u16 = 50;

#[cfg(not(feature = "local"))]
pub const MAX_LIST_LENGTH: u16 = 1000;

// Range (in seconds) for lock escrow claim fee to be fully dripped to the top stakers
#[cfg(feature = "local")]
pub const MIN_SECONDS_TO_FULL_UNLOCK: u64 = 5;
#[cfg(not(feature = "local"))]
pub const MIN_SECONDS_TO_FULL_UNLOCK: u64 = SECONDS_PER_DAY * 6 / 24; // 6 hours
pub const MAX_SECONDS_TO_FULL_UNLOCK: u64 = SECONDS_PER_DAY * 31; // 31 days

// Scale for precision
pub const SCALE_OFFSET: u8 = 64;

// Maximum length full balance list can support. It's decided based on CU consumption.
#[cfg(feature = "local")]
pub const FULL_BALANCE_LIST_HARD_LIMIT: u64 = 100;

#[cfg(not(feature = "local"))]
pub const FULL_BALANCE_LIST_HARD_LIMIT: u64 = 10_000;

// Range (in seconds) for the requested unstake to withdraw the capital
#[cfg(feature = "local")]
pub const MIN_UNSTAKE_LOCK_DURATION: u64 = 5;
#[cfg(not(feature = "local"))]
pub const MIN_UNSTAKE_LOCK_DURATION: u64 = SECONDS_PER_DAY * 6 / 24; // 6 hours
pub const MAX_UNSTAKE_LOCK_DURATION: u64 = SECONDS_PER_DAY * 31; // 31 days

// Maximum seconds for stakers to stake before the first lock escrow claim fee happen. This is prevent massive claimed fee distributed to single staker at the beginning.
pub const MAX_JOIN_WINDOW_DURATION: u64 = SECONDS_PER_DAY * 31; // 31 days

// Supported quote mints
const SOL: Pubkey = pubkey!("So11111111111111111111111111111111111111112");
const USDC: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
pub const QUOTE_MINTS: [Pubkey; 2] = [SOL, USDC];

// Minimum duration for lock escrow to initiate the next claim fee. Due to lock escrow claim fee have precision error, limiting claim fee time window to reduce accumulated loss from precision loss. However, this introduces vulnerability for profit stealing on last staker.
#[cfg(feature = "local")]
pub const MIN_LOCK_ESCROW_CLAIM_FEE_DURATION: u64 = 1;

#[cfg(not(feature = "local"))]
pub const MIN_LOCK_ESCROW_CLAIM_FEE_DURATION: u64 = 60 * 5; // 5 minutes
