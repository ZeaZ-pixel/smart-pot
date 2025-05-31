import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUserIdToPot1748686931773 implements MigrationInterface {
    name = 'InitUserIdToPot1748686931773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pots" DROP CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8"`);
        await queryRunner.query(`ALTER TABLE "pots" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pots" ADD CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pots" DROP CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8"`);
        await queryRunner.query(`ALTER TABLE "pots" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pots" ADD CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
