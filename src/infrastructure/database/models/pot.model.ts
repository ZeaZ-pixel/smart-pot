import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pots')
export class PotModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'float', nullable: true })
  temperature: number;

  @Column({ type: 'float', nullable: true })
  humidity: number;

  @Column({ type: 'float', nullable: true })
  soilMoisture: number;

  @Column({ type: 'float', nullable: true })
  photoresistor: number;

  @Column({ type: 'float', nullable: true })
  waterSensor: number;

  @Column({ type: 'float', nullable: true })
  vitaminSensor: number;

  @Column({ type: 'float', nullable: true })
  PHValue: number;

  @Column()
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
