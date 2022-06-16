import { ConfigureLoader } from "@mando75/typeorm-graphql-loader";
import { BaseEntity, Column, PrimaryColumn } from "typeorm";

export abstract class InputEntityBase extends BaseEntity {
  @PrimaryColumn({ name: "box_id" })
  boxId!: string;

  @Column({ name: "tx_id" })
  transactionId!: string;

  @Column({ name: "index" })
  @ConfigureLoader({ required: true })
  index!: number;

  @Column({ name: "proof_bytes", nullable: true })
  proofBytes?: string;

  @Column({ name: "extension", type: "json" })
  extension!: object;
}
