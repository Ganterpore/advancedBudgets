import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import { idColumn } from '../src/lib/dbColumns'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('debt_account', {
    id: idColumn,
    parent: {
      type: 'integer',
      references: 'parent_accounts(id)',
      onDelete: 'CASCADE'
    },
    principal: 'integer',
    percent: 'numeric(3, 2)',
    regularRepayment: 'integer'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('debt_account')
}
