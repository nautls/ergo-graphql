import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Box } from "./box";

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
export class Token {
  @PrimaryColumn({ name: "token_id" })
  tokenId!: string;

  @Column({ name: "box_id" })
  boxId!: string;

  @OneToOne(() => Box)
  @JoinColumn({ name: "box_id" })
  box!: Box;

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
