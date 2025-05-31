import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from './user.model';

@Entity('pots')
export class PotModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => UserModel, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'float', nullable: true })
  temperature: number;

  @Column({ type: 'float', nullable: true })
  humidity: number;

  @Column({ name: 'soil_moisture', type: 'float', nullable: true })
  soilMoisture: number;

  @Column({ type: 'float', nullable: true })
  photoresistor: number;

  @Column({ name: 'water_sensor', type: 'float', nullable: true })
  waterSensor: number;

  @Column({ name: 'vitamin_sensor', type: 'float', nullable: true })
  vitaminSensor: number;

  @Column({ name: 'ph_value', type: 'float', nullable: true })
  PHValue: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
