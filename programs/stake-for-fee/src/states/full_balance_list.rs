#![allow(dead_code)]
use anchor_lang::prelude::*;
use std::cell::RefMut;

#[account(zero_copy)]
#[derive(InitSpace, Debug, Default)]
pub struct FullBalanceListMetadata {
    pub vault: Pubkey,
    pub length: u64,
}

#[zero_copy]
#[derive(InitSpace, Debug, Default)]
pub struct StakerBalance {
    /// Balance
    pub balance: u64,
    /// Owner pubkey, we dont need this for logic, but it is useful for indexing
    pub owner: Pubkey,
    /// In top list
    pub is_in_top_list: u8,
    /// Padding
    pub padding: [u8; 7],
}

#[derive(Debug)]
pub struct FullBalanceList<'a> {
    pub metadata: RefMut<'a, FullBalanceListMetadata>,
    pub staker_balances: RefMut<'a, [StakerBalance]>,
}

impl<'a> FullBalanceList<'a> {
    pub fn new(
        metadata: RefMut<'a, FullBalanceListMetadata>,
        staker_balances: RefMut<'a, [StakerBalance]>,
    ) -> Self {
        Self {
            metadata,
            staker_balances,
        }
    }

    pub fn from_account_loader<'info>(
        full_balance_list_al: &'a AccountLoader<'info, FullBalanceListMetadata>,
    ) -> Result<Self> {
        full_balance_list_account_split(full_balance_list_al)
    }
}

fn full_balance_list_account_split<'a, 'info>(
    full_balance_list_al: &'a AccountLoader<'info, FullBalanceListMetadata>,
) -> Result<FullBalanceList<'a>> {
    let data = full_balance_list_al.as_ref().try_borrow_mut_data()?;

    let (metadata, staker_balances) = RefMut::map_split(data, |data| {
        let (metadata_bytes, balances_bytes) =
            data.split_at_mut(8 + FullBalanceListMetadata::INIT_SPACE);
        let metadata =
            bytemuck::from_bytes_mut::<FullBalanceListMetadata>(&mut metadata_bytes[8..]);
        let staker_balances = bytemuck::cast_slice_mut::<u8, StakerBalance>(balances_bytes);
        (metadata, staker_balances)
    });

    Ok(FullBalanceList::new(metadata, staker_balances))
}
