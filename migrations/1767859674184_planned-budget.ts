import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('account_type_budget', {
    endDate: 'date'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('account_type_budget', 'endDate')
}
