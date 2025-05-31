import { MigrationInterface, QueryRunner } from "typeorm";

export class NormaiizeNamePotModels1748684458942 implements MigrationInterface {
    name = 'NormaiizeNamePotModels1748684458942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
