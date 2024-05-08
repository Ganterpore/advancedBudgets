import { MigrationBuilder } from 'node-pg-migrate'
import { userColumn, idColumn, accountColumn, priorityColumn } from '../src/db/standard_columns'

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
    account: {
      type: 'integer',
      references: 'accounts(id)',
      onDelete: 'CASCADE'
    }
  })
};

exports.down = (pgm: MigrationBuilder): Promise<void> | void => {
  pgm.dropTable('transactions')
  pgm.dropTable('accounts')
  pgm.dropTable('parent_accounts')
  pgm.dropTable('users')
};
