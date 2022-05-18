import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  BaseEntity,
  OneToOne,
  JoinColumn
} from "typeorm";
import { AssetEntity } from "./asset-entity";
import { InputEntity } from "./input-entity";

/* 
  Schema 
    TABLE node_outputs
    box_id                  VARCHAR(64) NOT NULL,
    tx_id                   VARCHAR(64) NOT NULL,
    header_id               VARCHAR(64) NOT NULL,
    value                   BIGINT      NOT NULL,
    creation_height         INTEGER     NOT NULL,
    settlement_height       INTEGER     NOT NULL,
    index                   INTEGER     NOT NULL,
    global_index            BIGINT      NOT NULL,
    ergo_tree               VARCHAR     NOT NULL,
    ergo_tree_template_hash VARCHAR(64) NOT NULL,
    address                 VARCHAR     NOT NULL,
    additional_registers    JSON        NOT NULL,
    timestamp               BIGINT      NOT NULL,
    main_chain              BOOLEAN     NOT NULL,
    PRIMARY KEY (box_id, header_id)
*/

enum NonMandatoryRegisterKey {
  R4 = "R4",
  R5 = "R5",
  R6 = "R6",
  R7 = "R7",
  R8 = "R8",
  R9 = "R9"
}

type Register = {
  serializedValue: string;
  sigmaType?: string;
  renderedValue?: string;
};

export type Registers = {
  [key in NonMandatoryRegisterKey]: Register;
};

@Entity({ name: "node_outputs" })
export class BoxEntity extends BaseEntity {
  @PrimaryColumn({ name: "box_id" })
  boxId!: string;

  @Column({ name: "tx_id" })
  transactionId!: string;

  @Column({ name: "header_id" })
  blockId!: string;

  @Column({ name: "value", type: "bigint" })
  value!: bigint;

  @Column({ name: "creation_height" })
  creationHeight!: number;

  @Column({ name: "settlement_height" })
  settlementHeight!: number;

  @Column({ name: "index" })
  index!: number;

  @Column({ name: "global_index" })
  globalIndex!: number;

  @Column({ name: "ergo_tree" })
  ergoTree!: string;

  @Column({ name: "address" })
  address!: string;

  @Column({ name: "additional_registers", type: "json" })
  additionalRegisters!: Registers;

  @Column({ name: "main_chain", type: "boolean" })
  mainChain!: boolean;

  @OneToOne(() => InputEntity)
  @JoinColumn({ name: "box_id" })
  box!: InputEntity;

  @OneToMany(() => AssetEntity, (asset) => asset.box)
  assets!: AssetEntity[];
}
