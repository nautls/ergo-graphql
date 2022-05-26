import { Column, Entity, OneToMany } from "typeorm";
import { TransactionEntityBase } from "./base-types/transaction-entity-base";
import { UnconfirmedBoxEntity } from "./unconfirmed-box-entity";
import { UnconfirmedDataInputEntity } from "./unconfirmed-data-input-entity";
import { UnconfirmedInputEntity } from "./unconfirmed-input-entity";

/*
  Schema
    TABLE node_u_transactions
    id                 VARCHAR(64) PRIMARY KEY,
    creation_timestamp BIGINT  NOT NULL,
    size               INTEGER NOT NULL
*/

@Entity({ name: "node_u_transactions" })
export class UnconfirmedTransactionEntity extends TransactionEntityBase {
  @Column({ name: "creation_timestamp", type: "bigint" })
  timestamp!: bigint;

  @OneToMany(() => UnconfirmedInputEntity, (input) => input.transaction)
  inputs!: UnconfirmedInputEntity[];

  @OneToMany(() => UnconfirmedBoxEntity, (box) => box.transaction)
  outputs!: UnconfirmedBoxEntity[];

  @OneToMany(() => UnconfirmedDataInputEntity, (input) => input.transaction)
  dataInputs!: UnconfirmedDataInputEntity[];
}
