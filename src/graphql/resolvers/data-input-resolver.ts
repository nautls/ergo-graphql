import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Query, Resolver } from "type-graphql";
import { InputEntity } from "../../entities";
import { DataInput } from "../objects/data-input";
import { removeUndefined } from "../../utils";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class DataInputsQueryArgs {
  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => String, { nullable: true })
  headerId?: string;
}

@Resolver(DataInput)
export class DataInputResolver {
  @Query(() => [DataInput])
  async dataInputs(
    @Args() { transactionId, boxId, headerId }: DataInputsQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    const where = removeUndefined({
      transactionId,
      boxId,
      headerId
    });

    return await context.loader
      .loadEntity(InputEntity, "dataInput")
      .info(info)
      .ejectQueryBuilder((query) => query.where(where).skip(skip).take(take))
      .loadMany();
  }
}
