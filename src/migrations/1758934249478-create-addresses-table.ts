import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateAddressesTable1758934249478 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'street',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'neighborhood',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'number',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'created_at',
            default: 'CURRENT_TIMESTAMP',
            type: 'timestamp',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'addresses',
      new TableColumn({
        name: 'supplier_id',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'addresses',
      new TableForeignKey({
        columnNames: ['supplier_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'suppliers',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('addresses');
    const foreignKey = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('supplier_id') !== -1,
    );
    await queryRunner.dropForeignKey('addresses', foreignKey!);
    await queryRunner.dropColumn('addresses', 'supplier_id');
    await queryRunner.dropTable('addresses');
  }
}
