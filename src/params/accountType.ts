import { AccountType } from "../routes/(authed)/account/types";

export function match(value: string): boolean {
  return (Object.values(AccountType) as string[]).includes(value)
}