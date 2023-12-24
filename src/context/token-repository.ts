import { TokenEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";
import { TokenMintingBox } from "../graphql/input-types/token";
import { isEmpty } from "lodash";
import { removeUndefined } from "../utils";

type TokenFindOptions = FindManyParams<TokenEntity> & {
  tokenIds?: string[];
  name?: string;
  mintingBox?: TokenMintingBox;
};

type Registers = {
  R4?: string;
  R5?: string;
  R6?: string;
  R7?: string;
  R8?: string;
  R9?: string;
};

export class TokenRepository extends BaseRepository<TokenEntity> {
  constructor(context: RepositoryDataContext) {
    super(TokenEntity, "token", {
      context
    });
  }

  public override async find(options: TokenFindOptions): Promise<TokenEntity[]> {
    const { tokenIds, name, mintingBox } = options;
    return this.findBase(options, (filterQuery) => {
      if (options.where?.tokenId && tokenIds) {
        tokenIds.push(options.where.tokenId);
        delete options.where.tokenId;
      }

      if (tokenIds && tokenIds.length > 0) {
        filterQuery = filterQuery.andWhere(`${this.alias}.tokenId IN (:...tokenIds)`, {
          tokenIds
        });
      }

      if (name) {
        if (name.indexOf("*") !== -1) {
          filterQuery = filterQuery.andWhere(`${this.alias}.name LIKE :name`, {
            name: name.replace("*", "%").replace("*", "%")
          });
        } else {
          filterQuery = filterQuery.andWhere(`${this.alias}.name = :name`, {
            name
          });
        }
      }

      if (mintingBox) {
        filterQuery = filterQuery.innerJoin(`${this.alias}.box`, "outBox");
        const { additionalRegisters: registers } = mintingBox;

        if (registers && !isEmpty(registers)) {
          filterQuery = filterQuery.innerJoin(`outBox.registers`, "rx");
          for (const key in registers) {
            const value = registers[key as keyof Registers];
            if (!value) {
              continue;
            }

            filterQuery = filterQuery.andWhere(
              `rx.registerId = :${key}_key AND rx.serializedValue = :${key}_value`,
              removeUndefined({
                R4_key: registers?.R4 ? "R4" : undefined,
                R4_value: registers?.R4,
                R5_key: registers?.R5 ? "R5" : undefined,
                R5_value: registers?.R5,
                R6_key: registers?.R6 ? "R6" : undefined,
                R6_value: registers?.R6,
                R7_key: registers?.R7 ? "R7" : undefined,
                R7_value: registers?.R7,
                R8_key: registers?.R8 ? "R8" : undefined,
                R8_value: registers?.R8,
                R9_key: registers?.R9 ? "R9" : undefined,
                R9_value: registers?.R9
              })
            );
          }
        }

        if (mintingBox.address) {
          filterQuery = filterQuery.andWhere(`outBox.address = :address`, {
            address: mintingBox.address
          });
        } else if (mintingBox.ergoTree) {
          filterQuery = filterQuery.andWhere(`outBox.ergoTree = :ergoTree`, {
            ergoTree: mintingBox.ergoTree
          });
        }
      }

      return filterQuery;
    });
  }
}
