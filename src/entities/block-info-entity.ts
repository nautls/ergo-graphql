import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { HeaderEntity } from "./header-entity";

/*
  Schema
    header_id              VARCHAR(64) PRIMARY KEY REFERENCES node_headers (id),
    timestamp              BIGINT  NOT NULL,
    height                 INTEGER NOT NULL,
    difficulty             BIGINT  NOT NULL,
    block_size             INTEGER NOT NULL,
    block_coins            BIGINT  NOT NULL,
    block_mining_time      BIGINT,
    txs_count              INTEGER NOT NULL,
    txs_size               INTEGER NOT NULL,
    miner_address          VARCHAR NOT NULL,
    miner_reward           BIGINT  NOT NULL,
    miner_revenue          BIGINT  NOT NULL,
    block_fee              BIGINT  NOT NULL,
    block_chain_total_size BIGINT  NOT NULL,
    total_txs_count        BIGINT  NOT NULL,
    total_coins_issued     BIGINT  NOT NULL,
    total_mining_time      BIGINT  NOT NULL,
    total_fees             BIGINT  NOT NULL,
    total_miners_reward    BIGINT  NOT NULL,
    total_coins_in_txs     BIGINT  NOT NULL,
    max_tx_gix             BIGINT  NOT NULL,
    max_box_gix            BIGINT  NOT NULL,
    main_chain             BOOLEAN NOT NULL
    PRIMARY KEY (header_id)
*/

@Entity({ name: "blocks_info" })
export class BlockInfoEntity {
  @PrimaryColumn({ name: "header_id" })
  headerId!: string;

  @Column({ name: "timestamp", type: "bigint" })
  timestamp!: bigint;

  @Column({ name: "height" })
  height!: number;

  @Column({ name: "difficulty", type: "bigint" })
  difficulty!: bigint;

  @Column({ name: "block_size" })
  blockSize!: number;

  @Column({ name: "block_coins", type: "bigint" })
  blockCoins!: bigint;

  @Column({ name: "block_mining_time", type: "bigint", nullable: true })
  blockMiningTime?: bigint;

  @Column({ name: "txs_count" })
  txsCount!: number;

  @Column({ name: "txs_size" })
  txsSize!: number;

  @Column({ name: "miner_address" })
  minerAddress!: string;

  @Column({ name: "miner_reward", type: "bigint" })
  minerReward!: bigint;

  @Column({ name: "miner_revenue", type: "bigint" })
  minerRevenue!: bigint;

  @Column({ name: "block_fee", type: "bigint" })
  blockFee!: bigint;

  @Column({ name: "block_chain_total_size", type: "bigint" })
  blockChainTotalSize!: bigint;

  @Column({ name: "total_txs_count", type: "bigint" })
  totalTxsCount!: bigint;

  @Column({ name: "total_coins_issued", type: "bigint" })
  totalCoinsIssued!: bigint;

  @Column({ name: "total_mining_time", type: "bigint" })
  totalMiningTime!: bigint;

  @Column({ name: "total_fees", type: "bigint" })
  totalFees!: bigint;

  @Column({ name: "total_miners_reward", type: "bigint" })
  totalMinersReward!: bigint;

  @Column({ name: "total_coins_in_txs", type: "bigint" })
  totalCoinsInTxs!: bigint;

  @Column({ name: "max_tx_gix", type: "bigint" })
  maxTxGix!: bigint;

  @Column({ name: "max_box_gix", type: "bigint" })
  maxBoxGix!: bigint;

  @Column({ name: "main_chain" })
  mainChain!: boolean;

  @OneToOne(() => HeaderEntity)
  @JoinColumn({ name: "header_id" })
  header!: HeaderEntity;
}
