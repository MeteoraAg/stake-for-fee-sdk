import { PublicKey } from "@solana/web3.js";
import { STAKE_FOR_FEE_PROGRAM_ID } from "../stake-for-fee/constants";
import { findLargestStakerNotInTopListFromFullBalanceList } from "../stake-for-fee/helpers";
import { FullBalanceListState, StakerBalance } from "../stake-for-fee/types";
import { setupFullBalanceList } from "./utils/top_staker_list";
import { BN } from "bn.js";

describe("Find smallest staker not in top list from full balance list", () => {
  it("Return correct smallest staker without top staker", () => {
    const topStakerCount = 20;
    const nonTopStakerCount = 40;

    const fullBalanceList = setupFullBalanceList(
      topStakerCount,
      nonTopStakerCount
    );

    const largestStaker = findLargestStakerNotInTopListFromFullBalanceList(
      topStakerCount + nonTopStakerCount,
      fullBalanceList
    );

    const haveTopStaker =
      largestStaker.filter((s) => Boolean(s.isInTopList)).length > 0;
    expect(haveTopStaker).toBe(false);

    for (let i = 1; i < largestStaker.length; i++) {
      let i_0 = i - 1;
      const largerStaker = largestStaker[i_0];
      const currentStaker = largestStaker[i];

      expect(currentStaker.balance.lte(largerStaker.balance)).toBe(true);
    }
  });

  it("Have correct sorting when balance is equal", () => {
    const owner1 = PublicKey.unique();
    const owner2 = PublicKey.unique();
    const owner3 = PublicKey.unique();

    const stakers: StakerBalance[] = [owner1, owner2, owner3].map((owner) => {
      return {
        balance: new BN(100),
        isInTopList: Number(false),
        owner,
        padding: [],
      };
    });

    const fullBalanceListState: FullBalanceListState = {
      metadata: {
        vault: PublicKey.unique(),
        length: new BN(stakers.length),
      },
      stakers,
    };

    const largestStaker = findLargestStakerNotInTopListFromFullBalanceList(
      2,
      fullBalanceListState
    );
    expect(largestStaker.length).toBe(2);

    expect(largestStaker[0].owner.toBase58()).toBe(owner1.toBase58());
    expect(largestStaker[1].owner.toBase58()).toBe(owner2.toBase58());
  });
});
