import { BN } from "@coral-xyz/anchor";
import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  MintLayout,
  RawAccount,
  RawMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  AccountMeta,
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  DYNAMIC_AMM_PROGRAM_ID,
  DYNAMIC_VAULT_PROGRAM_ID,
  STAKE_FOR_FEE_PROGRAM_ID,
  U64_MAX,
} from "./constants";
import {
  decodeFullBalanceState,
  decodeTopStakerListState,
} from "./helpers/decoder";
import { getLockedEscrowPendingFee } from "./helpers/dynamic_amm";
import {
  deriveFeeVault,
  deriveFullBalanceList,
  deriveLockEscrowPda,
  deriveLpMint,
  deriveStakeEscrow,
  deriveTopStakerList,
} from "./helpers/pda";
import {
  createDynamicAmmProgram,
  createDynamicVaultProgram,
  createStakeFeeProgram,
  getOrCreateATAInstruction,
  getOrCreateStakeEscrowInstruction,
} from "./helpers/program";
import { getTopStakerListStateEntryStakeAmount } from "./helpers/staker_for_fee";
import {
  AccountStates,
  Clock,
  ClockLayout,
  DynamicAmmProgram,
  DynamicPool,
  DynamicVault,
  DynamicVaultProgram,
  FeeVault,
  FullBalanceListState,
  InitializeVaultParams,
  LockEscrow,
  StakeEscrow,
  StakeForFeeProgram,
  StakerMetadata,
  TopStakerListState,
} from "./types";
import { computeUnitIx } from "./helpers/tx";
import { COMPUTE_UNIT } from "./constants/compute";

type Opt = {
  stakeForFeeProgramId?: PublicKey;
  dynamicAmmProgramId?: PublicKey;
  dynamicVaultProgramId?: PublicKey;
};

export class StakeForFee {
  constructor(
    public connection: Connection,
    public stakeForFeeProgram: StakeForFeeProgram,
    public dynamicAmmProgram: DynamicAmmProgram,
    public dynamicVaultProgram: DynamicVaultProgram,
    public feeVaultKey: PublicKey,
    public escrowVaultKey: PublicKey,
    public accountStates: AccountStates
  ) {}

  static async create(
    connection: Connection,
    pool: PublicKey,
    opt?: Opt
  ): Promise<StakeForFee> {
    const stakeForFeeProgram = createStakeFeeProgram(
      connection,
      opt?.stakeForFeeProgramId ?? STAKE_FOR_FEE_PROGRAM_ID
    );

    const dynamicVaultProgram = createDynamicVaultProgram(
      connection,
      opt?.dynamicVaultProgramId ?? DYNAMIC_VAULT_PROGRAM_ID
    );

    const dynamicAmmProgram = createDynamicAmmProgram(
      connection,
      opt?.dynamicAmmProgramId ?? DYNAMIC_AMM_PROGRAM_ID
    );

    const feeVaultKey = deriveFeeVault(pool, stakeForFeeProgram.programId);
    const fullBalanceListKey = deriveFullBalanceList(
      feeVaultKey,
      stakeForFeeProgram.programId
    );
    const topStakerListKey = deriveTopStakerList(
      feeVaultKey,
      stakeForFeeProgram.programId
    );

    const accountStates = await this.fetchAccountStates(
      connection,
      feeVaultKey,
      topStakerListKey,
      fullBalanceListKey,
      pool,
      opt
    );

    const [lockEscrowPK] = deriveLockEscrowPda(
      pool,
      feeVaultKey,
      dynamicAmmProgram.programId
    );
    const escrowVaultKey = getAssociatedTokenAddressSync(
      accountStates.ammPool.lpMint,
      lockEscrowPK,
      true
    );

    return new StakeForFee(
      connection,
      stakeForFeeProgram,
      dynamicAmmProgram,
      dynamicVaultProgram,
      feeVaultKey,
      escrowVaultKey,
      accountStates
    );
  }

  /**
   * Fetches all account states required for a given stake-for-fee pool
   *
   * @param connection The connection to the Solana cluster
   * @param feeVaultKey The public key of the fee vault
   * @param topStakerListKey The public key of the top staker list
   * @param fullBalanceListKey The public key of the full balance list
   * @param pool The public key of the pool
   * @param opt An optional object containing the IDs of the programs that
   *            manage the pool. If not provided, the default program IDs
   *            will be used.
   * @returns An object containing all the required account states
   */
  static async fetchAccountStates(
    connection: Connection,
    feeVaultKey: PublicKey,
    topStakerListKey: PublicKey,
    fullBalanceListKey: PublicKey,
    pool: PublicKey,
    opt?: Opt
  ): Promise<AccountStates> {
    const stakeForFeeProgram = createStakeFeeProgram(
      connection,
      opt?.stakeForFeeProgramId ?? STAKE_FOR_FEE_PROGRAM_ID
    );

    const dynamicVaultProgram = createDynamicVaultProgram(
      connection,
      opt?.dynamicVaultProgramId ?? DYNAMIC_VAULT_PROGRAM_ID
    );

    const dynamicAmmProgram = createDynamicAmmProgram(
      connection,
      opt?.dynamicAmmProgramId ?? DYNAMIC_AMM_PROGRAM_ID
    );

    const [
      feeVaultAccount,
      fullBalanceListAccount,
      topStakerAccount,
      poolAccount,
      clockAccount,
    ] = await connection.getMultipleAccountsInfo([
      feeVaultKey,
      fullBalanceListKey,
      topStakerListKey,
      pool,
      SYSVAR_CLOCK_PUBKEY,
    ]);

    const feeVaultState: FeeVault = stakeForFeeProgram.coder.accounts.decode(
      "feeVault",
      feeVaultAccount.data
    );

    const fullBalanceListState: FullBalanceListState = decodeFullBalanceState(
      stakeForFeeProgram,
      fullBalanceListAccount
    );

    const topStakerListState: TopStakerListState = decodeTopStakerListState(
      stakeForFeeProgram,
      feeVaultState,
      topStakerAccount
    );

    const poolState: DynamicPool = dynamicAmmProgram.coder.accounts.decode(
      "pool",
      poolAccount.data
    );

    const clockState: Clock = ClockLayout.decode(clockAccount.data);

    const [
      aVaultAccount,
      bVaultAccount,
      lockEscrowAccount,
      aVaultLpAccount,
      bVaultLpAccount,
      tokenAMintAccount,
      tokenBMintAccount,
      poolLpMintAccount,
    ] = await connection.getMultipleAccountsInfo([
      poolState.aVault,
      poolState.bVault,
      feeVaultState.lockEscrow,
      poolState.aVaultLp,
      poolState.bVaultLp,
      poolState.tokenAMint,
      poolState.tokenBMint,
      poolState.lpMint,
    ]);

    const aVaultState: DynamicVault = dynamicVaultProgram.coder.accounts.decode(
      "vault",
      aVaultAccount.data
    );

    const bVaultState: DynamicVault = dynamicVaultProgram.coder.accounts.decode(
      "vault",
      bVaultAccount.data
    );

    const lockEscrowState: LockEscrow = dynamicAmmProgram.coder.accounts.decode(
      "lockEscrow",
      lockEscrowAccount.data
    );

    const aVaultLpState: RawAccount = AccountLayout.decode(
      new Uint8Array(aVaultLpAccount.data)
    );

    const bVaultLpState: RawAccount = AccountLayout.decode(
      new Uint8Array(bVaultLpAccount.data)
    );

    const tokenAMintState: RawMint = MintLayout.decode(
      new Uint8Array(tokenAMintAccount.data)
    );

    const tokenBMintState: RawMint = MintLayout.decode(
      new Uint8Array(tokenBMintAccount.data)
    );

    const poolLpMintState: RawMint = MintLayout.decode(
      new Uint8Array(poolLpMintAccount.data)
    );

    const stakeMintState = feeVaultState.stakeMint.equals(poolState.tokenAMint)
      ? tokenAMintState
      : tokenBMintState;

    const escrowVaultKey = getAssociatedTokenAddressSync(
      poolState.lpMint,
      feeVaultKey,
      true
    );

    const [aVaultLpMintAccount, bVaultLpMintAccount] =
      await connection.getMultipleAccountsInfo([
        aVaultState.lpMint,
        bVaultState.lpMint,
      ]);

    const aVaultLpMintState: RawMint = MintLayout.decode(
      new Uint8Array(aVaultLpMintAccount.data)
    );

    const bVaultLpMintState: RawMint = MintLayout.decode(
      new Uint8Array(bVaultLpMintAccount.data)
    );

    let accountStates: AccountStates = {
      feeVault: feeVaultState,
      fullBalanceListState,
      topStakerListState,
      ammPool: poolState,
      aVault: aVaultState,
      bVault: bVaultState,
      aVaultLp: aVaultLpState,
      bVaultLp: bVaultLpState,
      lockEscrow: lockEscrowState,
      tokenAMint: tokenAMintState,
      tokenBMint: tokenBMintState,
      stakeMint: stakeMintState,
      aVaultLpMint: aVaultLpMintState,
      bVaultLpMint: bVaultLpMintState,
      clock: clockState,
      poolLpMint: poolLpMintState,
    };

    return accountStates;
  }

  /**
   * Creates a fee vault for the given pool.
   *
   * @param connection Solana connection
   * @param pool The pool to create the fee vault for
   * @param stakeMint The mint of the stake token
   * @param lockEscrow The lock escrow account. The owner of the lock escrow must be the fee vault. Integrator must create lock escrow account before calling this instruction.
   * @param payer The payer of the transaction. Signer.
   * @param config The configuration account for the fee vault. Get from `getConfigs`
   * @param customStartClaimFeeTimestamp The custom start claim fee timestamp. If not passed, it will default to current timestamp. Else, lock escrow can only claim fee after this timestamp. Constraint: currentTimestamp <= `customStartClaimFeeTimestamp` <= currentTimestamp + configAccount.joinWindowDuration
   * @param opt Optional options
   *
   * @returns A transaction that can be signed and sent to the network
   */
  public static async createFeeVault(
    connection: Connection,
    pool: PublicKey,
    stakeMint: PublicKey,
    payer: PublicKey,
    param?: Exclude<InitializeVaultParams, "padding">,
    opt?: Opt
  ): Promise<Transaction> {
    const stakeForFeeProgram = createStakeFeeProgram(
      connection,
      opt?.stakeForFeeProgramId ?? STAKE_FOR_FEE_PROGRAM_ID
    );

    const ammProgram = createDynamicAmmProgram(
      connection,
      opt?.dynamicAmmProgramId ?? DYNAMIC_AMM_PROGRAM_ID
    );

    const poolState = await ammProgram.account.pool.fetch(pool);

    const quoteMint = poolState.tokenAMint.equals(stakeMint)
      ? poolState.tokenBMint
      : poolState.tokenAMint;

    const feeVaultKey = deriveFeeVault(pool, stakeForFeeProgram.programId);
    const stakeTokenVaultKey = getAssociatedTokenAddressSync(
      stakeMint,
      feeVaultKey,
      true
    );

    const quoteTokenVaultKey = getAssociatedTokenAddressSync(
      quoteMint,
      feeVaultKey,
      true
    );

    const topStakerListKey = deriveTopStakerList(
      feeVaultKey,
      stakeForFeeProgram.programId
    );
    const fullBalanceListKey = deriveFullBalanceList(
      feeVaultKey,
      stakeForFeeProgram.programId
    );

    const [lockEscrowPK] = deriveLockEscrowPda(
      pool,
      feeVaultKey,
      ammProgram.programId
    );
    const lockEscrowAccount = await connection.getAccountInfo(lockEscrowPK);
    const preInstructions: TransactionInstruction[] = [];
    if (lockEscrowAccount === null) {
      const createLockEscrowIx = await ammProgram.methods
        .createLockEscrow()
        .accounts({
          pool,
          lockEscrow: lockEscrowPK,
          owner: feeVaultKey,
          lpMint: poolState.lpMint,
          payer,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      preInstructions.push(createLockEscrowIx);
      const { ix: createEscrowAtaIx } = await getOrCreateATAInstruction(
        connection,
        poolState.lpMint,
        lockEscrowPK,
        payer
      );

      createEscrowAtaIx && preInstructions.push(createEscrowAtaIx);
    }

    const transaction = await stakeForFeeProgram.methods
      .initializeVault({
        ...param,
        padding: new Array(64).fill(0),
      })
      .accounts({
        vault: feeVaultKey,
        stakeMint,
        stakeTokenVault: stakeTokenVaultKey,
        quoteMint,
        quoteTokenVault: quoteTokenVaultKey,
        topStakerList: topStakerListKey,
        fullBalanceList: fullBalanceListKey,
        pool,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        lockEscrow: lockEscrowPK,
        payer,
        systemProgram: SystemProgram.programId,
      })
      .preInstructions(preInstructions)
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");

    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: payer,
    }).add(transaction);
  }

  /**
   * Creates a fee vault for the given pool.
   *
   * @param connection Solana connection
   * @param pool The pool to create the fee vault for
   * @param payer The payer of the transaction. Signer.
   * @param config The configuration account for the fee vault. Get from `getConfigs`
   * @param stakeMint The mint of the stake token. Must be token A/B of the pool.
   * @param quoteMint The mint of the quote token. Must be token A/B of the pool.
   * @param customStartClaimFeeTimestamp The custom start claim fee timestamp. If not passed, it will default to current timestamp. Else, lock escrow can only claim fee after this timestamp. Constraint: currentTimestamp <= `customStartClaimFeeTimestamp` <= currentTimestamp + configAccount.joinWindowDuration
   * @param opt Optional options
   *
   * @returns A transaction that can be signed and sent to the network
   */
  public static async createFeeVaultWithParams(
    connection: Connection,
    pool: PublicKey,
    payer: PublicKey,
    stakeMint: PublicKey,
    quoteMint: PublicKey,
    param?: Exclude<InitializeVaultParams, "padding">,
    opt?: Opt
  ): Promise<Transaction> {
    const stakeForFeeProgram = createStakeFeeProgram(
      connection,
      opt?.stakeForFeeProgramId ?? STAKE_FOR_FEE_PROGRAM_ID
    );

    const ammProgram = createDynamicAmmProgram(
      connection,
      opt?.dynamicAmmProgramId ?? DYNAMIC_AMM_PROGRAM_ID
    );
    const feeVaultKey = deriveFeeVault(pool, stakeForFeeProgram.programId);
    const lpMint = deriveLpMint(pool, ammProgram.programId);

    const topStakerListKey = deriveTopStakerList(
      feeVaultKey,
      stakeForFeeProgram.programId
    );
    const fullBalanceListKey = deriveFullBalanceList(
      feeVaultKey,
      stakeForFeeProgram.programId
    );
    const stakeTokenVaultKey = getAssociatedTokenAddressSync(
      stakeMint,
      feeVaultKey,
      true
    );
    const quoteTokenVaultKey = getAssociatedTokenAddressSync(
      quoteMint,
      feeVaultKey,
      true
    );

    const [lockEscrowPK] = deriveLockEscrowPda(
      pool,
      feeVaultKey,
      ammProgram.programId
    );

    const lockEscrowAccount = await connection.getAccountInfo(lockEscrowPK);
    const preInstructions: TransactionInstruction[] = [];

    if (lockEscrowAccount === null) {
      const createLockEscrowIx = await ammProgram.methods
        .createLockEscrow()
        .accounts({
          pool,
          lockEscrow: lockEscrowPK,
          owner: feeVaultKey,
          lpMint,
          payer,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      preInstructions.push(createLockEscrowIx);
    }

    const transaction = await stakeForFeeProgram.methods
      .initializeVault({
        ...param,
        padding: new Array(64).fill(0),
      })
      .accounts({
        vault: feeVaultKey,
        stakeTokenVault: stakeTokenVaultKey,
        quoteTokenVault: quoteTokenVaultKey,
        stakeMint,
        quoteMint,
        topStakerList: topStakerListKey,
        fullBalanceList: fullBalanceListKey,
        pool,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        lockEscrow: lockEscrowPK,
        payer,
        systemProgram: SystemProgram.programId,
      })
      .preInstructions(preInstructions)
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");

    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: payer,
    }).add(transaction);
  }
  /**
   * Creates a fee vault for the given pool.
   *
   * @param connection Solana connection
   * @param pool The pool to create the fee vault for
   * @param payer The payer of the transaction. Signer.
   * @param config The configuration account for the fee vault. Get from `getConfigs`
   * @param stakeMint The mint of the stake token. Must be token A/B of the pool.
   * @param quoteMint The mint of the quote token. Must be token A/B of the pool.
   * @param customStartClaimFeeTimestamp The custom start claim fee timestamp. If not passed, it will default to current timestamp. Else, lock escrow can only claim fee after this timestamp. Constraint: currentTimestamp <= `customStartClaimFeeTimestamp` <= currentTimestamp + configAccount.joinWindowDuration
   * @param opt Optional options
   *
   * @returns An instruction
   */
  public static async createFeeVaultInstructions(
    connection: Connection,
    pool: PublicKey,
    payer: PublicKey,
    stakeMint: PublicKey,
    quoteMint: PublicKey,
    param?: Exclude<InitializeVaultParams, "padding">,
    opt?: Opt
  ): Promise<TransactionInstruction[]> {
    const stakeForFeeProgram = createStakeFeeProgram(
      connection,
      opt?.stakeForFeeProgramId ?? STAKE_FOR_FEE_PROGRAM_ID
    );

    const ammProgram = createDynamicAmmProgram(
      connection,
      opt?.dynamicAmmProgramId ?? DYNAMIC_AMM_PROGRAM_ID
    );
    const feeVaultKey = deriveFeeVault(pool, stakeForFeeProgram.programId);
    const lpMint = deriveLpMint(pool, ammProgram.programId);

    const topStakerListKey = deriveTopStakerList(
      feeVaultKey,
      stakeForFeeProgram.programId
    );
    const fullBalanceListKey = deriveFullBalanceList(
      feeVaultKey,
      stakeForFeeProgram.programId
    );
    const stakeTokenVaultKey = getAssociatedTokenAddressSync(
      stakeMint,
      feeVaultKey,
      true
    );
    const quoteTokenVaultKey = getAssociatedTokenAddressSync(
      quoteMint,
      feeVaultKey,
      true
    );

    const [lockEscrowPK] = deriveLockEscrowPda(
      pool,
      feeVaultKey,
      ammProgram.programId
    );

    const lockEscrowAccount = await connection.getAccountInfo(lockEscrowPK);
    const instructions: TransactionInstruction[] = [];

    if (lockEscrowAccount === null) {
      const createLockEscrowIx = await ammProgram.methods
        .createLockEscrow()
        .accounts({
          pool,
          lockEscrow: lockEscrowPK,
          owner: feeVaultKey,
          lpMint,
          payer,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      instructions.push(createLockEscrowIx);
    }

    const createFeeVaultIx = await stakeForFeeProgram.methods
      .initializeVault({
        ...param,
        padding: new Array(64).fill(0),
      })
      .accounts({
        vault: feeVaultKey,
        stakeTokenVault: stakeTokenVaultKey,
        quoteTokenVault: quoteTokenVaultKey,
        stakeMint,
        quoteMint,
        topStakerList: topStakerListKey,
        fullBalanceList: fullBalanceListKey,
        pool,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        lockEscrow: lockEscrowPK,
        payer,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    instructions.push(createFeeVaultIx);

    return instructions;
  }

  /**
   * Initializes a stake escrow for the given owner.
   *
   * @param connection Solana connection
   * @param owner The owner of the stake escrow. Signer.
   *
   * @returns A transaction that can be signed and sent to the network
   */
  public async initializeStakeEscrow(owner: PublicKey): Promise<Transaction> {
    const stakeEscrowKey = deriveStakeEscrow(
      this.feeVaultKey,
      owner,
      this.stakeForFeeProgram.programId
    );

    const transaction = await this.stakeForFeeProgram.methods
      .initializeStakeEscrow()
      .accounts({
        vault: this.feeVaultKey,
        fullBalanceList: this.accountStates.feeVault.fullBalanceList,
        topStakerList: this.accountStates.feeVault.topStakerList,
        escrow: stakeEscrowKey,
        owner,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash("confirmed");

    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: owner,
    }).add(transaction);
  }

  findSmallestStakeEscrowInFullBalanceList(
    skipOwner: PublicKey
  ): PublicKey | null {
    if (this.accountStates.fullBalanceListState.stakers.length == 0) {
      return null;
    }

    const endIdx = this.accountStates.fullBalanceListState.stakers.length - 1;
    let smallestBalance = U64_MAX;
    let smallestOwner: PublicKey = null;

    for (let i = endIdx; i >= 0; i--) {
      const staker = this.accountStates.fullBalanceListState.stakers[i];
      if (staker.owner.equals(skipOwner)) {
        continue;
      }

      if (staker.balance.isZero()) {
        smallestOwner = staker.owner;
        break;
      }

      if (staker.balance.lt(smallestBalance)) {
        smallestOwner = staker.owner;
        smallestBalance = staker.balance;
      }
    }

    return smallestOwner
      ? deriveStakeEscrow(
          this.feeVaultKey,
          smallestOwner,
          this.stakeForFeeProgram.programId
        )
      : null;
  }

  findLargestStakerNotInTopListFromFullBalanceList(lookupNumber: number) {
    interface StakerBalance {
      idx: BN;
      balance: BN;
      owner: PublicKey;
    }
    const largestStakers: Array<StakerBalance> = [];

    const fullBalanceListLength =
      this.accountStates.fullBalanceListState.metadata.length.toNumber();

    const stakeBalanceSorter = (a: StakerBalance, b: StakerBalance) => {
      if (a.balance.eq(b.balance)) {
        return a.idx.cmp(b.idx);
      } else {
        return b.balance.cmp(a.balance);
      }
    };

    for (let i = 0; i < fullBalanceListLength; i++) {
      const staker = this.accountStates.fullBalanceListState.stakers[i];

      if (Boolean(staker.isInTopList)) {
        continue;
      }

      if (largestStakers.length < lookupNumber) {
        largestStakers.push({
          idx: new BN(i),
          balance: staker.balance,
          owner: staker.owner,
        });

        largestStakers.sort(stakeBalanceSorter);
        continue;
      }

      const largestStakerWithLowestPriority =
        largestStakers[largestStakers.length - 1];

      if (staker.balance.gt(largestStakerWithLowestPriority.balance)) {
        largestStakers.pop();

        largestStakers.push({
          idx: new BN(i),
          balance: staker.balance,
          owner: staker.owner,
        });

        largestStakers.sort(stakeBalanceSorter);
      }
    }

    return largestStakers.map((s) =>
      deriveStakeEscrow(
        this.feeVaultKey,
        s.owner,
        this.stakeForFeeProgram.programId
      )
    );
  }

  findReplaceableTopStaker(lookupNumber: number) {
    const smallestStakers: Array<StakerMetadata> = [];

    for (const staker of this.accountStates.topStakerListState.stakers) {
      if (staker.fullBalanceIndex.isNeg()) {
        continue;
      }

      const stakeBalanceAscSorted = (a: StakerMetadata, b: StakerMetadata) => {
        if (a.stakeAmount.eq(b.stakeAmount)) {
          return a.fullBalanceIndex.cmp(b.fullBalanceIndex);
        } else {
          return a.stakeAmount.cmp(b.stakeAmount);
        }
      };

      if (smallestStakers.length < lookupNumber) {
        smallestStakers.push(staker);
        smallestStakers.sort(stakeBalanceAscSorted);
      } else {
        const biggestStakers = smallestStakers[lookupNumber - 1];
        if (staker.stakeAmount.lt(biggestStakers.stakeAmount)) {
          smallestStakers.pop();
          smallestStakers.push(staker);
          smallestStakers.sort(stakeBalanceAscSorted);
        }
      }
    }

    return smallestStakers.map((s) =>
      deriveStakeEscrow(
        this.feeVaultKey,
        s.owner,
        this.stakeForFeeProgram.programId
      )
    );
  }

  /**
   * Withdraws the tokens from the given unstake key and sends them to the given owner.
   * @param unstakeKey The public key of the unstake account to withdraw from.
   * @param owner The public key of the account to send the withdrawn tokens to.
   * @returns A transaction that can be signed and sent to the network.
   */
  public async withdraw(
    unstakeKey: PublicKey,
    owner: PublicKey
  ): Promise<Transaction> {
    const stakeEscrowKey = deriveStakeEscrow(
      this.feeVaultKey,
      owner,
      this.stakeForFeeProgram.programId
    );

    const preInstructions = [];

    const { ataPubKey: userStakeToken, ix: initializeUserStakeTokenIx } =
      await getOrCreateATAInstruction(
        this.connection,
        this.accountStates.feeVault.stakeMint,
        owner
      );

    initializeUserStakeTokenIx &&
      preInstructions.push(initializeUserStakeTokenIx);

    const transaction = await this.stakeForFeeProgram.methods
      .withdraw()
      .accounts({
        unstake: unstakeKey,
        stakeEscrow: stakeEscrowKey,
        stakeTokenVault: this.accountStates.feeVault.stakeTokenVault,
        vault: this.feeVaultKey,
        userStakeToken,
        tokenProgram: TOKEN_PROGRAM_ID,
        owner,
      })
      .preInstructions(preInstructions)
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash("confirmed");

    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: owner,
    }).add(transaction);
  }

  /**
   * Requests to unstake a given amount of tokens from the vault.
   * Creates a new `Unstake` account and initializes it to the given owner.
   *
   * @param amount The amount of tokens to unstake
   * @param unstakeKeypair The new unstake account. Arbitrarily generated. Signer.
   * @param owner The owner of the stake. Signer.
   * @returns The transaction to execute the unstake instruction
   */
  public async unstake(
    amount: BN,
    unstakeKeypair: PublicKey,
    owner: PublicKey
  ): Promise<Transaction> {
    const stakeEscrowKey = deriveStakeEscrow(
      this.feeVaultKey,
      owner,
      this.stakeForFeeProgram.programId
    );

    const stakeEscrowState =
      await this.stakeForFeeProgram.account.stakeEscrow.fetch(stakeEscrowKey);

    const remainingAccounts: Array<AccountMeta> = [];

    if (Boolean(stakeEscrowState.inTopList)) {
      const candidateToEnterTopList: Array<AccountMeta> =
        this.findLargestStakerNotInTopListFromFullBalanceList(3).map((key) => {
          return {
            pubkey: key,
            isSigner: false,
            isWritable: true,
          };
        });

      remainingAccounts.push(...candidateToEnterTopList);
    }

    const preInstructions: Array<TransactionInstruction> = [
      computeUnitIx(COMPUTE_UNIT.UNSTAKE),
    ];
    const transaction = await this.stakeForFeeProgram.methods
      .requestUnstake(amount)
      .accounts({
        unstake: unstakeKeypair,
        vault: this.feeVaultKey,
        topStakerList: this.accountStates.feeVault.topStakerList,
        fullBalanceList: this.accountStates.feeVault.fullBalanceList,
        stakeEscrow: stakeEscrowKey,
        stakeTokenVault: this.accountStates.feeVault.stakeTokenVault,
        quoteTokenVault: this.accountStates.feeVault.quoteTokenVault,
        owner,
        pool: this.accountStates.feeVault.pool,
        lpMint: this.accountStates.ammPool.lpMint,
        lockEscrow: this.accountStates.feeVault.lockEscrow,
        escrowVault: this.escrowVaultKey,
        aTokenVault: this.accountStates.aVault.tokenVault,
        bTokenVault: this.accountStates.bVault.tokenVault,
        aVault: this.accountStates.ammPool.aVault,
        bVault: this.accountStates.ammPool.bVault,
        aVaultLp: this.accountStates.ammPool.aVaultLp,
        bVaultLp: this.accountStates.ammPool.bVaultLp,
        aVaultLpMint: this.accountStates.aVault.lpMint,
        bVaultLpMint: this.accountStates.bVault.lpMint,
        ammProgram: this.dynamicAmmProgram.programId,
        vaultProgram: this.dynamicVaultProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .remainingAccounts(remainingAccounts)
      .preInstructions(preInstructions)
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash("confirmed");

    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: owner,
    }).add(transaction);
  }

  /**
   * @description
   * Claim fee from stake escrow.
   *
   * @param owner Owner of stake escrow.
   * @param maxFee Max fee
   * @returns Transaction
   */
  public async claimFee(owner: PublicKey, maxFee: BN): Promise<Transaction[]> {
    const stakeEscrowKey = deriveStakeEscrow(
      this.feeVaultKey,
      owner,
      this.stakeForFeeProgram.programId
    );

    const quoteTokenMint = this.accountStates.ammPool.tokenAMint.equals(
      this.accountStates.feeVault.stakeMint
    )
      ? this.accountStates.ammPool.tokenBMint
      : this.accountStates.ammPool.tokenAMint;

    const transactionArray: Transaction[] = [];
    const preInstructions = [computeUnitIx(COMPUTE_UNIT.CLAIM)];

    const { ataPubKey: userQuoteToken, ix: initializeUserQuoteTokenIx } =
      await getOrCreateATAInstruction(this.connection, quoteTokenMint, owner);

    initializeUserQuoteTokenIx &&
      preInstructions.push(initializeUserQuoteTokenIx);

    const remainingAccounts: Array<AccountMeta> = [];

    const smallestStakeEscrows: Array<AccountMeta> =
      this.findReplaceableTopStaker(2).map((key) => {
        return {
          pubkey: key,
          isWritable: true,
          isSigner: false,
        };
      });

    remainingAccounts.push(...smallestStakeEscrows);

    const smallestStakeEscrow =
      this.findSmallestStakeEscrowInFullBalanceList(owner);

    const claimTx = await this.stakeForFeeProgram.methods
      .claimFee(maxFee)
      .accounts({
        userQuoteToken,
        vault: this.feeVaultKey,
        fullBalanceList: this.accountStates.feeVault.fullBalanceList,
        topStakerList: this.accountStates.feeVault.topStakerList,
        stakeEscrow: stakeEscrowKey,
        stakeTokenVault: this.accountStates.feeVault.stakeTokenVault,
        quoteTokenVault: this.accountStates.feeVault.quoteTokenVault,
        owner,
        pool: this.accountStates.feeVault.pool,
        lpMint: this.accountStates.ammPool.lpMint,
        lockEscrow: this.accountStates.feeVault.lockEscrow,
        escrowVault: this.escrowVaultKey,
        aTokenVault: this.accountStates.aVault.tokenVault,
        bTokenVault: this.accountStates.bVault.tokenVault,
        aVault: this.accountStates.ammPool.aVault,
        bVault: this.accountStates.ammPool.bVault,
        aVaultLp: this.accountStates.ammPool.aVaultLp,
        bVaultLp: this.accountStates.ammPool.bVaultLp,
        aVaultLpMint: this.accountStates.aVault.lpMint,
        bVaultLpMint: this.accountStates.bVault.lpMint,
        ammProgram: this.dynamicAmmProgram.programId,
        vaultProgram: this.dynamicVaultProgram.programId,
        smallestStakeEscrow,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(preInstructions)
      .remainingAccounts(remainingAccounts)
      .transaction();

    transactionArray.push(claimTx);

    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash("confirmed");
    return transactionArray.map((tx) =>
      new Transaction({
        blockhash,
        lastValidBlockHeight,
        feePayer: owner,
      }).add(tx)
    );
  }

  /**
   * Stake tokens in the vault for the given owner.
   *
   * Creates a new stake escrow if one doesn't exist.
   *
   * @param maxAmount The max amount of tokens to stake
   * @param owner The owner of the stake. Signer.
   * @param owner The payer for fee and account rental. Signer.
   * @param replaceableTopStakerCount The number of top stakers that can be replaced. Default is 2 (Max = 2).
   * @returns The transaction to execute the stake instruction
   */
  public async stake(
    maxAmount: BN,
    owner: PublicKey,
    replaceableTopStakerCount = 2
  ): Promise<Transaction> {
    if (replaceableTopStakerCount > 2) {
      throw new Error(
        "replaceableTopStakerCount must be less than or equal to 2"
      );
    }
    const preInstructions: Array<TransactionInstruction> = [
      computeUnitIx(COMPUTE_UNIT.STAKE),
    ];
    const { stakeEscrowKey, ix: initializeStakeEscrowIx } =
      await getOrCreateStakeEscrowInstruction(
        this.connection,
        this.feeVaultKey,
        owner,
        this.stakeForFeeProgram.programId
      );

    initializeStakeEscrowIx && preInstructions.push(initializeStakeEscrowIx);

    const userStakeTokenKey = getAssociatedTokenAddressSync(
      this.accountStates.feeVault.stakeMint,
      owner
    );

    const remainingAccounts: Array<AccountMeta> = [];

    const smallestStakeEscrows: Array<AccountMeta> =
      this.findReplaceableTopStaker(replaceableTopStakerCount).map((key) => {
        return {
          pubkey: key,
          isWritable: true,
          isSigner: false,
        };
      });

    remainingAccounts.push(...smallestStakeEscrows);

    const smallestStakeEscrow =
      this.findSmallestStakeEscrowInFullBalanceList(owner);

    const transaction = await this.stakeForFeeProgram.methods
      .stake(maxAmount)
      .accounts({
        vault: this.feeVaultKey,
        stakeTokenVault: this.accountStates.feeVault.stakeTokenVault,
        quoteTokenVault: this.accountStates.feeVault.quoteTokenVault,
        topStakerList: this.accountStates.feeVault.topStakerList,
        fullBalanceList: this.accountStates.feeVault.fullBalanceList,
        stakeEscrow: stakeEscrowKey,
        smallestStakeEscrow,
        userStakeToken: userStakeTokenKey,
        owner,
        pool: this.accountStates.feeVault.pool,
        lpMint: this.accountStates.ammPool.lpMint,
        lockEscrow: this.accountStates.feeVault.lockEscrow,
        escrowVault: this.escrowVaultKey,
        aTokenVault: this.accountStates.aVault.tokenVault,
        bTokenVault: this.accountStates.bVault.tokenVault,
        aVault: this.accountStates.ammPool.aVault,
        bVault: this.accountStates.ammPool.bVault,
        aVaultLp: this.accountStates.ammPool.aVaultLp,
        bVaultLp: this.accountStates.ammPool.bVaultLp,
        aVaultLpMint: this.accountStates.aVault.lpMint,
        bVaultLpMint: this.accountStates.bVault.lpMint,
        ammProgram: this.dynamicAmmProgram.programId,
        vaultProgram: this.dynamicVaultProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(preInstructions)
      .remainingAccounts(remainingAccounts)
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash("confirmed");

    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: owner,
    }).add(transaction);
  }

  /**
   * Cancels an unstake request, given the public key of the unstake account.
   * @param unstakeKey The public key of the unstake account to cancel.
   * @param owner The public key of the owner of the stake.
   * @returns A transaction to execute the cancel unstake instruction.
   */
  public async cancelUnstake(
    unstakeKey: PublicKey,
    owner: PublicKey
  ): Promise<Transaction> {
    const stakeEscrowKey = deriveStakeEscrow(
      this.feeVaultKey,
      owner,
      this.stakeForFeeProgram.programId
    );

    const remainingAccounts: Array<AccountMeta> = [];
    const stakeEscrowState =
      await this.stakeForFeeProgram.account.stakeEscrow.fetch(stakeEscrowKey);

    if (!Boolean(stakeEscrowState.inTopList)) {
      const smallestStakeEscrows: Array<AccountMeta> =
        this.findReplaceableTopStaker(3).map((key) => {
          return {
            pubkey: key,
            isWritable: true,
            isSigner: false,
          };
        });

      remainingAccounts.push(...smallestStakeEscrows);
    }

    const smallestStakeEscrow =
      this.findSmallestStakeEscrowInFullBalanceList(owner);

    const preInstructions: Array<TransactionInstruction> = [
      computeUnitIx(COMPUTE_UNIT.CANCEL_UNSTAKE),
    ];
    const transaction = await this.stakeForFeeProgram.methods
      .cancelUnstake()
      .accounts({
        unstake: unstakeKey,
        vault: this.feeVaultKey,
        topStakerList: this.accountStates.feeVault.topStakerList,
        fullBalanceList: this.accountStates.feeVault.fullBalanceList,
        stakeEscrow: stakeEscrowKey,
        smallestStakeEscrow,
        stakeTokenVault: this.accountStates.feeVault.stakeTokenVault,
        quoteTokenVault: this.accountStates.feeVault.quoteTokenVault,
        owner,
        pool: this.accountStates.feeVault.pool,
        lpMint: this.accountStates.ammPool.lpMint,
        lockEscrow: this.accountStates.feeVault.lockEscrow,
        escrowVault: this.escrowVaultKey,
        aTokenVault: this.accountStates.aVault.tokenVault,
        bTokenVault: this.accountStates.bVault.tokenVault,
        aVault: this.accountStates.ammPool.aVault,
        bVault: this.accountStates.ammPool.bVault,
        aVaultLp: this.accountStates.ammPool.aVaultLp,
        bVaultLp: this.accountStates.ammPool.bVaultLp,
        aVaultLpMint: this.accountStates.aVault.lpMint,
        bVaultLpMint: this.accountStates.bVault.lpMint,
        ammProgram: this.dynamicAmmProgram.programId,
        vaultProgram: this.dynamicVaultProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .remainingAccounts(remainingAccounts)
      .preInstructions(preInstructions)
      .transaction();

    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash("confirmed");

    return new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: owner,
    }).add(transaction);
  }

  /**
   * Refreshes the account states and returns the old states.
   *
   * @returns Old AccountStates object
   */
  public async refreshStates(): Promise<AccountStates> {
    const oldAccountStates = this.accountStates;
    this.accountStates = await StakeForFee.fetchAccountStates(
      this.connection,
      this.feeVaultKey,
      this.accountStates.feeVault.topStakerList,
      this.accountStates.feeVault.fullBalanceList,
      this.accountStates.feeVault.pool,
      {
        stakeForFeeProgramId: this.stakeForFeeProgram.programId,
        dynamicAmmProgramId: this.dynamicAmmProgram.programId,
        dynamicVaultProgramId: this.dynamicVaultProgram.programId,
      }
    );
    return oldAccountStates;
  }

  /** Start of helper functions */

  /**
   * Gets all staked info for the given owner.
   *
   * @param connection The connection to use.
   * @param owner The owner's pubkey.
   * @returns A promise that resolves with an array of stake escrows that match the given owner.
   */
  static async getAllStakedVaultByUser(
    connection: Connection,
    owner: PublicKey
  ) {
    const stakeForFeeProgram = createStakeFeeProgram(
      connection,
      STAKE_FOR_FEE_PROGRAM_ID
    );

    const stakeEscrow = await stakeForFeeProgram.account.stakeEscrow.all([
      { memcmp: { offset: 8, bytes: owner.toBase58() } },
    ]);
    const vaultsKey = stakeEscrow.map((stake) => stake.account.vault);
    const vaults = await stakeForFeeProgram.account.feeVault.fetchMultiple(
      vaultsKey
    );
    return stakeEscrow.map((stake, index) => {
      const vault = vaults[index];
      return { stake: stake.account, vault };
    });
  }

  /**
   * Gets all unstake records for the given stake escrow.
   *
   * @param connection The connection to use.
   * @param owner The owner's pubkey.
   * @returns A promise that resolves with an array of unstake records that match the given stake escrow.
   */
  static async getUnstakeByUser(
    connection: Connection,
    owner: PublicKey,
    feeVault: PublicKey
  ) {
    const stakeForFeeProgram = createStakeFeeProgram(
      connection,
      STAKE_FOR_FEE_PROGRAM_ID
    );

    const [{ publicKey: stakeEscrow }] =
      await stakeForFeeProgram.account.stakeEscrow.all([
        { memcmp: { offset: 8, bytes: owner.toBase58() } },
        { memcmp: { offset: 8 + 32, bytes: feeVault.toBase58() } },
      ]);

    return await stakeForFeeProgram.account.unstake.all([
      {
        memcmp: {
          offset: 8,
          bytes: stakeEscrow.toBase58(),
        },
      },
    ]);
  }

  /**
   * Gets all fee vault accounts for the given stake-for-fee program.
   * @param connection The connection to use.
   * @param programId The program id of the stake-for-fee program. Defaults to the idl program id.
   * @returns A promise that resolves with an array of fee vault accounts.
   */
  static async getAllFeeVault(connection: Connection, programId?: PublicKey) {
    const stakeForFeeProgram = createStakeFeeProgram(
      connection,
      programId ?? STAKE_FOR_FEE_PROGRAM_ID
    );

    return stakeForFeeProgram.account.feeVault.all();
  }

  /**
   * Calculates the minimum stake amount required to enter the top staker list.
   * @returns The minimum stake amount required to enter the top staker list.
   */
  public getTopStakerListEntryStakeAmount() {
    return getTopStakerListStateEntryStakeAmount(
      this.accountStates.topStakerListState
    );
  }

  /**
   * Calculates the total amount of fees that are pending to be claimed from the locked escrow for the farm.
   * @returns The total amount of fees that are pending to be claimed from the locked escrow for the farm.
   */
  public getFarmPendingClaimFees() {
    return getLockedEscrowPendingFee(
      this.accountStates.clock.unixTimestamp,
      this.accountStates.feeVault,
      this.accountStates.lockEscrow,
      this.accountStates.aVault,
      this.accountStates.bVault,
      this.accountStates.aVaultLp,
      this.accountStates.bVaultLp,
      this.accountStates.aVaultLpMint,
      this.accountStates.bVaultLpMint,
      this.accountStates.poolLpMint
    );
  }

  /**
   * Calculates the total amount of fees that have been released from the locked escrow to the top staker list for the farm.
   * @returns An array of two BNs. The first element is the total amount of token A fees that have been released. The second element is the total amount of token B fees that have been released.
   */
  public getFarmReleasedFees() {
    const [newFeeA, newFeeB] = this.getFarmPendingClaimFees();

    const newLockedFeeA =
      this.accountStates.feeVault.topStakerInfo.lockedFeeA.add(newFeeA);
    const newLockedFeeB =
      this.accountStates.feeVault.topStakerInfo.lockedFeeB.add(newFeeB);

    const currentTime = this.accountStates.clock.unixTimestamp;
    const secondsElapsed = currentTime.sub(
      this.accountStates.feeVault.topStakerInfo.lastUpdatedAt
    );

    const secondsToFullUnlock =
      this.accountStates.feeVault.configuration.secondsToFullUnlock;

    if (secondsElapsed.gte(secondsToFullUnlock)) {
      return [newLockedFeeA, newLockedFeeB];
    }

    const releasedFeeA = newLockedFeeA
      .mul(secondsElapsed)
      .div(secondsToFullUnlock);

    const releasedFeeB = newLockedFeeB
      .mul(secondsElapsed)
      .div(secondsToFullUnlock);

    return [releasedFeeA, releasedFeeB];
  }

  /**
   * The function `getUserStakeAndClaimBalance` calculates the stake amount and unclaimed fees for a
   * user in a staking program.
   * @param {PublicKey} user - The `getUserStakeAndClaimBalance` function calculates the stake amount
   * and unclaimed fees for a specific user. Here's a breakdown of the parameters used in the function:
   * @returns The function `getUserStakeAndClaimBalance` returns an object with two properties:
   * 1. `stakedAmount`: The amount of stake in the stake escrow account for the specified user.
   * 2. `unclaimFe`: An object containing two properties:
   *    - `feeA`: The total amount of fee A that can be claimed by the user, which includes both the
   * new fee A calculated
   *    - `feeB`: The total amount of fee B that can be claimed by the user, which includes both the
   * new fee B calculated
   */
  public async getUserStakeAndClaimBalance(user: PublicKey) {
    const stakeEscrowKey = deriveStakeEscrow(
      this.feeVaultKey,
      user,
      this.stakeForFeeProgram.programId
    );

    const stakeEscrow =
      await this.stakeForFeeProgram.account.stakeEscrow.fetchNullable(
        stakeEscrowKey
      );

    if (!stakeEscrow) {
      return {
        stakeEscrow: null,
        unclaimFee: {
          feeA: null,
          feeB: null,
        },
      };
    }

    if (!Boolean(stakeEscrow.inTopList)) {
      return {
        stakeEscrow,
        unclaimFee: {
          feeA: stakeEscrow.feeAPending,
          feeB: stakeEscrow.feeBPending,
        },
      };
    }

    const [releasedFeeA, releasedFeeB] = this.getFarmReleasedFees();

    const effectiveStakeAmount =
      this.accountStates.feeVault.topStakerInfo.effectiveStakeAmount;

    const newFeeAPerLiquidity =
      releasedFeeA.isNeg() || effectiveStakeAmount.isZero()
        ? new BN(0)
        : releasedFeeA.shln(64).div(effectiveStakeAmount);
    const newFeeBPerLiquidity =
      releasedFeeB.isNeg() || effectiveStakeAmount.isZero()
        ? new BN(0)
        : releasedFeeB.shln(64).div(effectiveStakeAmount);

    const newCumulativeFeeAPerLiquidity =
      this.accountStates.feeVault.topStakerInfo.cumulativeFeeAPerLiquidity.add(
        newFeeAPerLiquidity
      );
    const newCumulativeFeeBPerLiquidity =
      this.accountStates.feeVault.topStakerInfo.cumulativeFeeBPerLiquidity.add(
        newFeeBPerLiquidity
      );

    const newFeeA = newCumulativeFeeAPerLiquidity
      .sub(stakeEscrow.feeAPerLiquidityCheckpoint)
      .mul(stakeEscrow.stakeAmount)
      .shrn(64);

    const newFeeB = newCumulativeFeeBPerLiquidity
      .sub(stakeEscrow.feeBPerLiquidityCheckpoint)
      .mul(stakeEscrow.stakeAmount)
      .shrn(64);

    return {
      stakeEscrow,
      unclaimFee: {
        feeA: newFeeA.add(stakeEscrow.feeAPending),
        feeB: newFeeB.add(stakeEscrow.feeBPending),
      },
    };
  }

  /**
   * Calculates the total amount of fees that are pending to be claimed for the given stake escrow.
   * @param stakeEscrow The stake escrow to calculate the pending fees for.
   * @returns An array of two BNs. The first element is the total amount of token A fees that are pending to be claimed. The second element is the total amount of token B fees that are pending to be claimed.
   */
  public getStakeEscrowPendingFees(stakeEscrow: StakeEscrow) {
    const [releasedFeeA, releasedFeeB] = this.getFarmReleasedFees();

    const effectiveStakeAmount =
      this.accountStates.feeVault.topStakerInfo.effectiveStakeAmount;

    const newFeeAPerLiquidity = releasedFeeA.shln(64).div(effectiveStakeAmount);
    const newFeeBPerLiquidity = releasedFeeB.shln(64).div(effectiveStakeAmount);

    const newCumulativeFeeAPerLiquidity =
      this.accountStates.feeVault.topStakerInfo.cumulativeFeeAPerLiquidity.add(
        newFeeAPerLiquidity
      );
    const newCumulativeFeeBPerLiquidity =
      this.accountStates.feeVault.topStakerInfo.cumulativeFeeBPerLiquidity.add(
        newFeeBPerLiquidity
      );

    const newFeeA = newCumulativeFeeAPerLiquidity
      .sub(stakeEscrow.feeAPerLiquidityCheckpoint)
      .mul(stakeEscrow.stakeAmount)
      .shrn(64);

    const newFeeB = newCumulativeFeeBPerLiquidity
      .sub(stakeEscrow.feeBPerLiquidityCheckpoint)
      .mul(stakeEscrow.stakeAmount)
      .shrn(64);

    return [
      newFeeA.add(stakeEscrow.feeAPending),
      newFeeB.add(stakeEscrow.feeBPending),
    ];
  }
}
