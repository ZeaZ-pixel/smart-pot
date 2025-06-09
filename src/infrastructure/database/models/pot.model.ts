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
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'float', nullable: true })
  temperature: number;

  @Column({ type: 'float', nullable: true })
  humidity: number;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    default: 'plant123',
    nullable: true,
  })
  password: string;

  @Column({ name: 'image_base_64', type: 'text', nullable: true })
  imageBase64: string;

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

  @Column({ type: 'timestamp', nullable: true })
  timestamp: Date;

  @Column({ name: 'access_token', type: 'varchar', length: 255, unique: true })
  accessToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
