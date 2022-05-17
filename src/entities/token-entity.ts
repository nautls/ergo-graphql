import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  BaseEntity
} from "typeorm";
import { BoxEntity } from "./box-entity";

/* 
  Schema
    TABLE tokens
    token_id        VARCHAR(64)   PRIMARY KEY,
    box_id          VARCHAR(64)   NOT NULL,
    emission_amount BIGINT        NOT NULL,
    name            VARCHAR,
    description     VARCHAR,
    type            VARCHAR,
    decimals        INTEGER
*/

@Entity({ name: "tokens" })
export class TokenEntity extends BaseEntity {
  @PrimaryColumn({ name: "token_id" })
  tokenId!: string;

  @Column({ name: "box_id" })
  boxId!: string;

  @OneToOne(() => BoxEntity)
  @JoinColumn({ name: "box_id" })
  box!: BoxEntity;

  @Column({ name: "emission_amount", type: "bigint" })
  emissionAmount!: bigint;

  @Column({ name: "name" })
  name?: string;

  @Column({ name: "description" })
  description?: string;

  @Column({ name: "type" })
  type?: string;

  @Column({ name: "decimals" })
  decimals?: number;
}
