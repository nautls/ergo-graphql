import { Field, ObjectType } from "type-graphql";
import { UnconfirmedTransaction } from "./unconfirmed-transaction";

@ObjectType({ simpleResolvers: true })
export class Mempool {
  @Field()
  size!: number;

  @Field()
  transactionsCount!: number;

  @Field(() => [UnconfirmedTransaction])
  transactions!: UnconfirmedTransaction[];
}
