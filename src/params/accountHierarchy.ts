export enum AccountHierarchy {
  ACCOUNT = 'account',
  PARENT_ACCOUNT = 'parentAccount'
}

export function match(value: string): boolean {
  return (Object.values(AccountHierarchy) as string[]).includes(value)
}