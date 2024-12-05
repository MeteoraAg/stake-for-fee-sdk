import { BN } from "bn.js";
import {
  FullBalanceListState,
  StakerBalance,
  StakerMetadata,
  TopStakerListState,
} from "../../stake-for-fee/types";
import { PublicKey } from "@solana/web3.js";
import { FULL_BALANCE_LIST_HARD_LIMIT } from "../../stake-for-fee/constants";

const smallestStaker0: StakerMetadata = {
  fullBalanceIndex: new BN(1),
  stakeAmount: new BN(0),
  owner: PublicKey.unique(),
};

const smallestStaker1: StakerMetadata = {
  fullBalanceIndex: new BN(0),
  stakeAmount: new BN(0),
  owner: PublicKey.unique(),
};

const smallestStaker2: StakerMetadata = {
  fullBalanceIndex: new BN(2),
  stakeAmount: new BN(1),
  owner: PublicKey.unique(),
};

export function setupTopStakerListWithPredefinedSmallestStakers(
  extraStakerCount: number,
  extraListLength: number
) {
  const stakers: StakerMetadata[] = [
    smallestStaker0,
    smallestStaker1,
    smallestStaker2,
  ];

  const startingStakeAmount = smallestStaker2.stakeAmount.toNumber();
  const maxStakingAmount = 1_000_000;

  for (let i = 0; i < extraListLength; i++) {
    if (i < extraStakerCount) {
      const fullBalanceIndex = Math.floor(
        stakers.length +
          Math.random() *
            (FULL_BALANCE_LIST_HARD_LIMIT.toNumber() - stakers.length + 1)
      );

      const stakeAmount = Math.floor(
        startingStakeAmount +
          Math.random() * (maxStakingAmount - startingStakeAmount + 1)
      );

      stakers.push({
        fullBalanceIndex: new BN(fullBalanceIndex),
        stakeAmount: new BN(stakeAmount),
        owner: PublicKey.unique(),
      });
    } else {
      stakers.push({
        fullBalanceIndex: new BN(-1),
        stakeAmount: new BN(0),
        owner: PublicKey.default,
      });
    }
  }

  // Shuffle
  stakers.sort((a, b) => {
    return Math.random() - 0.5;
  });

  const vault = PublicKey.unique();

  const topStakerListState: TopStakerListState = {
    metadata: {
      vault,
    },
    stakers,
  };

  return {
    topStakerListState,
    smallestStaker0,
    smallestStaker1,
    smallestStaker2,
  };
}

export function setupFullBalanceList(
  topStakerCount: number,
  nonTopStakerCount: number
): FullBalanceListState {
  const minTopListStakeAmount = 1_000_000;
  const maxTopListStakeAmount = 1_000_000_000;

  const stakers: StakerBalance[] = [];

  for (let i = 0; i < topStakerCount; i++) {
    const stakeAmount = Math.floor(
      minTopListStakeAmount +
        Math.random() * (maxTopListStakeAmount - minTopListStakeAmount + 1)
    );

    stakers.push({
      balance: new BN(stakeAmount),
      owner: PublicKey.unique(),
      isInTopList: Number(true),
      padding: [],
    });
  }

  for (let i = 0; i < nonTopStakerCount; i++) {
    const stakeAmount = Math.floor(
      1_000 + Math.random() * minTopListStakeAmount - 1_000 - 1
    );

    stakers.push({
      balance: new BN(stakeAmount),
      owner: PublicKey.unique(),
      isInTopList: Number(false),
      padding: [],
    });
  }

  for (
    let i = 0;
    i <
    FULL_BALANCE_LIST_HARD_LIMIT.toNumber() -
      (topStakerCount + nonTopStakerCount);
    i++
  ) {
    stakers.push({
      balance: new BN(0),
      owner: PublicKey.default,
      isInTopList: Number(false),
      padding: [],
    });
  }

  // Shuffle
  stakers.sort((a, b) => {
    return Math.random() - 0.5;
  });

  return {
    metadata: {
      vault: PublicKey.unique(),
      length: new BN(topStakerCount + nonTopStakerCount),
    },
    stakers,
  };
}
