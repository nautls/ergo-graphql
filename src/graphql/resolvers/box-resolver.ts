import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, InputType, Query, Resolver, Int } from "type-graphql";
import { Box } from "../objects";
import { removeUndefined } from "../../utils";
import { isFieldSelected } from "./utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";
import { ValidateIf, IsEmpty, isDefined } from "class-validator";

export const REDUNDANT_QUERY_MESSAGE =
  "Redundant query param: address and ergoTree params can't be used together in the same query.";

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
  boxId?: string;

  @ValidateIf((o: BoxesQueryArgs) => {
    if (!isDefined(o.spent)) return true;

    const indexFields = [
      o.boxId,
      o.transactionId,
      o.headerId,
      o.address,
      o.ergoTree,
      o.ergoTreeTemplateHash
    ];
    const definedCount = indexFields.filter((el) => isDefined(el)).length;
    return !(definedCount > 0);
  })
  @IsEmpty({
    message:
      "'registers' filter should be used in combination with 'spent' and at least one of 'boxId', 'transactionId', 'headerId', 'address', 'ergoTree' or 'ergoTreeTemplateHash' fields."
  })
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

  @ValidateIf((o: BoxesQueryArgs) => isDefined(o.ergoTree))
  @IsEmpty({ message: REDUNDANT_QUERY_MESSAGE })
  @Field(() => String, { nullable: true })
  address?: string;

  @ValidateIf((o: BoxesQueryArgs) => isDefined(o.address))
  @IsEmpty({ message: REDUNDANT_QUERY_MESSAGE })
  @Field(() => String, { nullable: true })
  ergoTree?: string;

  @Field(() => String, { nullable: true })
  ergoTreeTemplateHash?: string;

  @Field(() => Int, { nullable: true })
  minHeight?: number;

  @Field(() => Int, { nullable: true })
  maxHeight?: number;
}

@Resolver(Box)
export class BoxResolver {
  @Query(() => [Box])
  async boxes(
    @Args({ validate: true })
    {
      address,
      boxId,
      transactionId,
      headerId,
      ergoTree,
      ergoTreeTemplateHash,
      tokenId,
      spent,
      registers,
      minHeight,
      maxHeight
    }: BoxesQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    const boxes = await context.repository.boxes.find({
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
      minHeight,
      maxHeight,
      skip,
      take
    });

    const boxIds = boxes.map((box) => box.boxId);

    const unconfirmedInputBoxIds = isFieldSelected(info, "beingSpent")
      ? await context.repository.unconfirmedInputs.getUnconfirmedInputBoxIds(boxIds)
      : [];

    if (!isFieldSelected(info, "beingSpent")) {
      return boxes;
    }

    return boxes.map((box) => {
      return {
        ...box,
        beingSpent: unconfirmedInputBoxIds.indexOf(box.boxId) > -1
      };
    });
  }
}
