import { appDataSource } from "../../data-source";
import { Token } from "../../entities";
import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { DEFAULT_SKIP, DEFAULT_TAKE } from "../../consts";
import { takeAmountArg } from "../scalars";
import { conditionalRelationList } from "../utils";

export const tokenType = objectType({
  name: "Token",
  definition(t) {
    t.nonNull.string("tokenId");
    t.nonNull.string("boxId");
    t.nonNull.field("box", { type: "Box" });
    t.nonNull.bigInt("emissionAmount");
    t.nullable.string("name");
    t.nullable.string("description");
    t.nullable.string("type");
    t.nullable.int("decimals");
  }
});

export const tokenQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("tokens", {
      type: "Token",
      args: {
        tokenId: stringArg(),
        skip: nonNull(intArg({ default: DEFAULT_SKIP })),
        take: nonNull(takeAmountArg({ default: DEFAULT_TAKE }))
      },
      async resolve(parent, args, context, info) {
        return await appDataSource.getRepository(Token).find({
          where: args.tokenId ? { tokenId: args.tokenId } : undefined,
          take: args.take,
          skip: args.skip,
          relations: conditionalRelationList(
            info,
            "box",
            "box.assets",
            "box.assets.token",
            "box.assets.token.box"
          )
        });
      }
    });
  }
});
