import { BN, IdlAccounts, IdlTypes, Program } from "@coral-xyz/anchor";
import { StakeForFee } from "../idls/stake_for_fee";
import { Amm } from "../idls/dynamic_amm";
import { Vault } from "../idls/dynamic_vault";
import { i64, struct, u64 } from "@coral-xyz/borsh";
import { RawAccount, RawMint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import Decimal from "decimal.js";

export interface AccountStates {
  feeVault: FeeVault;
  fullBalanceListState: FullBalanceListState;
  topStakerListState: TopStakerListState;
  aVault: DynamicVault;
  bVault: DynamicVault;
  aVaultLp: RawAccount;
  bVaultLp: RawAccount;
  aVaultLpMint: RawMint;
  bVaultLpMint: RawMint;
  tokenAMint: RawMint;
  tokenBMint: RawMint;
  stakeMint: RawMint;
  ammPool: DynamicPool;
  poolLpMint: RawMint;
  lockEscrow: LockEscrow;
  clock: Clock;
}

// Stake for fee program
export type StakeForFeeProgram = Program<StakeForFee>;
export type FeeVault = IdlAccounts<StakeForFee>["feeVault"];
export type FullBalanceListMetadata =
  IdlAccounts<StakeForFee>["fullBalanceListMetadata"];
export type StakeEscrow = IdlAccounts<StakeForFee>["stakeEscrow"];
export type TopListMetadata = IdlAccounts<StakeForFee>["topListMetadata"];
export type StakerMetadata = IdlTypes<StakeForFee>["StakerMetadata"];
export type StakerBalance = IdlTypes<StakeForFee>["StakerBalance"];
export type Metrics = IdlTypes<StakeForFee>["Metrics"];
export type TopStakerInfo = IdlTypes<StakeForFee>["TopStakerInfo"];

export interface FullBalanceListState {
  metadata: FullBalanceListMetadata;
  stakers: Array<StakerBalance>;
}

export interface TopStakerListState {
  metadata: TopListMetadata;
  stakers: Array<StakerMetadata>;
}

export const MIN_LOCK_ESCROW_CLAIM_FEE_DURATION: BN = new BN(300);

// Dynamic amm program
export type DynamicAmmProgram = Program<Amm>;
export type DynamicPool = IdlAccounts<Amm>["pool"];
export type LockEscrow = IdlAccounts<Amm>["lockEscrow"];

// Dynamic vault program
export type DynamicVaultProgram = Program<Vault>;
export type DynamicVault = IdlAccounts<Vault>["vault"];

// Misc
export const ClockLayout = struct([
  u64("slot"),
  i64("epochStartTimestamp"),
  u64("epoch"),
  u64("leaderScheduleEpoch"),
  i64("unixTimestamp"),
]);

export interface Clock {
  slot: BN;
  epochStartTimestamp: BN;
  epoch: BN;
  leaderScheduleEpoch: BN;
  unixTimestamp: BN;
}

export interface TopStakerListStateContext {
  rank: number;
  wallet: PublicKey;
  totalStaked: Decimal;
  earning: Decimal;
}
