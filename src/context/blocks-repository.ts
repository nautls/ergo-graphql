import { BlockInfoEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type BlockFindOptions = FindManyParams<BlockInfoEntity> & {
  minHeight?: number;
  maxHeight?: number;
};

export class BlocksRepository extends BaseRepository<BlockInfoEntity> {
  constructor(context: RepositoryDataContext) {
    super(BlockInfoEntity, "block", {
      context,
      defaults: {
        where: { mainChain: true },
        orderBy: { height: "DESC" }
      }
    });
  }

  public override async find(options: BlockFindOptions): Promise<BlockInfoEntity[]> {
    const { minHeight, maxHeight } = options;
    return this.findBase(options, (filterQuery) => {
      if (minHeight) {
        filterQuery = filterQuery.andWhere(`${this.alias}.height >= :minHeight`, { minHeight });
      }
      if (maxHeight) {
        filterQuery = filterQuery.andWhere(`${this.alias}.height <= :maxHeight`, { maxHeight });
      }
      return filterQuery.setParameters({ minHeight, maxHeight });
    });
  }
}
