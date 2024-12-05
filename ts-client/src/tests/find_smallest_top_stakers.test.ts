import { findReplaceableTopStaker } from "../stake-for-fee/helpers";
import { setupTopStakerListWithPredefinedSmallestStakers } from "./utils/top_staker_list";

describe("Find staker for remaining account", () => {
  describe("Find smallest top staker for replacement", () => {
    describe("When top staker list is not full", () => {
      it("Return correct smallest staker", () => {
        const extraStakerCount = 50;
        // 3 smallest stake escrow
        const listLength = extraStakerCount * 2;

        const {
          topStakerListState,
          smallestStaker0,
          smallestStaker1,
          smallestStaker2,
        } = setupTopStakerListWithPredefinedSmallestStakers(
          extraStakerCount,
          listLength
        );

        const lookupNumber = 3;

        const ascOrderedTopStaker = [
          smallestStaker0,
          smallestStaker1,
          smallestStaker2,
        ];

        for (let i = 1; i <= lookupNumber; i++) {
          const smallestTopStakers = findReplaceableTopStaker(
            i,
            topStakerListState
          );

          expect(smallestTopStakers.length).toBe(i);

          for (const [j, staker] of smallestTopStakers.entries()) {
            expect(ascOrderedTopStaker[j].owner.toBase58()).toBe(
              staker.owner.toBase58()
            );
          }
        }
      });
    });

    describe("When top staker list is full", () => {
      it("Return correct smallest staker", () => {
        const extraStakerCount = 50;
        // 3 smallest stake escrow
        const listLength = extraStakerCount * 2;

        const {
          topStakerListState,
          smallestStaker0,
          smallestStaker1,
          smallestStaker2,
        } = setupTopStakerListWithPredefinedSmallestStakers(
          extraStakerCount,
          listLength
        );

        const lookupNumber = 3;

        const ascOrderedTopStaker = [
          smallestStaker0,
          smallestStaker1,
          smallestStaker2,
        ];

        for (let i = 1; i <= lookupNumber; i++) {
          const smallestTopStakers = findReplaceableTopStaker(
            i,
            topStakerListState
          );

          expect(smallestTopStakers.length).toBe(i);

          for (const [j, staker] of smallestTopStakers.entries()) {
            expect(ascOrderedTopStaker[j].owner.toBase58()).toBe(
              staker.owner.toBase58()
            );
          }
        }
      });
    });

    describe("When lookup number > list", () => {
      it("Return all top staker", () => {
        const extraStakerCount = 100;
        // 3 smallest stake escrow
        const listLength = extraStakerCount + 3;

        const { topStakerListState } =
          setupTopStakerListWithPredefinedSmallestStakers(
            extraStakerCount,
            listLength
          );

        const lookupNumber = listLength + 20;

        for (let i = 1; i <= lookupNumber; i++) {
          const smallestTopStakers = findReplaceableTopStaker(
            i,
            topStakerListState
          );

          expect(smallestTopStakers.length).toBe(Math.min(i, listLength));

          for (let j = 1; j < smallestTopStakers.length; j++) {
            let j_0 = j - 1;
            const smallerStaker = smallestTopStakers[j_0];
            const currentStaker = smallestTopStakers[j];

            if (currentStaker.stakeAmount.eq(smallerStaker.stakeAmount)) {
              expect(
                currentStaker.fullBalanceIndex.lt(
                  smallerStaker.fullBalanceIndex
                )
              ).toBeTruthy();
            } else {
              expect(
                currentStaker.stakeAmount.gt(smallerStaker.stakeAmount)
              ).toBeTruthy();
            }
          }
        }
      });
    });
  });
});
