import { MigrationInterface, QueryRunner } from "typeorm";

export class InitPotModel1748371783584 implements MigrationInterface {
    name = 'InitPotModel1748371783584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pots" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "temperature" double precision, "humidity" double precision, "soilMoisture" double precision, "photoresistor" double precision, "waterSensor" double precision, "vitaminSensor" double precision, "PHValue" double precision, "timestamp" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d2c53514d485ec9beb157d17043" UNIQUE ("name"), CONSTRAINT "PK_ad91f0cc4de8269de9a1038b637" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pots"`);
    }

}
