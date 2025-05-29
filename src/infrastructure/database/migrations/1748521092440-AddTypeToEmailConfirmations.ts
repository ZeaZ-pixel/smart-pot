import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeToEmailConfirmations1748521092440 implements MigrationInterface {
    name = 'AddTypeToEmailConfirmations1748521092440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."email_confirmations_type_enum" AS ENUM('verify_email', 'reset_password', '2fa')`);
        await queryRunner.query(`ALTER TABLE "email_confirmations" ADD "type" "public"."email_confirmations_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_confirmations" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."email_confirmations_type_enum"`);
    }

}
