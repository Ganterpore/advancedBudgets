import type { ColumnDefinition } from 'node-pg-migrate'

export const idColumn: ColumnDefinition = {
  type: 'serial',
  unique: true,
  primaryKey: true,
  notNull: true
}

export const userColumn: ColumnDefinition = {
  type: 'integer',
  references: 'users(id)',
  notNull: true
}