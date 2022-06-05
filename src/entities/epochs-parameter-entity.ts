import { Entity, Column, PrimaryColumn, BaseEntity } from "typeorm";

/*
  Schema
    id                 INTEGER  PRIMARY KEY,
    height             INTEGER  NOT NULL,
    storage_fee_factor INTEGER  NOT NULL,
    min_value_per_byte INTEGER  NOT NULL,
    max_block_size     INTEGER  NOT NULL,
    max_block_cost     INTEGER  NOT NULL,
    block_version      SMALLINT NOT NULL,
    token_access_cost  INTEGER  NOT NULL,
    input_cost         INTEGER  NOT NULL,
    data_input_cost    INTEGER  NOT NULL,
    output_cost        INTEGER  NOT NULL
    PRIMARY KEY (id)
*/

@Entity({ name: "epochs_parameters" })
export class EpochsParameterEntity extends BaseEntity {
  @PrimaryColumn({ name: "id" })
  id!: number;

  @Column({ name: "height" })
  height!: number;

  @Column({ name: "storage_fee_factor" })
  storageFeeFactor!: number;

  @Column({ name: "min_value_per_byte" })
  minValuePerByte!: number;

  @Column({ name: "max_block_size" })
  maxBlockSize!: number;

  @Column({ name: "max_block_cost" })
  maxBlockCost!: number;

  @Column({ name: "block_version" })
  blockVersion!: number;

  @Column({ name: "token_access_cost" })
  tokenAccessCost!: number;

  @Column({ name: "input_cost" })
  inputCost!: number;

  @Column({ name: "data_input_cost" })
  dataInputCost!: number;

  @Column({ name: "output_cost" })
  outputCost!: number;
}
