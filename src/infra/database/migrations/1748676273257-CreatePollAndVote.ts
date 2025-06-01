import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePollAndVote1748676273257 implements MigrationInterface {
    name = 'CreatePollAndVote1748676273257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "votes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying(255) NOT NULL, "pollId" uuid NOT NULL, "optionIndex" integer, "isSkip" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ba0ca6ae73af0c4f4b123a2838" ON "votes" ("userId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_2e40638d2d3b898da1af363837" ON "votes" ("pollId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e59c5c77879a5ba43d8ee7cf15" ON "votes" ("userId", "pollId") `);
        await queryRunner.query(`CREATE TABLE "polls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "options" json NOT NULL, "tags" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b9bbb8fc7b142553c518ddffbb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_2e40638d2d3b898da1af363837c" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_2e40638d2d3b898da1af363837c"`);
        await queryRunner.query(`DROP TABLE "polls"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e59c5c77879a5ba43d8ee7cf15"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2e40638d2d3b898da1af363837"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba0ca6ae73af0c4f4b123a2838"`);
        await queryRunner.query(`DROP TABLE "votes"`);
    }

}
