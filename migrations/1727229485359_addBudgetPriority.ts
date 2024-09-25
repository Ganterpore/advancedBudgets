import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('budget_savings_mapping', {
    priority: 'integer'
  })
  pgm.addColumn('budget_excess_mapping', {
    priority: 'integer'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('budget_savings_mapping', 'priority')
  pgm.dropColumn('budget_excess_mapping', 'priority')
}
