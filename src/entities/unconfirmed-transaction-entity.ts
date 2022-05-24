import { Column, Entity } from "typeorm";
import { TransactionEntityBase } from "./transaction-entity-base";

/*
  Schema
    TABLE node_u_transactions
    id                 VARCHAR(64) PRIMARY KEY,
    creation_timestamp BIGINT  NOT NULL,
    size               INTEGER NOT NULL
*/

@Entity({ name: "node_transactions" })
export class UnconfirmedTransactionEntity extends TransactionEntityBase {
  @Column({ name: "creation_timestamp", type: "bigint" })
  timestamp!: bigint;
}
