import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
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
  user: UserModel;

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
