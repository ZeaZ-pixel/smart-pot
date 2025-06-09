import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PotModel } from './pot.model';

@Entity('pot_commands')
export class PotCommandModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PotModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pot_id' })
  pot: PotModel;

  @Column({ name: 'pot_id' })
  potId: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'json', nullable: true })
  payload: any;

  @Column({ name: 'is_used', type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  executedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
