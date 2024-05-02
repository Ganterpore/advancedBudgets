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
  })
  pgm.createTable('sub_accounts', {
    id: idColumn,
    name: 'string',
    type: 'string',
    parent: {
      type: 'integer',
      references: 'accounts(id)'
    }
  })
  pgm.createTable('transactions', {
    id: idColumn,
    amount: 'double',
    description: 'string',
    sub_account: {
      type: 'integer',
      references: 'sub_accounts(id)'
    }
  })
};

exports.down = (pgm: MigrationBuilder): Promise<void> | void => {
  pgm.dropTable('accounts')
  pgm.dropTable('users')
};
