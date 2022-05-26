import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { DataInputEntityBase } from "./base-types/data-input-entity-base";
import { UnconfirmedTransactionEntity } from "./unconfirmed-transaction-entity";

/*
  Schema
    box_id      VARCHAR(64) NOT NULL,
    tx_id       VARCHAR(64) NOT NULL REFERENCES node_u_transactions (id) ON DELETE CASCADE,
    index       INTEGER     NOT NULL,
    PRIMARY KEY (box_id, tx_id)
*/

@Entity({ name: "node_u_data_inputs" })
export class UnconfirmedDataInputEntity extends DataInputEntityBase {
  @ManyToOne(() => UnconfirmedTransactionEntity, (tx) => tx.dataInputs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tx_id" })
  transaction!: UnconfirmedTransactionEntity;
}
