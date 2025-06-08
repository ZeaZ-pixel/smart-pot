import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTable1749386278077 implements MigrationInterface {
    name = 'InitTable1749386278077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" SERIAL NOT NULL, "first_name" character varying, "last_name" character varying, "date_of_birth" date, "phone_number" character varying(20), "avatar_url" character varying, CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "refresh_token" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "profileId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "REL_b1bda35cdb9a2c1b777f5541d8" UNIQUE ("profileId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pots" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "user_id" integer NOT NULL, "temperature" double precision, "humidity" double precision, "soil_moisture" double precision, "photoresistor" double precision, "water_sensor" double precision, "vitamin_sensor" double precision, "ph_value" double precision, "timestamp" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d2c53514d485ec9beb157d17043" UNIQUE ("name"), CONSTRAINT "PK_ad91f0cc4de8269de9a1038b637" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_confirmations" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "code" character(6) NOT NULL, "type" "public"."email_confirmations_type_enum" NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "attempt_count" integer NOT NULL DEFAULT '0', "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_178b5599cd7e3ec9cfdfb144b50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_88e0e228016bd9bbf3878de1b4" ON "email_confirmations" ("code") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "user_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pots" ADD CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_confirmations" ADD CONSTRAINT "FK_97c4781eabb13c92ea53f21d8f9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_confirmations" DROP CONSTRAINT "FK_97c4781eabb13c92ea53f21d8f9"`);
        await queryRunner.query(`ALTER TABLE "pots" DROP CONSTRAINT "FK_550dddf770dbd5afa3d5ef0ebd8"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88e0e228016bd9bbf3878de1b4"`);
        await queryRunner.query(`DROP TABLE "email_confirmations"`);
        await queryRunner.query(`DROP TABLE "pots"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
    }

}
