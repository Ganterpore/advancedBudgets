import { MigrationBuilder } from 'node-pg-migrate'
import { userColumn } from '../src/db/utils'
const { idColumn } = require('../src/db/utils.js')

exports.up = (pgm: MigrationBuilder): Promise<void> | void => {
  pgm.createTable('users', {
    id: idColumn,
    username: 'string'
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
