import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPotCommandModel1749471232103 implements MigrationInterface {
  name = 'AddPotCommandModel1749471232103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pot_commands" ("id" SERIAL NOT NULL, "pot_id" integer NOT NULL, "type" character varying NOT NULL, "payload" json, "is_used" boolean NOT NULL DEFAULT false, "executedAt" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f7453700c685dabb867903a92e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pots" ADD "password" character varying(255) DEFAULT 'plant123'`,
    );
    await queryRunner.query(
      `ALTER TABLE "pots" ADD CONSTRAINT "UQ_0447c4a6b5e91ba2ca52cba94ff" UNIQUE ("access_token")`,
    );
    await queryRunner.query(
      `ALTER TABLE "pot_commands" ADD CONSTRAINT "FK_5016b76b2375ff678b2c7ee05d9" FOREIGN KEY ("pot_id") REFERENCES "pots"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pot_commands" DROP CONSTRAINT "FK_5016b76b2375ff678b2c7ee05d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pots" DROP CONSTRAINT "UQ_0447c4a6b5e91ba2ca52cba94ff"`,
    );
    await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "password"`);
    await queryRunner.query(`DROP TABLE "pot_commands"`);
  }
}
