import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { BoxEntity } from "./box-entity";

/*
  Schema
    box_registers
    id               VARCHAR(2)    NOT NULL,
    box_id           VARCHAR(64)   NOT NULL,
    value_type       VARCHAR(128)  NOT NULL,
    serialized_value VARCHAR       NOT NULL,
    rendered_value   VARCHAR       NOT NULL,
    PRIMARY KEY (id, box_id)
*/

@Entity({ name: "box_registers" })
export class BoxRegisterEntity {
  @PrimaryColumn({ name: "id" })
  registerId!: string;

  @PrimaryColumn({ name: "box_id" })
  boxId!: string;

  @Column({ name: "value_type" })
  valueType!: string;

  @Column({ name: "serialized_value" })
  serializedValue!: string;

  @Column({ name: "rendered_value" })
  rendered_value!: string;

  @ManyToOne(() => BoxEntity, (box) => box.assets)
  @JoinColumn({ name: "box_id" })
  box!: BoxEntity;
}
