import { Column, Entity, OneToMany } from "typeorm";
import { BoxEntity } from "./box-entity";
import { DataInputEntity } from "./data-input-entity";
import { InputEntity } from "./input-entity";
import { TransactionEntityBase } from "./transaction-entity-base";

/*
  Schema
    TABLE node_transactions
    id               VARCHAR(64) NOT NULL,
    header_id        VARCHAR(64) REFERENCES node_headers (id),
    inclusion_height INTEGER     NOT NULL,
    coinbase         BOOLEAN     NOT NULL,
    timestamp        BIGINT      NOT NULL,
    size             INTEGER     NOT NULL,
    index            INTEGER     NOT NULL,
    global_index     BIGINT      NOT NULL,
    main_chain       BOOLEAN     NOT NULL,
    PRIMARY KEY (id, header_id)
*/

@Entity({ name: "node_transactions" })
export class TransactionEntity extends TransactionEntityBase {
  @Column({ name: "header_id" })
  headerId!: string;

  @Column({ name: "inclusion_height" })
  inclusionHeight!: number;

  @Column({ name: "coinbase" })
  coinbase!: boolean;

  @Column({ name: "timestamp", type: "bigint" })
  timestamp!: bigint;

  @Column({ name: "index" })
  index!: number;

  @Column({ name: "global_index", type: "bigint" })
  globalIndex!: number;

  @Column({ name: "main_chain" })
  mainChain!: boolean;

  @OneToMany(() => InputEntity, (input) => input.transaction)
  inputs!: InputEntity[];

  @OneToMany(() => DataInputEntity, (input) => input.transaction)
  dataInputs!: DataInputEntity[];

  @OneToMany(() => BoxEntity, (output) => output.transaction)
  outputs!: BoxEntity[];
}
