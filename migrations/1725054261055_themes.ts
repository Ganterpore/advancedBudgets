import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import { idColumn, userColumn } from '../src/lib/dbColumns'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('user_settings', {
    id: idColumn,
    user: userColumn,
    theme: 'string'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('user_settings')
}
