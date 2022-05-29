import "dotenv/config";
import "reflect-metadata";
import "../src/prototypes";

import { ApolloServer } from "apollo-server-express";
import { GraphQLResponse } from "apollo-server-types";
import { initializeDataSource } from "../src/data-source";
import { generateSchema } from "../src/graphql/schema";
import { DatabaseContext } from "../src/context/database-context";
import { DataSource } from "typeorm";

type Spec = {
  name: string;
  query: { query: string; variables?: object };
  assert: (output: GraphQLResponse) => void;
};

const specs: Spec[] = [
  {
    name: "address balance and transactions count",
    query: {
      query: `query Query($address: String!, $atHeight: Int) {
          addresses(address: $address, atHeight: $atHeight) {
            transactionsCount
            balance { 
              nanoErgs 
              assets { tokenId }
            }
          }
        }`,
      variables: {
        address: "9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ",
        atHeight: 759893
      }
    },
    assert: (output) => {
      expect(output.errors).toBeUndefined();
      expect(output.data).toBeDefined();
      expect(output.data?.addresses.transactionsCount).toEqual(167);
      expect(output.data?.addresses.balance.nanoErgs).toEqual(1723811075n);
      expect(output.data?.addresses.balance.assets).toHaveLength(18);
    }
  }
];

describe("integration tests", () => {
  let server!: ApolloServer;
  let dataSource!: DataSource;

  beforeAll(async () => {
    const [data, schema] = await Promise.all([initializeDataSource(), generateSchema()]);
    dataSource = data;
    server = new ApolloServer({
      schema,
      context: { repository: new DatabaseContext(dataSource) }
    });
  });

  afterAll(() => {
    server.stop();
    dataSource.destroy();
  });

  for (const spec of specs) {
    it(spec.name, async () => {
      const response = await server.executeOperation({ ...spec.query });
      spec.assert(response);
    });
  }
});
