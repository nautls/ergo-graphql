import { EpochsParameterEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { GraphQLResolveInfo } from "graphql";

export class EpochsRepository extends BaseRepository<EpochsParameterEntity> {
  constructor(context: RepositoryDataContext) {
    super(EpochsParameterEntity, "epochs", {
      context,
      defaults: {
        orderBy: { height: "DESC" }
      }
    });
  }
  public async getLast(info: GraphQLResolveInfo): Promise<EpochsParameterEntity | null> {
    return await this.first({ resolverInfo: info });
  }
}
