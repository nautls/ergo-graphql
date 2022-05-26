import { BaseEntity, Column, PrimaryColumn } from "typeorm";

export abstract class TransactionEntityBase extends BaseEntity {
  @PrimaryColumn({ name: "id" })
  transactionId!: string;

  @Column({ name: "size" })
  size!: number;
}
