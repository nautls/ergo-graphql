import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TransactionEntity } from "./transaction-entity";
import { InputEntityBase } from "./base-types/input-entity-base";

/*
  Schema
    TABLE node_inputs
    box_id      VARCHAR(64) NOT NULL,
    tx_id       VARCHAR(64) NOT NULL,
    header_id   VARCHAR(64) NOT NULL,
    proof_bytes VARCHAR,
    extension   JSON        NOT NULL,
    index       INTEGER     NOT NULL,
    main_chain  BOOLEAN     NOT NULL,
    PRIMARY KEY (box_id, header_id)
*/

@Entity({ name: "node_inputs" })
export class InputEntity extends InputEntityBase {
  @Column({ name: "header_id" })
  headerId!: string;

  @Column({ name: "main_chain" })
  mainChain!: boolean;

  @ManyToOne(() => TransactionEntity, (tx) => tx.inputs)
  @JoinColumn({ name: "tx_id" })
  transaction!: TransactionEntity;
}
