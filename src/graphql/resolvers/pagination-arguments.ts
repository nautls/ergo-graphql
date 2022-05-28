import { IsDefined, Max, Min } from "class-validator";
import { ArgsType, Field, Int } from "type-graphql";
import { MIN_SKIP, MAX_TAKE, MIN_TAKE } from "../../consts";

@ArgsType()
export abstract class PaginationArguments {
  @Field(() => Int, { defaultValue: MIN_SKIP })
  @Min(MIN_SKIP)
  @IsDefined()
  skip = MIN_SKIP;

  @Field(() => Int, { defaultValue: MAX_TAKE })
  @Min(MIN_TAKE)
  @Max(MAX_TAKE)
  @IsDefined()
  take = MAX_TAKE;
}
