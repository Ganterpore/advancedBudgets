import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import { idColumn, investmentAccountColumn, priorityColumn, userColumn } from '../src/lib/dbColumns'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('investment_account', {
    id: idColumn,
    user: userColumn,
    name: 'string',
    expectedROI: 'integer',
    withdrawalRate: 'integer',
    priority: priorityColumn,
    archived: 'boolean'
  })
  pgm.createTable('investment_value', {
    id: idColumn,
    investment: investmentAccountColumn,
    amount: 'integer',
    onDate: 'datetime'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('investment_value')
  pgm.dropTable('investment_account')
}
