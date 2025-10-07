import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyNumberColumnLengthTelephonesTable1759172991155
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE telephones MODIFY COLUMN number VARCHAR(20)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE telephones MODIFY COLUMN number VARCHAR(15)`,
    );
  }
}
