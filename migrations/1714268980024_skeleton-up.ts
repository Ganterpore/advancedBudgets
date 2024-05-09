import { MigrationBuilder } from 'node-pg-migrate'
import { accountColumn, idColumn, priorityColumn, userColumn } from './standard_columns'

exports.up = (pgm: MigrationBuilder): Promise<void> | void => {
  pgm.createTable('users', {
    id: idColumn,
    username: {
      type: 'string',
      unique: true,
      notNull: true
    }
  })
  pgm.createTable('parent_accounts', {
    id: idColumn,
    user: userColumn,
    name: 'string',
    priority: priorityColumn
  })
  pgm.createTable('accounts', {
    id: idColumn,
    name: 'string',
    type: 'string',
    priority: priorityColumn,
    parent: {
      type: 'integer',
      references: 'parent_accounts(id)',
      onDelete: 'CASCADE'
    }
  })
  pgm.createTable('transactions', {
    id: idColumn,
    amount: 'double',
    description: 'string',
    account: accountColumn,
    transactionTime: 'datetime'
  })
};

exports.down = (pgm: MigrationBuilder): Promise<void> | void => {
  pgm.dropTable('transactions')
  pgm.dropTable('accounts')
  pgm.dropTable('parent_accounts')
  pgm.dropTable('users')
};
