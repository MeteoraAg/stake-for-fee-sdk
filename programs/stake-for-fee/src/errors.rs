use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Escrow owner is not vault")]
    InvalidEscrowOwner,

    #[msg("Invalid top list length")]
    InvalidTopListLength,

    #[msg("Invalid seconds to full unlock")]
    InvalidSecondsToFullUnlock,

    #[msg("Pool missing SOL/USDC token or invalid stake mint")]
    MustHaveQuoteTokenOrInvalidStakeMint,

    #[msg("Missing dropped stake escrow")]
    MissingDroppedStakeEscrow,

    #[msg("Invalid stake escrow")]
    InvalidStakeEscrow,

    #[msg("Full balance list is full")]
    FullBalanceListFull,

    #[msg("Invalid stake mint")]
    InvalidStakeMint,

    #[msg("Insufficient stake amount")]
    InsufficientStakeAmount,

    #[msg("Unstake amount release date not reached")]
    CannotWithdrawUnstakeAmount,

    #[msg("Invalid admin")]
    InvalidAdmin,

    #[msg("Invalid unstake lock duration")]
    InvalidUnstakeLockDuration,

    #[msg("Invalid join window duration")]
    InvalidJoinWindowDuration,

    #[msg("Invalid custom start claim fee timestamp")]
    InvalidCustomStartClaimFeeTimestamp,

    #[msg("Invalid smallest stake escrow")]
    InvalidSmallestStakeEscrow,

    #[msg("MathOverflow")]
    MathOverflow,

    #[msg("Type casting failed")]
    TypeCastFailed,

    #[msg("Invalid lock escrow related accounts")]
    InvalidLockEscrowRelatedAccounts,

    #[msg("Only constant product pool is supported")]
    OnlyConstantProductPool,

    #[msg("Undetermined error")]
    UndeterminedError,
}
