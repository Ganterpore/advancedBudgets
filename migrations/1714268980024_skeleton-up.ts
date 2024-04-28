import { MigrationBuilder } from 'node-pg-migrate'
import { userColumn, idColumn } from '../src/db/standard_columns'

exports.up = (pgm: MigrationBuilder): Promise<void> | void => {
  pgm.createTable('users', {
    id: idColumn,
    username: {
      type: 'string',
      unique: true,
      notNull: true
    }
  })
  pgm.createTable('accounts', {
    id: idColumn,
    user: userColumn,
    name: 'string',
    amount: 'double',
    type: 'string',
    parent: {
      type: 'integer',
      references: 'accounts(id)'
    }
  })
};

exports.down = (pgm: MigrationBuilder): Promise<void> | void => {
  pgm.dropTable('accounts')
  pgm.dropTable('users')
};
