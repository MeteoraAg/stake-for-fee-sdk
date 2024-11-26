import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { StakeForFee, IDL as StakeForFeeIDL } from "../idls/stake_for_fee";
import { Amm, IDL as DynamicAmmIDL } from "../idls/dynamic_amm";
import { Vault, IDL as DynamicVaultIDL } from "../idls/dynamic_vault";

import {
  deriveFullBalanceList,
  deriveStakeEscrow,
  deriveTopStakerList,
} from "./pda";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";

export interface GetOrCreateStakeEscrowResponse {
  stakeEscrowKey: PublicKey;
  ix: TransactionInstruction;
}

export interface GetOrCreateATAResponse {
  ataPubKey: PublicKey;
  ix?: TransactionInstruction;
}

/**
 * Creates an anchor program instance for the stake-for-fee program.
 *
 * @param connection The connection to use.
 * @param programId The program id of the stake-for-fee program. Defaults to the idl program id.
 * @returns A Program instance for the stake-for-fee program.
 */
export function createStakeFeeProgram(
  connection: Connection,
  programId: PublicKey
): Program<StakeForFee> {
  const provider = new AnchorProvider(
    connection,
    {} as any,
    AnchorProvider.defaultOptions()
  );

  return new Program(StakeForFeeIDL, programId, provider);
}
/**
 * Creates an instance of the dynamic AMM program client.
 *
 * @param connection The Solana connection to use.
 * @param programId The program id of the dynamic AMM program.
 * @returns An instance of the dynamic AMM program client.
 */

export function createDynamicAmmProgram(
  connection: Connection,
  programId: PublicKey
): Program<Amm> {
  const provider = new AnchorProvider(
    connection,
    {} as any,
    AnchorProvider.defaultOptions()
  );

  return new Program(DynamicAmmIDL, programId, provider);
}

/**
 * Creates an instance of the dynamic Vault program client.
 *
 * @param connection The Solana connection to use.
 * @param programId The program id of the dynamic Vault program.
 * @returns An instance of the dynamic Vault program client.
 */
export function createDynamicVaultProgram(
  connection: Connection,
  programId: PublicKey
): Program<Vault> {
  const provider = new AnchorProvider(
    connection,
    {} as any,
    AnchorProvider.defaultOptions()
  );

  return new Program(DynamicVaultIDL, programId, provider);
}

/**
 * Gets the stake escrow key for the given owner and vault.
 *
 * If the stake escrow account does not exist, this instruction creates it.
 *
 * @param connection The solana connection to use.
 * @param feeVaultKey The vault to get the stake escrow key for.
 * @param ownerKey The owner to get the stake escrow key for.
 * @param payerKey The payer to pay for the account rent.
 * @param programId The program id of the stake-for-fee program.
 * @returns An object containing the stake escrow key and the instruction to create the account if it doesn't exist.
 */
export async function getOrCreateStakeEscrowInstruction(
  connection: Connection,
  feeVaultKey: PublicKey,
  ownerKey: PublicKey,
  programId: PublicKey
): Promise<GetOrCreateStakeEscrowResponse> {
  const stakeEscrowKey = deriveStakeEscrow(feeVaultKey, ownerKey, programId);
  const fullBalanceListKey = deriveFullBalanceList(feeVaultKey, programId);
  const topStakerListKey = deriveTopStakerList(feeVaultKey, programId);
  const stakeEscrowAccount = await connection.getAccountInfo(stakeEscrowKey);

  if (!stakeEscrowAccount) {
    const stakeForFeeProgram = createStakeFeeProgram(connection, programId);
    const ix = await stakeForFeeProgram.methods
      .initializeStakeEscrow()
      .accounts({
        vault: feeVaultKey,
        fullBalanceList: fullBalanceListKey,
        topStakerList: topStakerListKey,
        escrow: stakeEscrowKey,
        owner: ownerKey,
        systemProgram: SystemProgram.programId,
        payer: ownerKey,
      })
      .instruction();
    return {
      stakeEscrowKey,
      ix,
    };
  } else {
    return {
      stakeEscrowKey,
      ix: null,
    };
  }
}

/**
 * Gets the associated token account for the given mint and owner, or creates
 * it if it doesn't exist.
 *
 * @param connection The solana connection to use.
 * @param tokenMint The mint of the token to get the associated token account for.
 * @param owner The owner of the associated token account.
 * @param payer The payer of the transaction if the account needs to be created.
 * @param allowOwnerOffCurve Allow the owner to be off the curve.
 * @returns An object containing the associated token account public key and the instruction to create the account if it doesn't exist.
 */
export const getOrCreateATAInstruction = async (
  connection: Connection,
  tokenMint: PublicKey,
  owner: PublicKey,
  payer: PublicKey = owner,
  allowOwnerOffCurve = true
): Promise<GetOrCreateATAResponse> => {
  const toAccount = getAssociatedTokenAddressSync(
    tokenMint,
    owner,
    allowOwnerOffCurve
  );

  try {
    const account = await connection.getAccountInfo(toAccount);

    if (!account) {
      const ix = createAssociatedTokenAccountInstruction(
        payer,
        toAccount,
        owner,
        tokenMint
      );

      return { ataPubKey: toAccount, ix };
    }

    return { ataPubKey: toAccount, ix: undefined };
  } catch (e) {
    if (
      e instanceof TokenAccountNotFoundError ||
      e instanceof TokenInvalidAccountOwnerError
    ) {
      const ix = createAssociatedTokenAccountInstruction(
        payer,
        toAccount,
        owner,
        tokenMint
      );

      return { ataPubKey: toAccount, ix };
    } else {
      /* handle error */
      console.error("Error::getOrCreateATAInstruction", e);
      throw e;
    }
  }
};
