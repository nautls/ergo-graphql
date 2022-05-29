import "dotenv/config";
import "reflect-metadata";
import "../src/prototypes";

import { ApolloServer } from "apollo-server-express";
import { GraphQLResponse } from "apollo-server-types";
import { initializeDataSource } from "../src/data-source";
import { generateSchema } from "../src/graphql/schema";
import { DatabaseContext } from "../src/context/database-context";
import { DataSource } from "typeorm";
import { Address } from "../src/graphql/objects/address";

type Spec = {
  name: string;
  query: { query: string; variables?: object };
  assert: (output: GraphQLResponse) => void;
};

const specs: Spec[] = [
  {
    name: "address balance and transactions count",
    query: {
      query: `query Query($addresses: [String!]!, $atHeight: Int) {
          addresses(addresses: $addresses, atHeight: $atHeight) {
            transactionsCount
            balance { 
              nanoErgs 
              assets { tokenId }
            }
          }
        }`,
      variables: {
        addresses: [
          "9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ",
          "9gT3jR5PU9QKrgDuZJ6tKNpoCUwsGPhV6uVg6SL2hmdZGWicq9m",
          "9emAvMvreC9QEGHLV9pupwmteHuJt62qvkH6HnPjUESgQRotfaC",
          "9fh7mb1w4mFpD9aZDs8atNjnp27xN1HQnsgQk1cRiPaeCWMCfRJ"
        ],
        atHeight: 759893
      }
    },
    assert: (output) => {
      expect(output.errors).toBeUndefined();
      expect(output.data).toBeDefined();
      expect(output.data?.addresses).toHaveLength(4);
      if (!output.data) {
        return;
      }

      for (const address of output.data.addresses) {
        if (address.address === "9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ") {
          expect(address.transactionsCount).toEqual(167);
          expect(address.balance.nanoErgs).toEqual(1723811075n);
          expect(address.balance.assets).toHaveLength(18);
        } else if (address.address === "9gT3jR5PU9QKrgDuZJ6tKNpoCUwsGPhV6uVg6SL2hmdZGWicq9m") {
          expect(address.transactionsCount).toEqual(2);
          expect(address.balance.nanoErgs).toEqual(87680777n);
          expect(address.balance.assets).toHaveLength(3);
        } else if (address.address === "9emAvMvreC9QEGHLV9pupwmteHuJt62qvkH6HnPjUESgQRotfaC") {
          expect(address.transactionsCount).toEqual(1);
          expect(address.balance.nanoErgs).toEqual(1000000n);
          expect(address.balance.assets).toHaveLength(1);
        } else if (address.address === "9fh7mb1w4mFpD9aZDs8atNjnp27xN1HQnsgQk1cRiPaeCWMCfRJ") {
          expect(address.transactionsCount).toEqual(0);
          expect(address.balance.nanoErgs).toEqual(0n);
          expect(address.balance.assets).toHaveLength(0);
        }
      }
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
