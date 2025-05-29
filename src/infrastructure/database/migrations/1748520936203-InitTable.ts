import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTable1748520936203 implements MigrationInterface {
    name = 'InitTable1748520936203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_confirmations" ("id" SERIAL NOT NULL, "code" character(6) NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "attempt_count" integer NOT NULL DEFAULT '0', "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_178b5599cd7e3ec9cfdfb144b50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_88e0e228016bd9bbf3878de1b4" ON "email_confirmations" ("code") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "refresh_token" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_confirmations" ADD CONSTRAINT "FK_930e1d7c0171d23e5535b1e3873" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_confirmations" DROP CONSTRAINT "FK_930e1d7c0171d23e5535b1e3873"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88e0e228016bd9bbf3878de1b4"`);
        await queryRunner.query(`DROP TABLE "email_confirmations"`);
    }

}
