import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.model';
import { EmailCodeType } from 'src/domain/types/email-code-type.enum';

@Entity('email_confirmations')
export class EmailConfirmationModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel, (user) => user.emailConfirmations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'char', length: 6 })
  @Index()
  code: string;

  @Column({
    type: 'enum',
    enum: EmailCodeType,
  })
  type: EmailCodeType;

  @Column({ name: 'is_used', type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ name: 'attempt_count', type: 'int', default: 0 })
  attemptCount: number;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
