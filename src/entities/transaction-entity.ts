import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

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
export class TransactionEntity extends BaseEntity {
  @PrimaryColumn({ name: "id" })
  transactionId!: string;

  @Column({ name: "header_id" })
  blockId!: string;

  @Column({ name: "inclusion_height" })
  inclusionHeight!: number;

  @Column({ name: "coinbase" })
  coinbase!: boolean;

  @Column({ name: "timestamp", type: "bigint" })
  timestamp!: Date;

  @Column({ name: "size" })
  size!: number;

  @Column({ name: "index" })
  index!: number;

  @Column({ name: "global_index", type: "bigint" })
  globalIndex!: number;

  @Column({ name: "main_chain" })
  mainChain!: boolean;
}
