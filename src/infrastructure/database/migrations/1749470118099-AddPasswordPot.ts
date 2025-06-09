import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordPot1749470118099 implements MigrationInterface {
  name = 'AddPasswordPot1749470118099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pots" DROP CONSTRAINT "UQ_0447c4a6b5e91ba2ca52cba94ff"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pots" ADD CONSTRAINT "UQ_0447c4a6b5e91ba2ca52cba94ff" UNIQUE ("access_token")`,
    );
  }
}
