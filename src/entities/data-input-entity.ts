import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn
} from "typeorm";
import { BoxEntity } from "./box-entity";
import { TransactionEntity } from "./transaction-entity";

/*
  Schema
    TABLE node_data_inputs
    box_id      VARCHAR(64) NOT NULL,
    tx_id       VARCHAR(64) NOT NULL,
    header_id   VARCHAR(64) NOT NULL,
    index       INTEGER     NOT NULL,
    main_chain  BOOLEAN     NOT NULL,
*/

@Entity({ name: "node_data_inputs" })
export class DataInputEntity extends BaseEntity {
  @PrimaryColumn({ name: "box_id" })
  boxId!: string;

  @Column({ name: "tx_id" })
  transactionId!: string;

  @Column({ name: "header_id" })
  blockId!: string;

  @Column({ name: "index" })
  index!: number;

  @Column({ name: "main_chain" })
  mainChain!: boolean;

  @OneToOne(() => BoxEntity)
  @JoinColumn({ name: "box_id" })
  box!: BoxEntity;

  @ManyToOne(() => TransactionEntity, (tx) => tx.dataInputs)
  @JoinColumn({ name: "tx_id" })
  transaction!: TransactionEntity;
}
