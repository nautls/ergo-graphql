import { Field, ObjectType } from "type-graphql";
import { Header } from "./header";

@ObjectType({ simpleResolvers: true })
export class Block {
  @Field()
  headerId!: string;

  @Field()
  timestamp!: bigint;

  @Field()
  height!: number;

  @Field()
  difficulty!: bigint;

  @Field()
  blockSize!: number;

  @Field()
  blockCoins!: bigint;

  @Field()
  blockMiningTime?: bigint;

  @Field()
  txsCount!: number;

  @Field()
  txsSize!: number;

  @Field()
  minerAddress!: string;

  @Field()
  minerReward!: bigint;

  @Field()
  minerRevenue!: bigint;

  @Field()
  blockFee!: bigint;

  @Field()
  blockChainTotalSize!: bigint;

  @Field()
  totalTxsCount!: bigint;

  @Field()
  totalCoinsIssued!: bigint;

  @Field()
  totalMiningTime!: bigint;

  @Field()
  totalFees!: bigint;

  @Field()
  totalMinersReward!: bigint;

  @Field()
  totalCoinsInTxs!: bigint;

  @Field()
  maxTxGix!: bigint;

  @Field()
  maxBoxGix!: bigint;

  @Field()
  mainChain!: boolean;

  @Field(() => Header)
  header!: Header;
}
