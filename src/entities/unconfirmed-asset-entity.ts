import {
  Entity,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { UnconfirmedBoxEntity } from "./unconfirmed-box-entity";
import { AssetEntityBase } from "./asset-entity-base";

/*
  Schema
    token_id VARCHAR(64) NOT NULL,
    box_id   VARCHAR(64) NOT NULL REFERENCES node_u_outputs (box_id) ON DELETE CASCADE,
    index    INTEGER     NOT NULL,
    value    BIGINT      NOT NULL,
    PRIMARY KEY (index, token_id, box_id)
*/

@Entity({ name: "node_u_assets" })
export class UnconfirmedAssetEntity extends AssetEntityBase {
  @ManyToOne(() => UnconfirmedBoxEntity, (box) => box.assets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "box_id" })
  box!: UnconfirmedBoxEntity;
}
