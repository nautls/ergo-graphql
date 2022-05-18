import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { BoxEntity } from "./box-entity";

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
export class InputEntity extends BaseEntity {
  @PrimaryColumn({ name: "box_id" })
  boxId!: string;

  @Column({ name: "tx_id" })
  transactionId!: string;

  @Column({ name: "header_id" })
  blockId!: string;

  @Column({ name: "proof_bytes", nullable: true })
  proofBytes?: string;

  @Column({ name: "extension", type: "json" })
  extension!: object;

  @Column({ name: "index" })
  index!: number;

  @Column({ name: "main_chain" })
  mainChain!: boolean;

  @OneToOne(() => BoxEntity)
  @JoinColumn({ name: "box_id" })
  box!: BoxEntity;
}
