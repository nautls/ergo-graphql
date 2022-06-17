import { ConfigureLoader } from "@mando75/typeorm-graphql-loader";
import { BaseEntity, Column, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { TokenEntity } from "../token-entity";

export abstract class AssetEntityBase extends BaseEntity {
  @PrimaryColumn({ name: "token_id" })
  tokenId!: string;

  @Column({ name: "box_id" })
  boxId!: string;

  @Column({ name: "index" })
  @ConfigureLoader({ required: true })
  index!: number;

  @Column({ name: "value", type: "bigint" })
  amount!: bigint;

  @OneToOne(() => TokenEntity)
  @JoinColumn({ name: "token_id" })
  token!: TokenEntity;
}
