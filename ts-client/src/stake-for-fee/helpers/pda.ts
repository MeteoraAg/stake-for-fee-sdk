import { PublicKey } from "@solana/web3.js";
import { DYNAMIC_AMM_PROGRAM_ID } from "../constants";

export const deriveLockEscrowPda = (
  pool: PublicKey,
  owner: PublicKey,
  ammProgram: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("lock_escrow"), pool.toBuffer(), owner.toBuffer()],
    ammProgram
  );
};

export const deriveFeeVault = (pool: PublicKey, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), pool.toBytes()],
    programId
  )[0];
};

export const deriveStakeTokenVault = (
  vault: PublicKey,
  programId: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("stake_vault"), vault.toBytes()],
    programId
  )[0];
};

export const deriveTopStakerList = (vault: PublicKey, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("list"), vault.toBytes()],
    programId
  )[0];
};

export const deriveFullBalanceList = (
  vault: PublicKey,
  programId: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("balance"), vault.toBytes()],
    programId
  )[0];
};

export const deriveStakeEscrow = (
  vault: PublicKey,
  owner: PublicKey,
  programId: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), vault.toBytes(), owner.toBytes()],
    programId
  )[0];
};

export const deriveLpMint = (
  poolAddress: PublicKey,
  programId: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("lp_mint"), poolAddress.toBuffer()],
    new PublicKey(programId || DYNAMIC_AMM_PROGRAM_ID)
  )[0];
};

