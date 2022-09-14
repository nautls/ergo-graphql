import { ConfigureLoader } from "@mando75/typeorm-graphql-loader";
import { BaseEntity, Column, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { TokenEntity } from "../token-entity";

export abstract class AssetEntityBase extends BaseEntity {
  @PrimaryColumn({ name: "token_id", unique: false })
  tokenId!: string;

  @Column({ name: "box_id", primary: true })
  boxId!: string;

  @Column({ name: "index", primary: true })
  @ConfigureLoader({ required: true })
  index!: number;

  @Column({ name: "value", type: "bigint" })
  amount!: bigint;

  @OneToOne(() => TokenEntity)
  @JoinColumn({ name: "token_id" })
  token!: TokenEntity;
}
