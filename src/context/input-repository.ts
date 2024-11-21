import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { InputEntity } from "../entities";
import { FindManyParams } from "./repository-interface";

type InputFindOptions = FindManyParams<InputEntity> & {
  transactionId?: string;
  transactionIds?: string[];
  boxId?: string;
  boxIds?: string[];
};

export class InputsRepository extends BaseRepository<InputEntity> {
  constructor(context: RepositoryDataContext) {
    super(InputEntity, "inputs", {
      context,
      defaults: { where: { mainChain: true } }
    });
  }

  public override async find(options: InputFindOptions): Promise<InputEntity[]> {
    const { transactionId, transactionIds, boxId, boxIds } = options;
    const txIds = transactionIds ?? [];
    if (transactionId) {
      txIds.push(transactionId);
    }
    const bxIds = boxIds ?? [];
    if (boxId) {
      bxIds.push(boxId);
    }
    return this.findBase(options, (filterQuery) => {
      if (txIds.length > 0) {
        filterQuery = filterQuery.andWhere(`${this.alias}.transactionId IN (:...txIds)`, {
          txIds
        });
      }
      if (bxIds.length > 0) {
        filterQuery = filterQuery.andWhere(`${this.alias}.boxId IN (:...bxIds)`, {
          bxIds
        });
      }
      return filterQuery;
    });
  }
}
