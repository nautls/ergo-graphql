import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { DEFAULT_SKIP, DEFAULT_TAKE } from "../../consts";
import { appDataSource } from "../../data-source";
import { Box } from "../../entities";
import { takeAmountArg } from "../scalars";
import { conditionalRelationList } from "../utils";

export const assetType = objectType({
  name: "Asset",
  definition(t) {
    t.nonNull.string("tokenId");
    t.nonNull.string("blockId");
    t.nonNull.bigInt("value");
    t.nonNull.field("token", { type: "Token" });
  }
});

export const boxType = objectType({
  name: "Box",
  definition(t) {
    t.nonNull.string("boxId");
    t.nonNull.string("transactionId");
    t.nonNull.string("blockId");
    t.nonNull.bigInt("value");
    t.nonNull.int("creationHeight");
    t.nonNull.int("settlementHeight");
    t.nonNull.int("index");
    t.nonNull.int("globalIndex");
    t.nonNull.string("ergoTree");
    t.nonNull.string("address");
    t.nonNull.list.field("assets", { type: "Asset" });
    t.nonNull.json("additionalRegisters");
    t.nonNull.boolean("mainChain");
  }
});

export const boxQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("boxes", {
      type: "Box",
      args: {
        boxId: stringArg(),
        address: stringArg(),
        skip: nonNull(intArg({ default: DEFAULT_SKIP })),
        take: nonNull(takeAmountArg({ default: DEFAULT_TAKE }))
      },
      async resolve(parent, args, ctx, info) {
        return await appDataSource.getRepository(Box).find({
          where: {
            boxId: args.boxId as string | undefined,
            address: args.address as string | undefined
          },
          skip: args.skip,
          take: args.take,
          relations: conditionalRelationList(
            info,
            "assets",
            "assets.token",
            "assets.token.box"
          )
        });
      }
    });
  }
});
