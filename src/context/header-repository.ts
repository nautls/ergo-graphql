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
}
