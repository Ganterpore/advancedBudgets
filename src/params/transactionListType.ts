export enum TransactionListType {
  ACCOUNT = 'account',
  PARENT_ACCOUNT = 'parentAccount'
}

export function match(value: string): boolean {
  return (Object.values(TransactionListType) as string[]).includes(value)
}