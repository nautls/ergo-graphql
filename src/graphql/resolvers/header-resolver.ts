import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Int, Query, Resolver } from "type-graphql";
import { HeaderEntity } from "../../entities";
import { Header } from "../objects";
import { removeUndefined } from "../../utils";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class BlockHeadersQueryArgs extends PaginationArguments {
  @Field(() => String, { nullable: true })
  parentId?: string;

  @Field(() => Number, { nullable: true })
  height?: number;

  @Field(() => Int, { defaultValue: 10 })
  take = 10;
}

@Resolver(Header)
export class HeaderResolver {
  @Query(() => [Header])
  async blockHeaders(
    @Args({ validate: true }) { parentId, height, skip, take }: BlockHeadersQueryArgs,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    const where = removeUndefined({
      parentId,
      height
    });

    return await context.loader
      .loadEntity(HeaderEntity, "header")
      .info(info)
      .ejectQueryBuilder((query) => {
        return query.where(where).skip(skip).take(take);
      })
      .loadMany();
  }
}
