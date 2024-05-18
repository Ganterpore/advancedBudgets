import { MigrationBuilder } from 'node-pg-migrate';
import { accountColumn, idColumn } from "../src/lib/dbColumns";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('account_type_saving', {
    id: idColumn,
    account: accountColumn,
    multiplier: 'integer',
    target: 'integer',
    completed: 'boolean'
  })
  pgm.createTable('account_type_budget', {
    id: idColumn,
    account: accountColumn,
    regularBudget: 'integer',
    budgetMax: 'integer',
    frequency: 'integer',
    frequencyCategory: 'string',
    dayOf: 'integer',
    startDate: 'date'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('account_type_saving')
  pgm.dropTable('account_type_budget')
}
