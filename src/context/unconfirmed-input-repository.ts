import { UnconfirmedInputEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";

export class UnconfirmedInputRepository extends BaseRepository<UnconfirmedInputEntity> {
  constructor(context: RepositoryDataContext) {
    super(UnconfirmedInputEntity, "uinput", { context });
  }

  public async getUnconfirmedInputBoxIds(): Promise<string[]> {
    const boxIds = await this.repository
      .createQueryBuilder("uinput")
      .select("uinput.boxId", "boxId")
      .getRawMany();

    return boxIds.map((item) => item.boxId);
  }
}
