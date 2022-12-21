import { GraphQLResolveInfo, GraphQLError } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, InputType, Query, Resolver, Int } from "type-graphql";
import { Box } from "../objects";
import { removeUndefined } from "../../utils";
import { isFieldSelected } from "./utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";
import { ValidateIf, IsEmpty, isDefined, ArrayMaxSize } from "class-validator";

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
  /** @deprecated */
  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => [String], { nullable: true })
  @ArrayMaxSize(20)
  boxIds?: string[];

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
    const arrayIndexFields = [o.boxIds, o.addresses, o.ergoTrees];
    const arraysLength = arrayIndexFields.filter((el) => {
      if (isDefined(el) && el) {
        return el.length > 0;
      }
      return false;
    }).length;
    return !(definedCount > 0 || arraysLength > 0);
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

  @ValidateIf((o: BoxesQueryArgs) => {
    return o.containsTokens !== undefined && o.containsTokens.length > 0;
  })
  @IsEmpty({
    message: "'tokenId' filter can not be used in combination with 'containsTokens' filter."
  })
  @Field(() => String, { nullable: true })
  tokenId?: string;

  @Field(() => [String], { nullable: true })
  @ArrayMaxSize(5)
  containsTokens?: string[];

  /** @deprecated */
  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => [String], { nullable: true })
  @ArrayMaxSize(20)
  addresses?: string[];

  /** @deprecated */
  @Field(() => String, { nullable: true })
  ergoTree?: string;

  @Field(() => [String], { nullable: true })
  @ArrayMaxSize(20)
  ergoTrees?: string[];

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
      addresses,
      boxId,
      boxIds,
      transactionId,
      headerId,
      ergoTree,
      ergoTrees,
      ergoTreeTemplateHash,
      tokenId,
      containsTokens,
      spent,
      registers,
      minHeight,
      maxHeight
    }: BoxesQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    const arrayArguments = [addresses, boxIds, ergoTrees, containsTokens];
    let arrayArgumentsLength = 0;
    for (const arg of arrayArguments) {
      if (arg) {
        arrayArgumentsLength += arg.length;
      }
    }

    const literalArguments = removeUndefined({
      address,
      boxId,
      transactionId,
      headerId,
      ergoTree,
      ergoTreeTemplateHash,
      tokenId,
      spent,
      minHeight,
      maxHeight
    });
    const literalArgumentsLength = Object.keys(literalArguments).length;

    let definedRegistersLength = 0;
    if (registers) {
      const definedRegisters = removeUndefined({ ...registers });
      definedRegistersLength = Object.keys(definedRegisters).length;
    }

    const argsLength = arrayArgumentsLength + literalArgumentsLength + definedRegistersLength;
    if (argsLength < 1) {
      throw new GraphQLError("At least one argument is required for box query.");
    }

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
      addresses,
      ergoTrees,
      tokenId,
      containsTokens,
      registers,
      minHeight,
      maxHeight,
      boxIds,
      skip,
      take
    });

    const resultBoxIds = boxes.map((box) => box.boxId);

    const unconfirmedInputBoxIds = isFieldSelected(info, "beingSpent")
      ? await context.repository.unconfirmedInputs.getUnconfirmedInputBoxIds(resultBoxIds)
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
