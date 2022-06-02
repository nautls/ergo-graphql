import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, InputType, Query, Resolver } from "type-graphql";
import { Box } from "../objects";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";

@InputType()
class Registers {
  @Field(() => String, { nullable: true })
  R4?: string;

  @Field(() => String, { nullable: true })
  R5?: string;

  @Field(() => String, { nullable: true })
  R6?: string;

  @Field(() => String, { nullable: true })
  R7?: string;

  @Field(() => String, { nullable: true })
  R8?: string;

  @Field(() => String, { nullable: true })
  R9?: string;
}

@ArgsType()
class BoxesQueryArgs {
  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => Registers, { nullable: true })
  registers?: Registers;

  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => String, { nullable: true })
  headerId?: string;

  @Field(() => Boolean, { nullable: true })
  spent?: boolean;

  @Field(() => String, { nullable: true })
  tokenId?: string;

  @Field(() => String, { nullable: true })
  ergoTree?: string;

  @Field(() => String, { nullable: true })
  ergoTreeTemplateHash?: string;
}

@Resolver(Box)
export class BoxResolver {
  @Query(() => [Box])
  async boxes(
    @Args()
    {
      address,
      boxId,
      transactionId,
      headerId,
      ergoTree,
      ergoTreeTemplateHash,
      tokenId,
      spent,
      registers
    }: BoxesQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.boxes.find({
      resolverInfo: info,
      where: removeUndefined({
        address,
        boxId,
        transactionId,
        headerId,
        ergoTree,
        ergoTreeTemplateHash
      }),
      spent,
      tokenId,
      registers,
      skip,
      take
    });
  }
}
