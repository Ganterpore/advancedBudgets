import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('account_type_budget', {
    type: {
      type: 'string',
      default: 'Wants'
    }
  })

}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('account_type_budget', 'type')
}
