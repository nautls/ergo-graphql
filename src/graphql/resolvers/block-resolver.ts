import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Int, Query, Resolver } from "type-graphql";
import { removeUndefined } from "../../utils";
import { Block } from "../objects/block";
import { BlockInfoEntity } from "../../entities";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class BlockQueryArgs extends PaginationArguments {
  @Field(() => String, { nullable: true })
  headerId?: string;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => Int, { defaultValue: 10 })
  take = 10;
}

@Resolver(Block)
export class BlockResolver {
  @Query(() => [Block])
  async blocks(
    @Args({ validate: true }) { headerId, height, skip, take }: BlockQueryArgs,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    const where = removeUndefined({
      headerId,
      height
    });

    return await context.loader
      .loadEntity(BlockInfoEntity, "block")
      .info(info)
      .ejectQueryBuilder((query) => {
        return query.where(where).skip(skip).take(take);
      })
      .loadMany();
  }
}
