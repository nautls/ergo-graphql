import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { HeaderEntity } from "./header-entity";

/*
  Schema
    header_id   VARCHAR(64) PRIMARY KEY REFERENCES node_headers (id),
    proof_bytes VARCHAR NOT NULL,
    digest      VARCHAR NOT NULL
*/

@Entity({ name: "node_add_proofs" })
export class AddProofEntity {
  @PrimaryColumn({ name: "header_id" })
  headerId!: string;

  @Column({ name: "proof_bytes" })
  proofBytes!: string;

  @Column({ name: "digest" })
  digest!: string;

  @ManyToOne(() => HeaderEntity, (header) => header.addProofs)
  @JoinColumn({ name: "header_id" })
  header!: HeaderEntity;
}
