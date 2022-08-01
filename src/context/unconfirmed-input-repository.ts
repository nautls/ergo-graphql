import { UnconfirmedInputEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";

export class UnconfirmedInputRepository extends BaseRepository<UnconfirmedInputEntity> {
  constructor(context: RepositoryDataContext) {
    super(UnconfirmedInputEntity, "uinput", { context });
  }

  public async getUnconfirmedInputBoxIds(filteredBoxIds: string[]): Promise<string[]> {
    const boxIds = await this.repository
      .createQueryBuilder("uinput")
      .select("uinput.boxId", "boxId")
      .where("uinput.boxId IN (:...filteredBoxIds)", { filteredBoxIds })
      .getRawMany();

    return boxIds.map((item) => item.boxId);
  }
}
