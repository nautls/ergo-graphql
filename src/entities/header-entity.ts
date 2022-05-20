import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { ExtensionEntity } from "./extension-entity";
import { AdProofEntity } from "./ad-proof-entity";
import { BlockInfoEntity } from "./block-info-entity";

/*
  Schema
    TABLE node_headers
    id                VARCHAR(64) PRIMARY KEY,
    parent_id         VARCHAR(64) NOT NULL,
    version           SMALLINT    NOT NULL,
    height            INTEGER     NOT NULL,
    n_bits            BIGINT      NOT NULL,
    difficulty        NUMERIC     NOT NULL,
    timestamp         BIGINT      NOT NULL,
    state_root        VARCHAR(66) NOT NULL,
    ad_proofs_root    VARCHAR(64) NOT NULL,
    transactions_root VARCHAR(64) NOT NULL,
    extension_hash    VARCHAR(64) NOT NULL,
    miner_pk          VARCHAR     NOT NULL,
    w                 VARCHAR     NOT NULL,
    n                 VARCHAR     NOT NULL,
    d                 VARCHAR     NOT NULL,
    votes             VARCHAR     NOT NULL,
    main_chain        BOOLEAN     NOT NULL
    PRIMARY KEY (id)
*/

@Entity({ name: "node_headers" })
export class HeaderEntity {
  @PrimaryColumn({ name: "id" })
  id!: string;

  @Column({ name: "parent_id" })
  parentId!: string;

  @Column({ name: "version" })
  version!: number;

  @Column({ name: "height" })
  height!: number;

  @Column({ name: "n_bits", type: "bigint" })
  nBits!: bigint;

  @Column({ name: "difficulty" })
  difficulty!: number;

  @Column({ name: "timestamp", type: "bigint" })
  timestamp!: bigint;

  @Column({ name: "state_root" })
  stateRoot!: string;

  @Column({ name: "ad_proofs_root" })
  adProofsRoot!: string;

  @Column({ name: "transactions_root" })
  transactionsRoot!: string;

  @Column({ name: "extension_hash" })
  extensionHash!: string;

  @Column({ name: "miner_pk" })
  minerPk!: string;

  @Column({ name: "w" })
  w!: string;

  @Column({ name: "n" })
  n!: string;

  @Column({ name: "d" })
  d!: string;

  @Column({ name: "votes" })
  votes!: string;

  @Column({ name: "main_chain" })
  mainChain!: boolean;

  @OneToMany(() => ExtensionEntity, (extension) => extension.header)
  extensions!: ExtensionEntity[];

  @OneToMany(() => AdProofEntity, (adProof) => adProof.header)
  adProofs!: AdProofEntity[];

  @OneToMany(() => BlockInfoEntity, (blockInfo) => blockInfo.header)
  blockInfo!: BlockInfoEntity[];
}
