import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNamePotModel1748684365347 implements MigrationInterface {
    name = 'ChangeNamePotModel1748684365347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "soilMoisture"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "waterSensor"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "vitaminSensor"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "PHValue"`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "soil_moisture" double precision`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "water_sensor" double precision`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "vitamin_sensor" double precision`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "ph_value" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "ph_value"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "vitamin_sensor"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "water_sensor"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP COLUMN "soil_moisture"`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "PHValue" double precision`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "vitaminSensor" double precision`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "waterSensor" double precision`);
        await queryRunner.query(`ALTER TABLE "pots" ADD "soilMoisture" double precision`);
    }

}
