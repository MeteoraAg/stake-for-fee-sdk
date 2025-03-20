import {
  createCloseAccountInstruction,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
} from "@solana/spl-token";
import { ComputeBudgetProgram, PublicKey } from "@solana/web3.js";

export const computeUnitIx = (units?: number) => {
  return ComputeBudgetProgram.setComputeUnitLimit({
    units: units ?? 1_400_000,
  });
};

export const unwrapSOLInstruction = async (owner: PublicKey) => {
  const wSolATAAccount = getAssociatedTokenAddressSync(
    NATIVE_MINT,
    owner,
    true
  );
  if (wSolATAAccount) {
    const closedWrappedSolInstruction = createCloseAccountInstruction(
      wSolATAAccount,
      owner,
      owner
    );
    return closedWrappedSolInstruction;
  }
  return null;
};
