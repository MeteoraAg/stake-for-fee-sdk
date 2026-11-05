use anchor_lang::prelude::*;

declare_program!(stake_for_fee);

pub use stake_for_fee::*;
// Explicit re-exports, the anchor prelude glob also exports `program` and `error` modules
pub use stake_for_fee::program;
// `declare_program!` only generates the `error` module without `idl-build`
#[cfg(not(feature = "idl-build"))]
pub use stake_for_fee::error;
