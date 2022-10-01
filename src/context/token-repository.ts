import { TokenEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type TokenFindOptions = FindManyParams<TokenEntity> & {
  tokenIds?: string[];
};

export class TokenRepository extends BaseRepository<TokenEntity> {
  constructor(context: RepositoryDataContext) {
    super(TokenEntity, "token", {
      context
    });
  }

  public override async find(options: TokenFindOptions): Promise<TokenEntity[]> {
    const { tokenIds } = options;
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
      return filterQuery;
    });
  }
}
