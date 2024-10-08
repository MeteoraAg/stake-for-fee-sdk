import BN from "bn.js";
import {
  DynamicPool,
  DynamicVault,
  FeeVault,
  LockEscrow,
  MIN_LOCK_ESCROW_CLAIM_FEE_DURATION,
} from "../types";
import {
  getAmountByShare,
  getAmountByShare as getAmountByShareWithLockedProfit,
} from "./dynamic_vault";
import { RawAccount, RawMint } from "@solana/spl-token";
import Decimal from "decimal.js";

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
    new BN(aVaultLpMint.supply.toString())
  );

  const tokenBAmount = getAmountByShareWithLockedProfit(
    currentTime,
    bVault,
    new BN(bVaultLp.amount.toString()),
    new BN(bVaultLpMint.supply.toString())
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
  const d = new BN(new Decimal(k.toString()).sqrt().toString());
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
  poolLpMint: RawMint
) {
  if (currentTime.lte(feeVault.topStakerInfo.lastClaimFeeAt)) {
    return [new BN(0), new BN(0)];
  }

  const secondsElapsedSinceLastClaim = currentTime.sub(
    feeVault.topStakerInfo.lastClaimFeeAt
  );

  const firstClaimFeeExecuted = feeVault.topStakerInfo.lastClaimFeeAt.gt(
    feeVault.configuration.startClaimFeeTimestamp
  );

  if (
    firstClaimFeeExecuted &&
    secondsElapsedSinceLastClaim.lt(MIN_LOCK_ESCROW_CLAIM_FEE_DURATION)
  ) {
    return [new BN(0), new BN(0)];
  }

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
    new BN(poolLpMint.supply.toString())
  );

  const newFee = currentLpPerToken.gt(lockEscrow.lpPerToken)
    ? lockEscrow.totalLockedAmount.mul(
        currentLpPerToken.sub(lockEscrow.lpPerToken).div(currentLpPerToken)
      )
    : new BN(0);

  if (newFee.isZero()) {
    return [new BN(0), new BN(0)];
  }

  const aVaultLpToBurn = newFee
    .mul(new BN(aVaultLp.amount.toString()))
    .div(new BN(poolLpMint.supply.toString()));

  const bVaultLpToBurn = newFee
    .mul(new BN(bVaultLp.amount.toString()))
    .div(new BN(poolLpMint.supply.toString()));

  const feeA = getAmountByShare(
    currentTime,
    aVault,
    aVaultLpToBurn,
    new BN(aVaultLpMint.supply.toString())
  );

  const feeB = getAmountByShare(
    currentTime,
    bVault,
    bVaultLpToBurn,
    new BN(bVaultLpMint.supply.toString())
  );

  return [feeA, feeB];
}
