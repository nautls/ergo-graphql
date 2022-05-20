import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { HeaderEntity } from "./header-entity";

/*
  Schema
    header_id   VARCHAR(64) PRIMARY KEY REFERENCES node_headers (id),
    proof_bytes VARCHAR NOT NULL,
    digest      VARCHAR NOT NULL
    PRIMARY KEY (header_id)
*/

@Entity({ name: "node_ad_proofs" })
export class AdProofEntity {
  @PrimaryColumn({ name: "header_id" })
  headerId!: string;

  @Column({ name: "proof_bytes" })
  proofBytes!: string;

  @Column({ name: "digest" })
  digest!: string;

  @ManyToOne(() => HeaderEntity, (header) => header.adProofs)
  @JoinColumn({ name: "header_id" })
  header!: HeaderEntity;
}
