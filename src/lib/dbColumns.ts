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

export const accountColumn: ColumnDefinition = {
  type: 'integer',
  references: 'accounts(id)',
  onDelete: 'CASCADE'
}

export const priorityColumn: ColumnDefinition = {
  type: 'integer',
  default: 100
}