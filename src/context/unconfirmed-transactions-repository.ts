import { UnconfirmedTransactionEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";

export class UnconfirmedTransactionRepository extends BaseRepository<UnconfirmedTransactionEntity> {
  constructor(context: RepositoryDataContext) {
    super(UnconfirmedTransactionEntity, "utx", { context });
  }

  public async count(): Promise<number> {
    const { count } = await this.repository
      .createQueryBuilder(this.alias)
      .select("COUNT(utx.transactionId)", "count")
      .getRawOne();

    return count || 0;
  }

  public async sum(options: { by: "size" }) {
    const { sum } = await this.repository
      .createQueryBuilder(this.alias)
      .select(`SUM(utx.${options.by})`, "sum")
      .getRawOne();

    return sum || 0;
  }
}
