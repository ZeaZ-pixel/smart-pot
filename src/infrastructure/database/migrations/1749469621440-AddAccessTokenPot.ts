import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccessTokenPot1749469621440 implements MigrationInterface {
  name = 'AddAccessTokenPot1749469621440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pots" DROP CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pots" ADD "access_token" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pots" ADD CONSTRAINT "UQ_0447c4a6b5e91ba2ca52cba94ff" UNIQUE ("access_token")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pots" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pots" ADD CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pots" DROP CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pots" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pots" DROP CONSTRAINT "UQ_0447c4a6b5e91ba2ca52cba94ff"`,
    );
    await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "access_token"`);
    await queryRunner.query(
      `ALTER TABLE "pots" ADD CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
