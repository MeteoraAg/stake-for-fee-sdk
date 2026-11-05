import BN from "bn.js";
import { DynamicVault } from "../types";

const LOCKED_PROFIT_DEGRADATION_DENOMINATOR = new BN(1_000_000_000_000);
// Vault version that tracks LP supply in `vault.totalLpSupply` instead of `lpMint.supply`
const VAULT_VERSION_TRACKED_LP_SUPPLY = 1;

function calculateLockedProfit(currentTime: BN, dynamicVault: DynamicVault) {
  const duration = currentTime.sub(dynamicVault.lockedProfitTracker.lastReport);
  const lockedFundRatio = duration.mul(
    dynamicVault.lockedProfitTracker.lockedProfitDegradation
  );

  if (lockedFundRatio.gt(LOCKED_PROFIT_DEGRADATION_DENOMINATOR)) {
    return new BN(0);
  }

  const lockedProfit = dynamicVault.lockedProfitTracker.lastUpdatedLockedProfit
    .mul(LOCKED_PROFIT_DEGRADATION_DENOMINATOR.sub(lockedFundRatio))
    .div(LOCKED_PROFIT_DEGRADATION_DENOMINATOR);

  return lockedProfit;
}

export function getUnlockedAmount(currentTime: BN, dynamicVault: DynamicVault) {
  return dynamicVault.totalAmount.sub(
    calculateLockedProfit(currentTime, dynamicVault)
  );
}

/**
 * LP supply used for share pricing based on the vault version.
 * @throws When the tracked supply is smaller than the LP mint supply.
 */
export function getVaultLpSupply(dynamicVault: DynamicVault, lpMintSupply: BN) {
  if (dynamicVault.version === VAULT_VERSION_TRACKED_LP_SUPPLY) {
    if (dynamicVault.totalLpSupply.lt(lpMintSupply)) {
      throw new Error("Invalid vault LP supply accounting");
    }
    return dynamicVault.totalLpSupply;
  }
  return lpMintSupply;
}

export function getAmountByShare(
  currentTime: BN,
  dynamicVault: DynamicVault,
  share: BN,
  totalSupply: BN
) {
  const totalAmount = getUnlockedAmount(currentTime, dynamicVault);
  return totalAmount.mul(share).div(totalSupply);
}
