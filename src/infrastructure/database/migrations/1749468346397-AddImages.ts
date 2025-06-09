import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImages1749468346397 implements MigrationInterface {
    name = 'AddImages1749468346397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_profiles_gender_enum" AS ENUM('male', 'female', 'other', 'unknown')`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "gender" "public"."user_profiles_gender_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "avatar_base_64" text`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "image_base_64" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "image_base_64"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "avatar_base_64"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."user_profiles_gender_enum"`);
    }

}
