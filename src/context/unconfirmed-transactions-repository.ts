import { UnconfirmedTransactionEntity } from "../entities";
import { BaseRepository } from "./base-repository";

export class UnconfirmedTransactionRepository extends BaseRepository<UnconfirmedTransactionEntity> {
  public async count(): Promise<number> {
    const { count } = await this.repository
      .createQueryBuilder("utx")
      .select("COUNT(utx.transactionId)", "count")
      .getRawOne();

    return count || 0;
  }

  public async sum(options: { by: "size" }) {
    const { sum } = await this.repository
      .createQueryBuilder("utx")
      .select(`SUM(utx.${options.by})`, "sum")
      .getRawOne();

    return sum || 0;
  }
}
