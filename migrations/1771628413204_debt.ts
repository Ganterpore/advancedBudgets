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
    nominatedAccount: {
      type: 'integer',
      references: 'accounts(id)',
      onDelete: 'RESTRICT'
    },
    principal: 'integer',
    percent: 'numeric(4, 2)',
    regularRepayment: 'integer'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('debt_account')
}
