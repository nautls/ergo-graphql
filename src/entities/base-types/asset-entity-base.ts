import { BaseEntity, Column, PrimaryColumn } from "typeorm";

export abstract class AssetEntityBase extends BaseEntity {
  @PrimaryColumn({ name: "token_id" })
  tokenId!: string;

  @Column({ name: "box_id" })
  boxId!: string;

  @Column({ name: "index" })
  index!: number;

  @Column({ name: "value", type: "bigint" })
  value!: bigint;
}
