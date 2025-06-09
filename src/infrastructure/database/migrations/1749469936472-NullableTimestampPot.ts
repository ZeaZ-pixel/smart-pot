import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableTimestampPot1749469936472 implements MigrationInterface {
  name = 'NullableTimestampPot1749469936472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pots" ALTER COLUMN "timestamp" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pots" ALTER COLUMN "timestamp" SET NOT NULL`,
    );
  }
}
