import { AccountInfo } from "@solana/web3.js";
import {
  FeeVault,
  FullBalanceListMetadata,
  FullBalanceListState,
  StakeForFeeProgram,
  StakerBalance,
  TopListMetadata,
  TopStakerListState,
} from "../types";

export function decodeFullBalanceState(
  stakeForFeeProgram: StakeForFeeProgram,
  account: AccountInfo<Buffer>
): FullBalanceListState {
  const metadata: FullBalanceListMetadata =
    stakeForFeeProgram.coder.accounts.decode(
      "fullBalanceListMetadata",
      account.data
    );

  const stakerBalances: Array<StakerBalance> = [];
  const stakerBalanceSize = 48;

  const fullBalanceListSlice = account.data.slice(8 + 40);
  for (let i = 0; i < metadata.length.toNumber(); i++) {
    const offset = i * stakerBalanceSize;
    const slice = fullBalanceListSlice.slice(
      offset,
      offset + stakerBalanceSize
    );
    const stakerBalance: StakerBalance = stakeForFeeProgram.coder.types.decode(
      "StakerBalance",
      Buffer.from(slice)
    );
    stakerBalances.push(stakerBalance);
  }

  return {
    metadata,
    stakers: stakerBalances,
  };
}

export function decodeTopStakerListState(
  stakeForFeeProgram: StakeForFeeProgram,
  feeVault: FeeVault,
  account: AccountInfo<Buffer>
): TopStakerListState {
  const topStakerMetadataState: TopListMetadata =
    stakeForFeeProgram.coder.accounts.decode("topListMetadata", account.data);

  const topStakerListSlice = account.data.slice(8 + 32);
  const stakerMetadataSize = 48;

  const topStakerList: TopStakerListState = {
    metadata: topStakerMetadataState,
    stakers: [],
  };

  for (let i = 0; i < feeVault.topStakerInfo.currentLength.toNumber(); i++) {
    const offset = i * stakerMetadataSize;
    const slice = topStakerListSlice.slice(offset, offset + stakerMetadataSize);

    const stakerMetadata = stakeForFeeProgram.coder.types.decode(
      "StakerMetadata",
      Buffer.from(slice)
    );

    topStakerList.stakers.push(stakerMetadata);
  }

  return topStakerList;
}
