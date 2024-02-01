import { HeaderEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import {FindManyParams} from "./repository-interface";

type HeaderFindOptions = FindManyParams<HeaderEntity> & {
  headerIds?: string[];
}

export class HeaderRepository extends BaseRepository<HeaderEntity> {
  constructor(context: RepositoryDataContext) {
    super(HeaderEntity, "header", {
      context,
      defaults: {
        where: { mainChain: true },
        orderBy: { height: "DESC" }
      }
    });
  }

  public override async find(options: HeaderFindOptions): Promise<HeaderEntity[]> {
    const headerIds = options.headerIds ?? [];
    if(options.where?.headerId) {
      headerIds.push(options.where.headerId);
      delete options.where.headerId;
    }
    return this.findBase(options, (filterQuery) => {
      if(headerIds.length > 0) {
        filterQuery = filterQuery.andWhere("header.headerId IN (:...headerIds)", { headerIds });
      }

      return filterQuery;
    })
  }

  public async getMaxHeight(): Promise<number | undefined> {
    const { height } = await this.repository
      .createQueryBuilder("header")
      .select("MAX(height)", "height")
      .getRawOne();
    return height;
  }

  public async getLastHeaderId(): Promise<number | undefined> {
    const { headerId } = await this.repository
      .createQueryBuilder("header")
      .select("id", "headerId")
      .orderBy("height", "DESC")
      .limit(1)
      .getRawOne();

    return headerId;
  }
}
