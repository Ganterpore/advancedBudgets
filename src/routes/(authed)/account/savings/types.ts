export type AccountTypeSaving = {
  id: number
  account: number
  multiplier: number
  target: number
}

export interface ExpandedSavingsAccount extends AccountTypeSaving {
  name: string
  type: string
  parent: number
}

export type SuggestedTransaction = {
  account: number,
  amount: number
}