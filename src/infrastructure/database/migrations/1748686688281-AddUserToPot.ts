import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserToPot1748686688281 implements MigrationInterface {
    name = 'AddUserToPot1748686688281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pots" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "pots" ADD CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pots" DROP CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "user_id"`);
    }

}
