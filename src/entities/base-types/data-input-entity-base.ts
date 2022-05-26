import { BaseEntity, Column, PrimaryColumn } from "typeorm";

export abstract class DataInputEntityBase extends BaseEntity {
  @PrimaryColumn({ name: "box_id" })
  boxId!: string;

  @Column({ name: "tx_id" })
  transactionId!: string;

  @Column({ name: "index" })
  index!: number;
}
