import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.model';
import { GenderEnum } from 'src/domain/types/gender.enum';

@Entity('user_profiles')
export class UserProfileModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
  })
  gender: GenderEnum;

  @Column({ name: 'avatar_base_64', type: 'text', nullable: true })
  avatarBase64: string;

  @Column({ type: 'date', name: 'date_of_birth', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @OneToOne(() => UserModel, (user) => user.profile)
  user: UserModel;
}
