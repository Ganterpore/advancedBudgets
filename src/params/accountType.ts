import { AccountType } from '$lib/types/accountTypes'

export function match(value: string): boolean {
  return (Object.values(AccountType) as string[]).includes(value)
}