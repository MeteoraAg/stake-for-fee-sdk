import Decimal from "decimal.js";
import { getLockedEscrowPendingFee } from "./dynamic_amm";
import {
  AccountStates,
  StakeEscrow,
  TopStakerInfo,
  TopStakerListState,
  TopStakerListStateContext,
} from "../types";
import { AccountMeta, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { ALPHA_ACCESS_MINT } from "../constants";

export function getTopStakerListStateEntryStakeAmount(
  topStakerListState: TopStakerListState
) {
  let smallestStakeAmount = new BN("18446744073709551615");

  if (topStakerListState.stakers.length === 0) {
    return new BN(1);
  }

  for (const staker of topStakerListState.stakers) {
    if (staker.stakeAmount.lt(smallestStakeAmount)) {
      smallestStakeAmount = staker.stakeAmount;
    }
  }

  return smallestStakeAmount.add(new BN(1));
}

/** Start of section which will be removed after keeper is done. */
interface RawFeeVaultContext {
  totalRewardA: Decimal;
  totalRewardB: Decimal;
  dailyRewardA: Decimal;
  dailyRewardB: Decimal;
  totalStakers: Decimal;
  totalStakedAmount: Decimal;
}

interface FeeVaultPerformance {
  apr: Decimal;
  apy: Decimal;
  usdPerDay: Decimal;
}

export interface FeeVaultContext {
  prizeUsd: Decimal;
  totalStakeUsd: Decimal;
  performance: FeeVaultPerformance;
  minEntryUsd: Decimal;
  rawContext: RawFeeVaultContext;
}

export function calculateFeeFarmPerformance(
  accountStatesT0: AccountStates,
  accountStatesT1: AccountStates,
  tokenAUIMultiplier: number,
  tokenBUIMultiplier: number,
  stakeTokenUIMultiplier: number,
  tokenAUsdRate: Decimal,
  tokenBUsdRate: Decimal,
  stakeTokenUsdRate: Decimal
): FeeVaultPerformance {
  const secondsElapsed = new Decimal(
    accountStatesT1.clock.unixTimestamp
      .sub(accountStatesT0.clock.unixTimestamp)
      .toString()
  );

  let totalFeeAAmountT1 = accountStatesT1.feeVault.metrics.totalFeeAAmount;
  let totalFeeBAmountT1 = accountStatesT1.feeVault.metrics.totalFeeBAmount;
  const totalFeeAAmountClaimableT1 = getLockedEscrowPendingFee(
    accountStatesT1.clock.unixTimestamp,
    accountStatesT1.feeVault,
    accountStatesT1.lockEscrow,
    accountStatesT1.aVault,
    accountStatesT1.bVault,
    accountStatesT1.aVaultLp,
    accountStatesT1.bVaultLp,
    accountStatesT1.aVaultLpMint,
    accountStatesT1.bVaultLpMint,
    accountStatesT1.poolLpMint
  );
  totalFeeAAmountT1 = totalFeeAAmountT1.add(totalFeeAAmountClaimableT1[0]);
  totalFeeBAmountT1 = totalFeeBAmountT1.add(totalFeeAAmountClaimableT1[1]);

  let totalFeeAAmountT0 = accountStatesT0.feeVault.metrics.totalFeeAAmount;
  let totalFeeBAmountT0 = accountStatesT0.feeVault.metrics.totalFeeBAmount;
  const totalFeeAAmountClaimableT0 = getLockedEscrowPendingFee(
    accountStatesT0.clock.unixTimestamp,
    accountStatesT0.feeVault,
    accountStatesT0.lockEscrow,
    accountStatesT0.aVault,
    accountStatesT0.bVault,
    accountStatesT0.aVaultLp,
    accountStatesT0.bVaultLp,
    accountStatesT0.aVaultLpMint,
    accountStatesT0.bVaultLpMint,
    accountStatesT0.poolLpMint
  );
  totalFeeAAmountT0 = totalFeeAAmountT0.add(totalFeeAAmountClaimableT0[0]);
  totalFeeBAmountT0 = totalFeeBAmountT0.add(totalFeeAAmountClaimableT0[1]);

  const feeAAmount = totalFeeAAmountT1.sub(totalFeeAAmountT0);
  const feeBAmount = totalFeeBAmountT1.sub(totalFeeBAmountT0);

  const feeAAmountUi = new Decimal(feeAAmount.toString()).div(
    new Decimal(tokenAUIMultiplier)
  );

  const feeBAmountUi = new Decimal(feeBAmount.toString()).div(
    new Decimal(tokenBUIMultiplier)
  );

  const feeUsd = feeAAmountUi
    .mul(tokenAUsdRate)
    .add(feeBAmountUi.mul(tokenBUsdRate));

  const usdPerDay = feeUsd.div(secondsElapsed).mul(new Decimal(86400));
  const annualizedFeeUsd = usdPerDay.mul(new Decimal(365));

  const effectiveStakeAmountUi = new Decimal(
    accountStatesT1.feeVault.topStakerInfo.effectiveStakeAmount.toString()
  ).div(stakeTokenUIMultiplier);

  const effectiveUsdAmount = effectiveStakeAmountUi.mul(stakeTokenUsdRate);
  const nominalRate = annualizedFeeUsd.div(effectiveUsdAmount);

  const effectiveRate = new Decimal(1)
    .add(nominalRate.div(new Decimal(365)))
    .pow(new Decimal(365))
    .sub(new Decimal(1));

  return {
    usdPerDay,
    apr: nominalRate.mul(new Decimal(100)),
    apy: effectiveRate.mul(new Decimal(100)),
  };
}

export function parseFeeVaultInfo(
  accountStatesT0: AccountStates,
  accountStatesT1: AccountStates,
  tokenAUsdRate: Decimal,
  tokenBUsdRate: Decimal
): FeeVaultContext {
  const {
    feeVault,
    tokenAMint,
    tokenBMint,
    ammPool,
    topStakerListState,
    clock,
    lockEscrow,
    aVault,
    bVault,
    aVaultLp,
    aVaultLpMint,
    bVaultLp,
    bVaultLpMint,
    poolLpMint,
  } = accountStatesT1;

  const tokenAUIMultiplier = Math.floor(10 ** tokenAMint.decimals);
  const tokenBUIMultiplier = Math.floor(10 ** tokenBMint.decimals);
  const [stakeTokenUIMultiplier, stakeTokenUsdRate] = ammPool.tokenAMint.equals(
    feeVault.stakeMint
  )
    ? [tokenAUIMultiplier, tokenAUsdRate]
    : [tokenBUIMultiplier, tokenBUsdRate];

  const [claimableFeeAAmount, claimableFeeBAmount] = getLockedEscrowPendingFee(
    clock.unixTimestamp,
    feeVault,
    lockEscrow,
    aVault,
    bVault,
    aVaultLp,
    bVaultLp,
    aVaultLpMint,
    bVaultLpMint,
    poolLpMint
  );

  const totalFeeAAmount = new Decimal(
    feeVault.metrics.totalFeeAAmount.add(claimableFeeAAmount).toString()
  ).div(tokenAUIMultiplier);

  const totalFeeBAmount = new Decimal(
    feeVault.metrics.totalFeeBAmount.add(claimableFeeBAmount).toString()
  ).div(tokenBUIMultiplier);

  const prizeUsd = totalFeeAAmount
    .mul(tokenAUsdRate)
    .add(totalFeeBAmount.mul(tokenBUsdRate));

  const totalStakedAmount = new Decimal(
    feeVault.metrics.totalStakedAmount.toString()
  ).div(stakeTokenUIMultiplier);

  const totalStakeUsd = totalStakedAmount.mul(stakeTokenUsdRate);
  const performance = calculateFeeFarmPerformance(
    accountStatesT0,
    accountStatesT1,
    tokenAUIMultiplier,
    tokenBUIMultiplier,
    stakeTokenUIMultiplier,
    tokenAUsdRate,
    tokenBUsdRate,
    stakeTokenUsdRate
  );

  const entryStakeAmount = new Decimal(
    getTopStakerListStateEntryStakeAmount(topStakerListState).toString()
  ).div(stakeTokenUIMultiplier);

  const minEntryUsd = entryStakeAmount.mul(stakeTokenUsdRate);

  const secondsElapsedSinceCreated = new Decimal(
    clock.unixTimestamp.sub(feeVault.createdAt).toString()
  );

  const rawContext: RawFeeVaultContext = {
    totalRewardA: totalFeeAAmount,
    totalRewardB: totalFeeBAmount,
    dailyRewardA: totalFeeAAmount
      .mul(new Decimal(86400))
      .div(secondsElapsedSinceCreated),
    dailyRewardB: totalFeeBAmount
      .mul(new Decimal(86400))
      .div(secondsElapsedSinceCreated),
    totalStakers: new Decimal(
      feeVault.metrics.totalStakeEscrowCount.toString()
    ),
    totalStakedAmount,
  };

  return {
    prizeUsd,
    minEntryUsd,
    totalStakeUsd,
    performance,
    rawContext,
  };
}

export function parseTopStakerListState(
  topStakerInfo: TopStakerInfo,
  topStakerListState: TopStakerListState,
  stakeTokenDecimal: number,
  feeVaultUsdPerDay: Decimal
): Array<TopStakerListStateContext> {
  const stakeTokenUiMultiplier = new Decimal(
    Math.floor(10 ** stakeTokenDecimal)
  );
  const effectiveStakeAmount = new Decimal(
    topStakerInfo.effectiveStakeAmount.toString()
  ).div(stakeTokenUiMultiplier);

  const orderedTopStakers = [...topStakerListState.stakers].sort((a, b) => {
    if (a.stakeAmount.eq(b.stakeAmount)) {
      return a.fullBalanceIndex.cmp(b.fullBalanceIndex);
    } else {
      return b.stakeAmount.cmp(a.stakeAmount);
    }
  });

  return orderedTopStakers.map((staker, idx) => {
    const rank = idx + 1;
    const totalStaked = new Decimal(staker.stakeAmount.toString()).div(
      stakeTokenUiMultiplier
    );

    const earning = totalStaked
      .mul(feeVaultUsdPerDay)
      .div(effectiveStakeAmount);

    return {
      rank,
      wallet: staker.owner,
      totalStaked,
      earning,
    };
  });
}

export function getStakeEscrowEarningPerDay(
  stakeEscrow: StakeEscrow,
  topStakerInfo: TopStakerInfo,
  feeVaultUsdPerDay: Decimal
) {
  if (Boolean(stakeEscrow.inTopList)) {
    return new Decimal(stakeEscrow.stakeAmount.toString())
      .mul(feeVaultUsdPerDay)
      .div(new Decimal(topStakerInfo.effectiveStakeAmount.toString()));
  }

  return new Decimal(0);
}

export function getStakeEscrowEarningPerDayAfterUnstake(
  stakeEscrow: StakeEscrow,
  topStakerInfo: TopStakerInfo,
  unstakeAmount: BN,
  feeVaultUsdPerDay: Decimal
) {
  const newStakeAmount = stakeEscrow.stakeAmount.sub(unstakeAmount);
  const newEffectiveStakeAmount =
    topStakerInfo.effectiveStakeAmount.sub(unstakeAmount);

  if (Boolean(stakeEscrow.inTopList)) {
    return new Decimal(newStakeAmount.toString())
      .mul(feeVaultUsdPerDay)
      .div(new Decimal(newEffectiveStakeAmount.toString()));
  }

  return new Decimal(0);
}
/** End of section which will be removed after keeper is done. */

export function getAlphaAccessTokenRemainingAccounts(
  user: PublicKey
): AccountMeta[] {
  const userAccessToken = getAssociatedTokenAddressSync(
    ALPHA_ACCESS_MINT,
    user
  );

  return [
    {
      pubkey: userAccessToken,
      isSigner: false,
      isWritable: false,
    },
  ];
}
