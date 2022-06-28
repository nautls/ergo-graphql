import { ConfigureLoader } from "@mando75/typeorm-graphql-loader";
import { Column, PrimaryColumn, BaseEntity } from "typeorm";

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
  [key in NonMandatoryRegisterKey]?: Register;
};

export abstract class BoxEntityBase extends BaseEntity {
  @PrimaryColumn({ name: "box_id" })
  boxId!: string;

  @Column({ name: "tx_id" })
  transactionId!: string;

  @Column({ name: "value", type: "bigint" })
  value!: bigint;

  @Column({ name: "creation_height" })
  creationHeight!: number;

  @Column({ name: "index" })
  @ConfigureLoader({ required: true })
  index!: number;

  @Column({ name: "ergo_tree" })
  ergoTree!: string;

  @Column({ name: "ergo_tree_template_hash" })
  ergoTreeTemplateHash!: string;

  @Column({ name: "address" })
  address!: string;

  @Column({ name: "additional_registers", type: "json" })
  additionalRegisters!: Registers;
}
