import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import { accountColumn, idColumn, userColumn } from '../src/lib/dbColumns'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('budget', {
    id: idColumn,
    user: {
      ...userColumn,
      unique: true
    },
    frequency: 'integer',
    frequencyCategory: 'string',
    dayOf: 'integer',
    lastBudget: 'date'
  })
  pgm.createTable('budget_excess_mapping', {
    id: idColumn,
    user: userColumn,
    account: accountColumn,
    proportion: {
      type: 'integer',
      default: 100
    }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('budget')
  pgm.dropTable('budget_excess_mapping')
}
