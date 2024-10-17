import { ComputeBudgetProgram } from "@solana/web3.js";

export const computeUnitIx = () => {
  return ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_400_000,
  });
};
