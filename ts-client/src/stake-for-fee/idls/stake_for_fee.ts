export type StakeForFee = {
  "version": "0.1.2",
  "name": "stake_for_fee",
  "instructions": [
    {
      "name": "initializeVault",
      "docs": [
        "Deprecated"
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Vault account"
          ]
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token a vault"
          ]
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token b vault"
          ]
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Top staker list account"
          ]
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Full balance list account"
          ]
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Pool account"
          ]
        },
        {
          "name": "stakeMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Stake mint"
          ]
        },
        {
          "name": "quoteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Quote mint"
          ]
        },
        {
          "name": "lockEscrow",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Escrow account"
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitializeVaultParams"
          }
        }
      ]
    },
    {
      "name": "initializeStakeEscrow",
      "docs": [
        "Deprecated"
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stake",
      "docs": [
        "Deprecated"
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "smallestStakeEscrow",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "userStakeToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimFee",
      "docs": [
        "Deprecated. Use `claim_fee_and_withdraw_full` instead."
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "smallestStakeEscrow",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "userQuoteToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maxFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "requestUnstake",
      "docs": [
        "Deprecated. Use `claim_fee_and_withdraw_full` instead."
      ],
      "accounts": [
        {
          "name": "unstake",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unstakeAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelUnstake",
      "docs": [
        "Deprecated"
      ],
      "accounts": [
        {
          "name": "unstake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "smallestStakeEscrow",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdraw",
      "docs": [
        "Withdraw an existing unstake request. The program is deprecated, so the unstake lock duration is not enforced."
      ],
      "accounts": [
        {
          "name": "unstake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userStakeToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimFeeAndWithdrawFull",
      "docs": [
        "Claim all pending stake and quote token fees to the user, then withdraw the whole stake amount",
        "directly from the stake escrow, without an unstake request and lock duration.",
        "An existing unstake request is not affected; use `withdraw` to complete it."
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userStakeToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userQuoteToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimFeeCrank",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateUnstakeLockDuration",
      "docs": [
        "Deprecated. `withdraw` no longer waits for the unstake lock duration, so it is no longer used."
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unstakeLockDuration",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateSecondsToFullUnlock",
      "docs": [
        "Deprecated. Locked fees are released at once, so `seconds_to_full_unlock` is no longer used."
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructionsSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "secondsToFullUnlock",
          "type": "u64"
        }
      ]
    },
    {
      "name": "dummy",
      "docs": [
        "To force IDL generation for some struct for easier TS decoding later"
      ],
      "accounts": [
        {
          "name": "stakerMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakerBalance",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stakerMetadataDummyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakerMetadata",
            "type": {
              "defined": "StakerMetadata"
            }
          }
        ]
      }
    },
    {
      "name": "stakerBalanceDummyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakerBalance",
            "type": {
              "defined": "StakerBalance"
            }
          }
        ]
      }
    },
    {
      "name": "fullBalanceListMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "length",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "stakeEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "fullBalanceIndex",
            "type": "u64"
          },
          {
            "name": "stakeAmount",
            "type": "u64"
          },
          {
            "name": "inTopList",
            "type": "u8"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u8",
                15
              ]
            }
          },
          {
            "name": "ongoingTotalPartialUnstakeAmount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "feeAClaimedAmount",
            "type": "u128"
          },
          {
            "name": "feeBClaimedAmount",
            "type": "u128"
          },
          {
            "name": "feeAPerLiquidityCheckpoint",
            "type": "u128"
          },
          {
            "name": "feeBPerLiquidityCheckpoint",
            "type": "u128"
          },
          {
            "name": "feeAPending",
            "type": "u64"
          },
          {
            "name": "feeBPending",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u128",
                20
              ]
            }
          }
        ]
      }
    },
    {
      "name": "topListMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "docs": [
              "Vault"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "unstake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeEscrow",
            "type": "publicKey"
          },
          {
            "name": "unstakeAmount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "releaseAt",
            "type": "i64"
          },
          {
            "name": "owner",
            "docs": [
              "owner field, only be used for indexing"
            ],
            "type": "publicKey"
          },
          {
            "name": "vault",
            "docs": [
              "vault field, only be used for indexing"
            ],
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                22
              ]
            }
          }
        ]
      }
    },
    {
      "name": "feeVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lockEscrow",
            "docs": [
              "Lock escrow account"
            ],
            "type": "publicKey"
          },
          {
            "name": "stakeMint",
            "docs": [
              "Stake mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "quoteMint",
            "docs": [
              "Quote mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "pool",
            "docs": [
              "Pool"
            ],
            "type": "publicKey"
          },
          {
            "name": "stakeTokenVault",
            "docs": [
              "Stake token vault"
            ],
            "type": "publicKey"
          },
          {
            "name": "quoteTokenVault",
            "docs": [
              "Quote token vault"
            ],
            "type": "publicKey"
          },
          {
            "name": "topStakerList",
            "docs": [
              "Top staker list"
            ],
            "type": "publicKey"
          },
          {
            "name": "fullBalanceList",
            "docs": [
              "Full balance list"
            ],
            "type": "publicKey"
          },
          {
            "name": "metrics",
            "docs": [
              "Metrics"
            ],
            "type": {
              "defined": "Metrics"
            }
          },
          {
            "name": "configuration",
            "docs": [
              "Configuration parameters"
            ],
            "type": {
              "defined": "Configuration"
            }
          },
          {
            "name": "topStakerInfo",
            "docs": [
              "Top staker info"
            ],
            "type": {
              "defined": "TopStakerInfo"
            }
          },
          {
            "name": "creator",
            "docs": [
              "Creator"
            ],
            "type": "publicKey"
          },
          {
            "name": "createdAt",
            "docs": [
              "Created at"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump"
            ],
            "type": "u8"
          },
          {
            "name": "finalFeeClaimed",
            "docs": [
              "1 once the final lock escrow fee is claimed"
            ],
            "type": "u8"
          },
          {
            "name": "padding0",
            "docs": [
              "Padding"
            ],
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          },
          {
            "name": "padding",
            "docs": [
              "Padding"
            ],
            "type": {
              "array": [
                "u128",
                20
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeVaultParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "topListLength",
            "type": "u16"
          },
          {
            "name": "secondsToFullUnlock",
            "type": "u64"
          },
          {
            "name": "unstakeLockDuration",
            "type": "u64"
          },
          {
            "name": "startFeeDistributeTimestamp",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          }
        ]
      }
    },
    {
      "name": "StakerBalance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "balance",
            "docs": [
              "Balance"
            ],
            "type": "u64"
          },
          {
            "name": "owner",
            "docs": [
              "Owner pubkey, we don't need this for logic, but it is useful for indexing"
            ],
            "type": "publicKey"
          },
          {
            "name": "isInTopList",
            "docs": [
              "In top list"
            ],
            "type": "u8"
          },
          {
            "name": "padding",
            "docs": [
              "Padding"
            ],
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          }
        ]
      }
    },
    {
      "name": "StakerMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeAmount",
            "docs": [
              "Staked amount"
            ],
            "type": "u64"
          },
          {
            "name": "fullBalanceIndex",
            "docs": [
              "Full balance list index. When it's negative, the slot is empty"
            ],
            "type": "i64"
          },
          {
            "name": "owner",
            "docs": [
              "Owner pubkey, we dont need this for logic, but it is useful for indexing"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "Configuration",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "secondsToFullUnlock",
            "docs": [
              "Time required for locked claim fee to be fully dripped"
            ],
            "type": "u64"
          },
          {
            "name": "unstakeLockDuration",
            "docs": [
              "Unstake lock duration"
            ],
            "type": "u64"
          },
          {
            "name": "startFeeDistributeTimestamp",
            "docs": [
              "When the fee start distributes"
            ],
            "type": "i64"
          },
          {
            "name": "padding0",
            "docs": [
              "padding 0"
            ],
            "type": "u64"
          },
          {
            "name": "padding",
            "docs": [
              "padding"
            ],
            "type": {
              "array": [
                "u128",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Metrics",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalStakedAmount",
            "docs": [
              "Total staked amount"
            ],
            "type": "u64"
          },
          {
            "name": "totalStakeEscrowCount",
            "docs": [
              "Total stake escrow count"
            ],
            "type": "u64"
          },
          {
            "name": "ongoingTotalPartialUnstakeAmount",
            "docs": [
              "Ongoing total partial unstake amount"
            ],
            "type": "u64"
          },
          {
            "name": "padding0",
            "docs": [
              "padding 0"
            ],
            "type": "u64"
          },
          {
            "name": "totalFeeAAmount",
            "docs": [
              "Total claimed fee a amount"
            ],
            "type": "u128"
          },
          {
            "name": "totalFeeBAmount",
            "docs": [
              "Total claimed fee b amount"
            ],
            "type": "u128"
          },
          {
            "name": "userTotalClaimedFeeA",
            "docs": [
              "User total claimed fee a"
            ],
            "type": "u128"
          },
          {
            "name": "userTotalClaimedFeeB",
            "docs": [
              "User total claimed fee b"
            ],
            "type": "u128"
          },
          {
            "name": "padding",
            "docs": [
              "padding"
            ],
            "type": {
              "array": [
                "u128",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "TopStakerInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "topListLength",
            "docs": [
              "Number of holder in the top list"
            ],
            "type": "u64"
          },
          {
            "name": "currentLength",
            "docs": [
              "Current length, used for resize"
            ],
            "type": "u64"
          },
          {
            "name": "effectiveStakeAmount",
            "docs": [
              "Effective stake amount. Total stake amount in the top list."
            ],
            "type": "u64"
          },
          {
            "name": "lastClaimFeeAt",
            "docs": [
              "Last claim fee at"
            ],
            "type": "i64"
          },
          {
            "name": "lastUpdatedAt",
            "docs": [
              "Last fee drip updated at"
            ],
            "type": "i64"
          },
          {
            "name": "lockedFeeA",
            "docs": [
              "Locked fee a"
            ],
            "type": "u64"
          },
          {
            "name": "lockedFeeB",
            "docs": [
              "Locked fee b"
            ],
            "type": "u64"
          },
          {
            "name": "padding0",
            "docs": [
              "Padding"
            ],
            "type": "u64"
          },
          {
            "name": "cumulativeFeeAPerLiquidity",
            "docs": [
              "cumulative fee a per liquidity"
            ],
            "type": "u128"
          },
          {
            "name": "cumulativeFeeBPerLiquidity",
            "docs": [
              "cumulative fee b per liquidity"
            ],
            "type": "u128"
          },
          {
            "name": "padding",
            "docs": [
              "padding"
            ],
            "type": {
              "array": [
                "u128",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Rounding",
      "docs": [
        "Round up, down"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Up"
          },
          {
            "name": "Down"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "VaultCreated",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenBMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "quoteMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "creator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "topListLength",
          "type": "u16",
          "index": false
        },
        {
          "name": "secondsToFullUnlock",
          "type": "u64",
          "index": false
        },
        {
          "name": "unstakeLockDuration",
          "type": "u64",
          "index": false
        },
        {
          "name": "startFeeDistributeTimestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "StakeEscrowCreated",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "escrow",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fullBalanceIndex",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ConfigCreated",
      "fields": [
        {
          "name": "config",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "index",
          "type": "u64",
          "index": false
        },
        {
          "name": "secondsToFullUnlock",
          "type": "u64",
          "index": false
        },
        {
          "name": "unstakeLockDuration",
          "type": "u64",
          "index": false
        },
        {
          "name": "joinWindowDuration",
          "type": "u64",
          "index": false
        },
        {
          "name": "topListLength",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "ConfigClosed",
      "fields": [
        {
          "name": "config",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "index",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeCreated",
      "fields": [
        {
          "name": "unstake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowOngoingTotalUnstakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "startAt",
          "type": "i64",
          "index": false
        },
        {
          "name": "endAt",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "CancelUnstakeSucceed",
      "fields": [
        {
          "name": "unstake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowOngoingTotalUnstakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawSucceed",
      "fields": [
        {
          "name": "unstake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowOngoingTotalUnstakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawStakeSucceed",
      "fields": [
        {
          "name": "stakeEscrow",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimFeeSucceed",
      "fields": [
        {
          "name": "stakeEscrow",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeAAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalFeeAAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "totalFeeBAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "FeeEmission",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAClaimed",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenBClaimed",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenAReleased",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenBReleased",
          "type": "u64",
          "index": false
        },
        {
          "name": "cumulativeFeeAPerLiquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "cumulativeFeeBPerLiquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "effectiveStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "AddNewUserToTopHolder",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveUserFromTopHolder",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "UserStake",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalStakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ReclaimIndex",
      "fields": [
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "inOwner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "inOwnerBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "outOwner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "outOwnerBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "reclaimIndex",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateUnstakeLockDuration",
      "fields": [
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oldValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "newValue",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateSecondsToFullUnlock",
      "fields": [
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oldValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "newValue",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidEscrowOwner",
      "msg": "Escrow owner is not vault"
    },
    {
      "code": 6001,
      "name": "InvalidTopListLength",
      "msg": "Invalid top list length"
    },
    {
      "code": 6002,
      "name": "InvalidSecondsToFullUnlock",
      "msg": "Invalid seconds to full unlock"
    },
    {
      "code": 6003,
      "name": "MustHaveQuoteTokenOrInvalidStakeMint",
      "msg": "Pool missing SOL/USDC token or invalid stake mint"
    },
    {
      "code": 6004,
      "name": "MissingDroppedStakeEscrow",
      "msg": "Missing dropped stake escrow"
    },
    {
      "code": 6005,
      "name": "InvalidStakeEscrow",
      "msg": "Invalid stake escrow"
    },
    {
      "code": 6006,
      "name": "FullBalanceListFull",
      "msg": "Full balance list is full"
    },
    {
      "code": 6007,
      "name": "MintDoesNotBelongToPool",
      "msg": "Mint does not belong to the pool"
    },
    {
      "code": 6008,
      "name": "InsufficientStakeAmount",
      "msg": "Insufficient stake amount"
    },
    {
      "code": 6009,
      "name": "CannotWithdrawUnstakeAmount",
      "msg": "Unstake amount release date not reached"
    },
    {
      "code": 6010,
      "name": "InvalidAdmin",
      "msg": "Invalid admin"
    },
    {
      "code": 6011,
      "name": "InvalidUnstakeLockDuration",
      "msg": "Invalid unstake lock duration"
    },
    {
      "code": 6012,
      "name": "InvalidJoinWindowDuration",
      "msg": "Invalid join window duration"
    },
    {
      "code": 6013,
      "name": "InvalidCustomStartFeeDistributeTimestamp",
      "msg": "Invalid custom start fee distribute timestamp"
    },
    {
      "code": 6014,
      "name": "InvalidSmallestStakeEscrow",
      "msg": "Invalid smallest stake escrow"
    },
    {
      "code": 6015,
      "name": "MathOverflow",
      "msg": "MathOverflow"
    },
    {
      "code": 6016,
      "name": "TypeCastFailed",
      "msg": "Type casting failed"
    },
    {
      "code": 6017,
      "name": "InvalidLockEscrowRelatedAccounts",
      "msg": "Invalid lock escrow related accounts"
    },
    {
      "code": 6018,
      "name": "OnlyConstantProductPool",
      "msg": "Only constant product pool is supported"
    },
    {
      "code": 6019,
      "name": "UndeterminedError",
      "msg": "Undetermined error"
    },
    {
      "code": 6020,
      "name": "MissingSmallestStakeEscrow",
      "msg": "Missing smallest stake escrow"
    },
    {
      "code": 6021,
      "name": "UpdatedValueIsTheSame",
      "msg": "Updated value is the same as old value"
    },
    {
      "code": 6022,
      "name": "InvalidFeeCrankIx",
      "msg": "Invalid fee crank instruction"
    },
    {
      "code": 6023,
      "name": "Deprecated",
      "msg": "Instruction is deprecated"
    },
    {
      "code": 6024,
      "name": "NothingToExit",
      "msg": "Nothing to exit"
    }
  ]
};

export const IDL: StakeForFee = {
  "version": "0.1.2",
  "name": "stake_for_fee",
  "instructions": [
    {
      "name": "initializeVault",
      "docs": [
        "Deprecated"
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Vault account"
          ]
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token a vault"
          ]
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Token b vault"
          ]
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Top staker list account"
          ]
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Full balance list account"
          ]
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Pool account"
          ]
        },
        {
          "name": "stakeMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Stake mint"
          ]
        },
        {
          "name": "quoteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Quote mint"
          ]
        },
        {
          "name": "lockEscrow",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Escrow account"
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitializeVaultParams"
          }
        }
      ]
    },
    {
      "name": "initializeStakeEscrow",
      "docs": [
        "Deprecated"
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stake",
      "docs": [
        "Deprecated"
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "smallestStakeEscrow",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "userStakeToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimFee",
      "docs": [
        "Deprecated. Use `claim_fee_and_withdraw_full` instead."
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "smallestStakeEscrow",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "userQuoteToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maxFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "requestUnstake",
      "docs": [
        "Deprecated. Use `claim_fee_and_withdraw_full` instead."
      ],
      "accounts": [
        {
          "name": "unstake",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unstakeAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelUnstake",
      "docs": [
        "Deprecated"
      ],
      "accounts": [
        {
          "name": "unstake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "smallestStakeEscrow",
          "isMut": true,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdraw",
      "docs": [
        "Withdraw an existing unstake request. The program is deprecated, so the unstake lock duration is not enforced."
      ],
      "accounts": [
        {
          "name": "unstake",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userStakeToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimFeeAndWithdrawFull",
      "docs": [
        "Claim all pending stake and quote token fees to the user, then withdraw the whole stake amount",
        "directly from the stake escrow, without an unstake request and lock duration.",
        "An existing unstake request is not affected; use `withdraw` to complete it."
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topStakerList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fullBalanceList",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userStakeToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userQuoteToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimFeeCrank",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stakeTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lockEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bTokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bVaultLpMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateUnstakeLockDuration",
      "docs": [
        "Deprecated. `withdraw` no longer waits for the unstake lock duration, so it is no longer used."
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "unstakeLockDuration",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateSecondsToFullUnlock",
      "docs": [
        "Deprecated. Locked fees are released at once, so `seconds_to_full_unlock` is no longer used."
      ],
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructionsSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "secondsToFullUnlock",
          "type": "u64"
        }
      ]
    },
    {
      "name": "dummy",
      "docs": [
        "To force IDL generation for some struct for easier TS decoding later"
      ],
      "accounts": [
        {
          "name": "stakerMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakerBalance",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "stakerMetadataDummyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakerMetadata",
            "type": {
              "defined": "StakerMetadata"
            }
          }
        ]
      }
    },
    {
      "name": "stakerBalanceDummyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakerBalance",
            "type": {
              "defined": "StakerBalance"
            }
          }
        ]
      }
    },
    {
      "name": "fullBalanceListMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "length",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "stakeEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "fullBalanceIndex",
            "type": "u64"
          },
          {
            "name": "stakeAmount",
            "type": "u64"
          },
          {
            "name": "inTopList",
            "type": "u8"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u8",
                15
              ]
            }
          },
          {
            "name": "ongoingTotalPartialUnstakeAmount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "feeAClaimedAmount",
            "type": "u128"
          },
          {
            "name": "feeBClaimedAmount",
            "type": "u128"
          },
          {
            "name": "feeAPerLiquidityCheckpoint",
            "type": "u128"
          },
          {
            "name": "feeBPerLiquidityCheckpoint",
            "type": "u128"
          },
          {
            "name": "feeAPending",
            "type": "u64"
          },
          {
            "name": "feeBPending",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u128",
                20
              ]
            }
          }
        ]
      }
    },
    {
      "name": "topListMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "docs": [
              "Vault"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "unstake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeEscrow",
            "type": "publicKey"
          },
          {
            "name": "unstakeAmount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "releaseAt",
            "type": "i64"
          },
          {
            "name": "owner",
            "docs": [
              "owner field, only be used for indexing"
            ],
            "type": "publicKey"
          },
          {
            "name": "vault",
            "docs": [
              "vault field, only be used for indexing"
            ],
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                22
              ]
            }
          }
        ]
      }
    },
    {
      "name": "feeVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lockEscrow",
            "docs": [
              "Lock escrow account"
            ],
            "type": "publicKey"
          },
          {
            "name": "stakeMint",
            "docs": [
              "Stake mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "quoteMint",
            "docs": [
              "Quote mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "pool",
            "docs": [
              "Pool"
            ],
            "type": "publicKey"
          },
          {
            "name": "stakeTokenVault",
            "docs": [
              "Stake token vault"
            ],
            "type": "publicKey"
          },
          {
            "name": "quoteTokenVault",
            "docs": [
              "Quote token vault"
            ],
            "type": "publicKey"
          },
          {
            "name": "topStakerList",
            "docs": [
              "Top staker list"
            ],
            "type": "publicKey"
          },
          {
            "name": "fullBalanceList",
            "docs": [
              "Full balance list"
            ],
            "type": "publicKey"
          },
          {
            "name": "metrics",
            "docs": [
              "Metrics"
            ],
            "type": {
              "defined": "Metrics"
            }
          },
          {
            "name": "configuration",
            "docs": [
              "Configuration parameters"
            ],
            "type": {
              "defined": "Configuration"
            }
          },
          {
            "name": "topStakerInfo",
            "docs": [
              "Top staker info"
            ],
            "type": {
              "defined": "TopStakerInfo"
            }
          },
          {
            "name": "creator",
            "docs": [
              "Creator"
            ],
            "type": "publicKey"
          },
          {
            "name": "createdAt",
            "docs": [
              "Created at"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump"
            ],
            "type": "u8"
          },
          {
            "name": "finalFeeClaimed",
            "docs": [
              "1 once the final lock escrow fee is claimed"
            ],
            "type": "u8"
          },
          {
            "name": "padding0",
            "docs": [
              "Padding"
            ],
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          },
          {
            "name": "padding",
            "docs": [
              "Padding"
            ],
            "type": {
              "array": [
                "u128",
                20
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializeVaultParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "topListLength",
            "type": "u16"
          },
          {
            "name": "secondsToFullUnlock",
            "type": "u64"
          },
          {
            "name": "unstakeLockDuration",
            "type": "u64"
          },
          {
            "name": "startFeeDistributeTimestamp",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          }
        ]
      }
    },
    {
      "name": "StakerBalance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "balance",
            "docs": [
              "Balance"
            ],
            "type": "u64"
          },
          {
            "name": "owner",
            "docs": [
              "Owner pubkey, we don't need this for logic, but it is useful for indexing"
            ],
            "type": "publicKey"
          },
          {
            "name": "isInTopList",
            "docs": [
              "In top list"
            ],
            "type": "u8"
          },
          {
            "name": "padding",
            "docs": [
              "Padding"
            ],
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          }
        ]
      }
    },
    {
      "name": "StakerMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakeAmount",
            "docs": [
              "Staked amount"
            ],
            "type": "u64"
          },
          {
            "name": "fullBalanceIndex",
            "docs": [
              "Full balance list index. When it's negative, the slot is empty"
            ],
            "type": "i64"
          },
          {
            "name": "owner",
            "docs": [
              "Owner pubkey, we dont need this for logic, but it is useful for indexing"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "Configuration",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "secondsToFullUnlock",
            "docs": [
              "Time required for locked claim fee to be fully dripped"
            ],
            "type": "u64"
          },
          {
            "name": "unstakeLockDuration",
            "docs": [
              "Unstake lock duration"
            ],
            "type": "u64"
          },
          {
            "name": "startFeeDistributeTimestamp",
            "docs": [
              "When the fee start distributes"
            ],
            "type": "i64"
          },
          {
            "name": "padding0",
            "docs": [
              "padding 0"
            ],
            "type": "u64"
          },
          {
            "name": "padding",
            "docs": [
              "padding"
            ],
            "type": {
              "array": [
                "u128",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Metrics",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalStakedAmount",
            "docs": [
              "Total staked amount"
            ],
            "type": "u64"
          },
          {
            "name": "totalStakeEscrowCount",
            "docs": [
              "Total stake escrow count"
            ],
            "type": "u64"
          },
          {
            "name": "ongoingTotalPartialUnstakeAmount",
            "docs": [
              "Ongoing total partial unstake amount"
            ],
            "type": "u64"
          },
          {
            "name": "padding0",
            "docs": [
              "padding 0"
            ],
            "type": "u64"
          },
          {
            "name": "totalFeeAAmount",
            "docs": [
              "Total claimed fee a amount"
            ],
            "type": "u128"
          },
          {
            "name": "totalFeeBAmount",
            "docs": [
              "Total claimed fee b amount"
            ],
            "type": "u128"
          },
          {
            "name": "userTotalClaimedFeeA",
            "docs": [
              "User total claimed fee a"
            ],
            "type": "u128"
          },
          {
            "name": "userTotalClaimedFeeB",
            "docs": [
              "User total claimed fee b"
            ],
            "type": "u128"
          },
          {
            "name": "padding",
            "docs": [
              "padding"
            ],
            "type": {
              "array": [
                "u128",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "TopStakerInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "topListLength",
            "docs": [
              "Number of holder in the top list"
            ],
            "type": "u64"
          },
          {
            "name": "currentLength",
            "docs": [
              "Current length, used for resize"
            ],
            "type": "u64"
          },
          {
            "name": "effectiveStakeAmount",
            "docs": [
              "Effective stake amount. Total stake amount in the top list."
            ],
            "type": "u64"
          },
          {
            "name": "lastClaimFeeAt",
            "docs": [
              "Last claim fee at"
            ],
            "type": "i64"
          },
          {
            "name": "lastUpdatedAt",
            "docs": [
              "Last fee drip updated at"
            ],
            "type": "i64"
          },
          {
            "name": "lockedFeeA",
            "docs": [
              "Locked fee a"
            ],
            "type": "u64"
          },
          {
            "name": "lockedFeeB",
            "docs": [
              "Locked fee b"
            ],
            "type": "u64"
          },
          {
            "name": "padding0",
            "docs": [
              "Padding"
            ],
            "type": "u64"
          },
          {
            "name": "cumulativeFeeAPerLiquidity",
            "docs": [
              "cumulative fee a per liquidity"
            ],
            "type": "u128"
          },
          {
            "name": "cumulativeFeeBPerLiquidity",
            "docs": [
              "cumulative fee b per liquidity"
            ],
            "type": "u128"
          },
          {
            "name": "padding",
            "docs": [
              "padding"
            ],
            "type": {
              "array": [
                "u128",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Rounding",
      "docs": [
        "Round up, down"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Up"
          },
          {
            "name": "Down"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "VaultCreated",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenBMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "quoteMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "creator",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "topListLength",
          "type": "u16",
          "index": false
        },
        {
          "name": "secondsToFullUnlock",
          "type": "u64",
          "index": false
        },
        {
          "name": "unstakeLockDuration",
          "type": "u64",
          "index": false
        },
        {
          "name": "startFeeDistributeTimestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "StakeEscrowCreated",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "escrow",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "fullBalanceIndex",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ConfigCreated",
      "fields": [
        {
          "name": "config",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "index",
          "type": "u64",
          "index": false
        },
        {
          "name": "secondsToFullUnlock",
          "type": "u64",
          "index": false
        },
        {
          "name": "unstakeLockDuration",
          "type": "u64",
          "index": false
        },
        {
          "name": "joinWindowDuration",
          "type": "u64",
          "index": false
        },
        {
          "name": "topListLength",
          "type": "u16",
          "index": false
        }
      ]
    },
    {
      "name": "ConfigClosed",
      "fields": [
        {
          "name": "config",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "index",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeCreated",
      "fields": [
        {
          "name": "unstake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowOngoingTotalUnstakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "startAt",
          "type": "i64",
          "index": false
        },
        {
          "name": "endAt",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "CancelUnstakeSucceed",
      "fields": [
        {
          "name": "unstake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowOngoingTotalUnstakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawSucceed",
      "fields": [
        {
          "name": "unstake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowOngoingTotalUnstakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawStakeSucceed",
      "fields": [
        {
          "name": "stakeEscrow",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "newStakeEscrowAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimFeeSucceed",
      "fields": [
        {
          "name": "stakeEscrow",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeAAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalFeeAAmount",
          "type": "u128",
          "index": false
        },
        {
          "name": "totalFeeBAmount",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "FeeEmission",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenAClaimed",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenBClaimed",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenAReleased",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenBReleased",
          "type": "u64",
          "index": false
        },
        {
          "name": "cumulativeFeeAPerLiquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "cumulativeFeeBPerLiquidity",
          "type": "u128",
          "index": false
        },
        {
          "name": "effectiveStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "AddNewUserToTopHolder",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveUserFromTopHolder",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "UserStake",
      "fields": [
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "totalStakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeBPending",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        },
        {
          "name": "feeBPerLiquidityCheckpoint",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "ReclaimIndex",
      "fields": [
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "inOwner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "inOwnerBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "outOwner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "outOwnerBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "reclaimIndex",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateUnstakeLockDuration",
      "fields": [
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oldValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "newValue",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateSecondsToFullUnlock",
      "fields": [
        {
          "name": "vault",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oldValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "newValue",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidEscrowOwner",
      "msg": "Escrow owner is not vault"
    },
    {
      "code": 6001,
      "name": "InvalidTopListLength",
      "msg": "Invalid top list length"
    },
    {
      "code": 6002,
      "name": "InvalidSecondsToFullUnlock",
      "msg": "Invalid seconds to full unlock"
    },
    {
      "code": 6003,
      "name": "MustHaveQuoteTokenOrInvalidStakeMint",
      "msg": "Pool missing SOL/USDC token or invalid stake mint"
    },
    {
      "code": 6004,
      "name": "MissingDroppedStakeEscrow",
      "msg": "Missing dropped stake escrow"
    },
    {
      "code": 6005,
      "name": "InvalidStakeEscrow",
      "msg": "Invalid stake escrow"
    },
    {
      "code": 6006,
      "name": "FullBalanceListFull",
      "msg": "Full balance list is full"
    },
    {
      "code": 6007,
      "name": "MintDoesNotBelongToPool",
      "msg": "Mint does not belong to the pool"
    },
    {
      "code": 6008,
      "name": "InsufficientStakeAmount",
      "msg": "Insufficient stake amount"
    },
    {
      "code": 6009,
      "name": "CannotWithdrawUnstakeAmount",
      "msg": "Unstake amount release date not reached"
    },
    {
      "code": 6010,
      "name": "InvalidAdmin",
      "msg": "Invalid admin"
    },
    {
      "code": 6011,
      "name": "InvalidUnstakeLockDuration",
      "msg": "Invalid unstake lock duration"
    },
    {
      "code": 6012,
      "name": "InvalidJoinWindowDuration",
      "msg": "Invalid join window duration"
    },
    {
      "code": 6013,
      "name": "InvalidCustomStartFeeDistributeTimestamp",
      "msg": "Invalid custom start fee distribute timestamp"
    },
    {
      "code": 6014,
      "name": "InvalidSmallestStakeEscrow",
      "msg": "Invalid smallest stake escrow"
    },
    {
      "code": 6015,
      "name": "MathOverflow",
      "msg": "MathOverflow"
    },
    {
      "code": 6016,
      "name": "TypeCastFailed",
      "msg": "Type casting failed"
    },
    {
      "code": 6017,
      "name": "InvalidLockEscrowRelatedAccounts",
      "msg": "Invalid lock escrow related accounts"
    },
    {
      "code": 6018,
      "name": "OnlyConstantProductPool",
      "msg": "Only constant product pool is supported"
    },
    {
      "code": 6019,
      "name": "UndeterminedError",
      "msg": "Undetermined error"
    },
    {
      "code": 6020,
      "name": "MissingSmallestStakeEscrow",
      "msg": "Missing smallest stake escrow"
    },
    {
      "code": 6021,
      "name": "UpdatedValueIsTheSame",
      "msg": "Updated value is the same as old value"
    },
    {
      "code": 6022,
      "name": "InvalidFeeCrankIx",
      "msg": "Invalid fee crank instruction"
    },
    {
      "code": 6023,
      "name": "Deprecated",
      "msg": "Instruction is deprecated"
    },
    {
      "code": 6024,
      "name": "NothingToExit",
      "msg": "Nothing to exit"
    }
  ]
};
