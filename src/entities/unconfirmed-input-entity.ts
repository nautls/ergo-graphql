import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { UnconfirmedTransactionEntity } from "./unconfirmed-transaction-entity";
import { InputEntityBase } from "./base-types/input-entity-base";

/*
  Schema
    box_id      VARCHAR(64) NOT NULL,
    tx_id       VARCHAR(64) NOT NULL REFERENCES node_u_transactions (id) ON DELETE CASCADE,
    index       INTEGER     NOT NULL,
    proof_bytes VARCHAR,
    extension   JSON        NOT NULL,
    PRIMARY KEY (box_id, tx_id)
*/

@Entity({ name: "node_u_inputs" })
export class UnconfirmedInputEntity extends InputEntityBase {
  @ManyToOne(() => UnconfirmedTransactionEntity, (tx) => tx.inputs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tx_id" })
  transaction!: UnconfirmedTransactionEntity;
}
