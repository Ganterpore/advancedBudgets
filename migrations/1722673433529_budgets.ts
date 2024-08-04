import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import { idColumn, userColumn } from '../src/lib/dbColumns'

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
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('budget')
}
