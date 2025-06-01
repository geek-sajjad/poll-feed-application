import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePollIndex1748679478104 implements MigrationInterface {
  name = 'CreatePollIndex1748679478104';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_7d81403ebc94c560ee27b02723" ON "polls" USING GIN ("tags") WHERE tags IS NOT NULL`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_094f0acd38d23bd63fb84947c0" ON "polls" ("createdAt") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_094f0acd38d23bd63fb84947c0"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7d81403ebc94c560ee27b02723"`
    );
  }
}
