import { MigrationBuilder } from 'node-pg-migrate'
import { accountColumn, idColumn, priorityColumn, userColumn } from "../src/lib/dbColumns";

exports.up = (pgm: MigrationBuilder): Promise<void> | void => {
  pgm.createTable('users', {
    id: idColumn,
    authId: {
      type: 'string',
      unique: true,
      notNull: true
    },
    username: 'string'
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
    amount: 'integer',
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
