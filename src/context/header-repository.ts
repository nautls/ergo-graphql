import { HeaderEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";

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
