import {
  createInitializeMintInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import fs from "fs";
import { getOrCreateATAInstruction } from "../stake-for-fee/helpers";

export function loadKeypairFromFile(filename: string): Keypair {
  const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
  const secretKey = Uint8Array.from(secret);
  return Keypair.fromSecretKey(secretKey);
}

export async function initializeMintAndMint(
  connection: Connection,
  mintAuthority: Keypair,
  payer: Keypair,
  decimals: number,
  amount: bigint
) {
  const mintKeypair = Keypair.generate();
  const ixs = [];

  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: MINT_SIZE,
    lamports,
    programId: TOKEN_PROGRAM_ID,
  });

  ixs.push(createAccountIx);

  const createMintIx = await createInitializeMintInstruction(
    mintKeypair.publicKey,
    decimals,
    mintAuthority.publicKey,
    null
  );

  ixs.push(createMintIx);

  const { ataPubKey, ix } = await getOrCreateATAInstruction(
    connection,
    mintKeypair.publicKey,
    payer.publicKey,
    payer.publicKey,
    true
  );

  ix && ixs.push(ix);

  const mintIx = await createMintToInstruction(
    mintKeypair.publicKey,
    ataPubKey,
    mintAuthority.publicKey,
    amount
  );

  ixs.push(mintIx);

  const latestBlockhash = await connection.getLatestBlockhash();
  const tx = new Transaction({
    feePayer: payer.publicKey,
    ...latestBlockhash,
  }).add(...ixs);

  tx.sign(mintKeypair, payer);

  const signature = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true,
  });

  console.log("Signature", signature);
  await connection.confirmTransaction({
    signature,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    blockhash: latestBlockhash.blockhash,
  });

  return mintKeypair.publicKey;
}

export const DEVNET_URL = "https://api.devnet.solana.com";
export const DEFAULT_KEYPAIR_PATH = `${process.env.HOME}/.config/solana/id.json`;
