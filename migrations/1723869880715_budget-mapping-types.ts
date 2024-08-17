import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('budget_savings_mapping', {
    type: {
      type: 'string',
      default: 'account;'
    }
  })
  pgm.addColumn('budget_excess_mapping', {
    type: {
      type: 'string',
      default: 'account;'
    }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('budget_savings_mapping', 'type')
  pgm.dropColumn('budget_excess_mapping', 'type')
}
