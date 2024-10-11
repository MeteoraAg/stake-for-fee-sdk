import { Connection, PublicKey } from "@solana/web3.js";
import { StakeForFee } from ".";

const testing = async () => {
  const feeFarm = await StakeForFee.create(
    new Connection("https://api.devnet.solana.com"),
    new PublicKey("4eM7eG987U56DRLGTaJ81AmRHXn2CW9ktum4LRCfKa4Y")
  );
  const stake = await feeFarm.getUserStakeAndClaimBalance(
    new PublicKey("DRyYK42AkqVuo1dMU4PQ9UsBdtaSEcYAW8icTnzK1RvQ")
  );
  console.log(
    "🚀 ~ testing ~ stake:",
    stake.stakeEscrow.feeAPending.toString()
  );
};

testing();
