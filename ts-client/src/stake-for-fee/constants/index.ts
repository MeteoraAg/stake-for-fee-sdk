import { PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

export const STAKE_FOR_FEE_PROGRAM_ID = new PublicKey(
  "sTa7e5hJXkG9gQPGrjqycxw2mfSFJmW8B5HiqQsnJ1N"
);

export const DYNAMIC_AMM_PROGRAM_ID = new PublicKey(
  "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"
);

export const DYNAMIC_VAULT_PROGRAM_ID = new PublicKey(
  "24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi"
);

export const FULL_BALANCE_LIST_HARD_LIMIT = new BN(10000);
export const U64_MAX = new BN("18446744073709551615");
