import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('parent_accounts', {
    archived: 'boolean'
  })
  pgm.addColumn('accounts', {
    archived: 'boolean'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('parent_accounts', {
    archived: 'boolean'
  })
  pgm.dropColumn('accounts', {
    archived: 'boolean'
  })
}
