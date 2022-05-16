import "dotenv/config";
import "./prototypes";

import { ApolloServer } from "apollo-server";
import { appDataSource } from "./data-source";
import { schema } from "./schema";

export const server = new ApolloServer({ schema, csrfPrevention: true });

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  appDataSource
    .initialize()
    .then(() => {
      console.log("✅ Data source is connected");
    })
    .catch((error) => console.log(error));
});
