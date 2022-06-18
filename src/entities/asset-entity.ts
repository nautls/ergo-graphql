import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { BoxEntity } from "./box-entity";
import { AssetEntityBase } from "./base-types/asset-entity-base";

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
export class AssetEntity extends AssetEntityBase {
  @Column({ name: "header_id" })
  headerId!: string;

  @ManyToOne(() => BoxEntity, (box) => box.assets)
  @JoinColumn({ name: "box_id" })
  box!: BoxEntity;
}
