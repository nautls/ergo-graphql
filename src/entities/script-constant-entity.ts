import { Entity, Column, PrimaryColumn } from "typeorm";

/*
  Schema
    index            INTEGER       NOT NULL,
    box_id           VARCHAR(64)   NOT NULL,
    value_type       VARCHAR(128)  NOT NULL,
    serialized_value VARCHAR(8192) NOT NULL,
    rendered_value   VARCHAR(8192) NOT NULL,
    PRIMARY KEY (index, box_id)
*/

@Entity({ name: "script_constants" })
export class ScriptConstantEntity {
  @PrimaryColumn({ name: "index" })
  index!: number;

  @Column({ name: "box_id" })
  boxId!: string;

  @Column({ name: "value_type" })
  valueType!: string;

  @Column({ name: "serialized_value" })
  serializedValue!: string;

  @Column({ name: "rendered_value" })
  renderedValue!: string;
}
