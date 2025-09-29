import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTelephonesTable1759170653712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'telephones',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'number',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'supplier_id',
            type: 'int',
          },
          {
            name: 'created_at',
            default: 'CURRENT_TIMESTAMP',
            type: 'datetime',
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['supplier_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'suppliers',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('telephones');
  }
}
