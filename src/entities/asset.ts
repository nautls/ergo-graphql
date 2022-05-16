import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { Box } from "./box";
import { Token } from "./token";

/* 
  Schema
    TABLE node_assets
    token_id  VARCHAR(64) NOT NULL,
    box_id    VARCHAR(64) NOT NULL,
    header_id VARCHAR(64) NOT NULL,
    index     INTEGER     NOT NULL,
    value     BIGINT      NOT NULL,
    PRIMARY KEY (index, token_id, box_id, header_id)
*/

@Entity({ name: "node_assets" })
export class Asset {
  @PrimaryColumn({ name: "token_id" })
  tokenId!: string;

  @Column({ name: "box_id" })
  boxId!: string;

  @Column({ name: "header_id" })
  blockId!: string;

  @Column({ name: "index" })
  index!: number;

  @Column({ name: "value", type: "bigint" })
  value!: bigint;

  @OneToOne(() => Token)
  @JoinColumn({ name: "token_id" })
  token!: Token;

  @ManyToOne(() => Box, (box) => box.assets)
  @JoinColumn({ name: "box_id" })
  box!: Box;
}
