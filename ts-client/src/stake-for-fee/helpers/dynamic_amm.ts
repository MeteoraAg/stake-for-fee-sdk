import BN from "bn.js";
import {
  DynamicPool,
  DynamicVault,
  FeeVault,
  LockEscrow,
} from "../types";
import {
  getAmountByShare,
  getAmountByShare as getAmountByShareWithLockedProfit,
  getVaultLpSupply,
} from "./dynamic_vault";
import { RawAccount, RawMint } from "@solana/spl-token";
import Decimal from "decimal.js";

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map(
    (_, index) => array.slice(index * size, (index + 1) * size)
  );
}

/**
 * LP supply tracked by the pool. Must be >= on-chain lp mint supply, else the pool accounting is not patched yet.
 * @throws When the tracked supply is smaller than the LP mint supply.
 */
export function getPoolLpSupply(pool: DynamicPool, lpMintSupply: BN) {
  if (pool.lpMintSupply.lt(lpMintSupply)) {
    throw new Error("Invalid pool LP supply accounting");
  }
  return pool.lpMintSupply;
}

export function getTokenBalances(
  currentTime: BN,
  aVault: DynamicVault,
  bVault: DynamicVault,
  aVaultLp: RawAccount,
  bVaultLp: RawAccount,
  aVaultLpMint: RawMint,
  bVaultLpMint: RawMint
) {
  const tokenAAmount = getAmountByShareWithLockedProfit(
    currentTime,
    aVault,
    new BN(aVaultLp.amount.toString()),
    getVaultLpSupply(aVault, new BN(aVaultLpMint.supply.toString()))
  );

  const tokenBAmount = getAmountByShareWithLockedProfit(
    currentTime,
    bVault,
    new BN(bVaultLp.amount.toString()),
    getVaultLpSupply(bVault, new BN(bVaultLpMint.supply.toString()))
  );

  return [tokenAAmount, tokenBAmount];
}

export function getVirtualPrice(
  tokenAAmount: BN,
  tokenBAmount: BN,
  lpSupply: BN
) {
  if (lpSupply.isZero()) {
    return new BN(0);
  }

  // Stake for fee only support constant product pool
  const k = tokenAAmount.mul(tokenBAmount);
  const d = new BN(new Decimal(k.toString()).sqrt().floor().toString());
  return d.shln(64).div(lpSupply);
}

export function getLockedEscrowPendingFee(
  currentTime: BN,
  feeVault: FeeVault,
  lockEscrow: LockEscrow,
  aVault: DynamicVault,
  bVault: DynamicVault,
  aVaultLp: RawAccount,
  bVaultLp: RawAccount,
  aVaultLpMint: RawMint,
  bVaultLpMint: RawMint,
  poolLpMint: RawMint,
  pool: DynamicPool
) {
  // Lock escrow fee is claimed only once. The remaining fee is never claimed.
  // The program skips the claim of an empty lock escrow, but still marks the final fee as claimed.
  if (Boolean(feeVault.finalFeeClaimed) || lockEscrow.totalLockedAmount.isZero()) {
    return [new BN(0), new BN(0)];
  }

  const poolLpSupply = getPoolLpSupply(
    pool,
    new BN(poolLpMint.supply.toString())
  );

  const [tokenAAmount, tokenBAmount] = getTokenBalances(
    currentTime,
    aVault,
    bVault,
    aVaultLp,
    bVaultLp,
    aVaultLpMint,
    bVaultLpMint
  );

  const currentLpPerToken = getVirtualPrice(
    tokenAAmount,
    tokenBAmount,
    poolLpSupply
  );

  const newFee = currentLpPerToken.gt(lockEscrow.lpPerToken)
    ? lockEscrow.totalLockedAmount
        .mul(currentLpPerToken.sub(lockEscrow.lpPerToken))
        .div(currentLpPerToken)
    : new BN(0);

  // The dynamic AMM claims the unclaimed pending fee together with the new fee
  const totalFee = newFee.add(lockEscrow.unclaimedFeePending);

  if (totalFee.isZero()) {
    return [new BN(0), new BN(0)];
  }

  const aVaultLpToBurn = totalFee
    .mul(new BN(aVaultLp.amount.toString()))
    .div(poolLpSupply);

  const bVaultLpToBurn = totalFee
    .mul(new BN(bVaultLp.amount.toString()))
    .div(poolLpSupply);

  const feeA = getAmountByShare(
    currentTime,
    aVault,
    aVaultLpToBurn,
    getVaultLpSupply(aVault, new BN(aVaultLpMint.supply.toString()))
  );

  const feeB = getAmountByShare(
    currentTime,
    bVault,
    bVaultLpToBurn,
    getVaultLpSupply(bVault, new BN(bVaultLpMint.supply.toString()))
  );

  return [feeA, feeB];
}
