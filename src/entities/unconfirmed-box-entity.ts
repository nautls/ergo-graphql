import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { BoxEntityBase } from "./box-entity-base";
import { UnconfirmedTransactionEntity } from "./unconfirmed-transaction-entity";
import { UnconfirmedAssetEntity } from "./unconfirmed-asset-entity";

/*
  Schema
    box_id                  VARCHAR(64) PRIMARY KEY,
    tx_id                   VARCHAR(64) NOT NULL REFERENCES node_u_transactions (id) ON DELETE CASCADE,
    value                   BIGINT      NOT NULL,
    creation_height         INTEGER     NOT NULL,
    index                   INTEGER     NOT NULL,
    ergo_tree               VARCHAR     NOT NULL,
    ergo_tree_template_hash VARCHAR(64) NOT NULL,
    address                 VARCHAR,
    additional_registers    JSON        NOT NULL
*/

@Entity({ name: "node_u_outputs" })
export class UnconfirmedBoxEntity extends BoxEntityBase {
  @ManyToOne(() => UnconfirmedTransactionEntity, (tx) => tx.outputs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "tx_id" })
  transaction!: UnconfirmedTransactionEntity;

  @OneToMany(() => UnconfirmedAssetEntity, (asset) => asset.box)
  assets!: UnconfirmedAssetEntity[];
}
