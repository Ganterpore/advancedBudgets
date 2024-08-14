import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import { accountColumn, idColumn, userColumn } from '../src/lib/dbColumns'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('budget_savings_mapping', {
    id: idColumn,
    user: userColumn,
    account: accountColumn,
    max: 'integer'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('budget_savings_mapping')
}
