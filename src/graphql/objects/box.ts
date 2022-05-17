import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Ctx, Field, Info, ObjectType, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, DEFAULT_TAKE } from "../../consts";
import { BoxEntity } from "../../entities";
import { JSONScalar } from "../scalars";

@ObjectType()
export class Asset {
  @Field()
  tokenId!: string;

  @Field()
  blockId!: string;

  @Field()
  value!: bigint;
  // token: ;
}

@ObjectType()
export class Box {
  @Field()
  boxId!: string;

  @Field()
  transactionId!: string;

  @Field()
  blockId!: string;

  @Field()
  value!: bigint;

  @Field()
  creationHeight!: number;

  @Field()
  settlementHeight!: number;

  @Field()
  index!: number;

  @Field()
  globalIndex!: number;

  @Field()
  ergoTree!: string;

  @Field()
  address!: string;

  @Field(() => [Asset])
  assets!: Asset[];

  @Field(() => JSONScalar, { simple: true })
  additionalRegisters!: object;

  @Field()
  mainChain!: boolean;
}

@Resolver(Box)
export class BoxObjectResolver {
  @Query(() => [Box])
  async boxes(
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.loader
      .loadEntity(BoxEntity, "box")
      .info(info)
      .ejectQueryBuilder((query) => query.take(100))
      .loadMany();
  }
}
