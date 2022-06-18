import { Field, ObjectType } from "type-graphql";
import { UnconfirmedAddress } from "./unconfirmed-address";
import { UnconfirmedBox } from "./unconfirmed-box";
import { UnconfirmedTransaction } from "./unconfirmed-transaction";

@ObjectType({ simpleResolvers: true })
export class Mempool {
  @Field()
  size!: number;

  @Field()
  transactionsCount!: number;

  @Field(() => [UnconfirmedTransaction])
  transactions!: UnconfirmedTransaction[];

  @Field(() => [UnconfirmedBox])
  boxes!: UnconfirmedBox[];

  @Field(() => [UnconfirmedAddress])
  addresses!: UnconfirmedAddress[];
}
