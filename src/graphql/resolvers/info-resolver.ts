import { Resolver, Query } from "type-graphql";
import { Info } from "../objects";

@Resolver()
export class InfoResolver {
  @Query(() => Info)
  async Info() {
    return { version: process.env.npm_package_version };
  }
}
