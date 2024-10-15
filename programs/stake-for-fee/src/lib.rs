use anchor_lang::prelude::*;

#[cfg(feature = "local")]
declare_id!("M5c95Zio3HQ1gvQ3pjhh8BsscrDcKnN28gxnQD1E17U");

#[cfg(not(feature = "local"))]
declare_id!("fEepkSV8Bqq9JJTC1zSe4X6cW1GJUpHFkJpfJUjxo8J");

mod constant;
mod errors;
mod events;
mod instructions;
mod pda;
mod states;

use instructions::*;

#[program]
pub mod stake_for_fee {
    use super::*;

    #[allow(unused_variables)]
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        custom_start_claim_fee_timestamp: Option<i64>,
    ) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    pub fn initialize_stake_escrow(ctx: Context<InitializeStakeEscrow>) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    pub fn stake<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, Stake<'info>>,
        max_amount: u64,
    ) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    pub fn claim_fee(ctx: Context<ClaimFee>, max_fee_a: u64, max_fee_b: u64) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    pub fn request_unstake<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, RequestUnstake<'info>>,
        unstake_amount: u64,
    ) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    pub fn cancel_unstake<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, CancelUnstake<'info>>,
    ) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    pub fn claim_fee_crank(ctx: Context<ClaimFeeCrank>) -> Result<()> {
        Ok(())
    }

    /// To force IDL generation for some struct for easier TS decoding later
    pub fn _dummy(_ctx: Context<Dummy>) -> Result<()> {
        Ok(())
    }

    /**  Start of admin only endpoints **/
    #[allow(unused_variables)]
    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        params: InitializeConfigParams,
    ) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    pub fn close_config(ctx: Context<CloseConfig>) -> Result<()> {
        Ok(())
    }
}
