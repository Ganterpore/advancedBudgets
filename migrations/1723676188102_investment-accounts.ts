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
  pgm.addColumn('budget_savings_mapping', {
    type: 'string'
  })
  pgm.addColumn('budget_excess_mapping', {
    type: 'string'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('budget_savings_mapping', 'type')
  pgm.dropColumn('budget_excess_mapping', 'type')
  pgm.dropTable('investment_value')
  pgm.dropTable('investment_account')
}
