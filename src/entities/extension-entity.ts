import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { HeaderEntity } from "./header-entity";

/*
  Schema
    header_id VARCHAR(64) PRIMARY KEY REFERENCES node_headers (id),
    digest    VARCHAR(64) NOT NULL,
    fields    JSON        NOT NULL,
    PRIMARY KEY (header_id)
*/

@Entity({ name: "node_extensions" })
export class ExtensionEntity {
    @PrimaryColumn({ name: "header_id" })
    headerId!: string;
    
    @Column({ name: "digest" })
    digest!: string;
    
    @Column({ name: "fields", type: "json" })
    fields!: object;
    
    @ManyToOne(() => HeaderEntity, (header) => header.extensions)
    @JoinColumn({ name: "header_id" })
    header!: HeaderEntity;
}
