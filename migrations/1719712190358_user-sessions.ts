import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';
import { userColumn } from '../src/lib/dbColumns'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('user_session', {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true
    },
    expires_at: {
      type: 'timestamptz',
      notNull: true
    },
    user_id: userColumn
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('user_session')
}
