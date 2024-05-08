export enum FrequencyCategory {
  EVERY_X_DAYS = 'everyXDays',
  EVERY_X_WEEKS = 'everyXWeeks',
  EVERY_X_MONTHS = 'everyXMonths',
  WEEKLY_ON = 'weeklyOn',
  MONTHLY_ON = 'monthlyOn'
}

export type AccountTypeBudget = {
  id: number
  account: number
  regularBudget: number
  budgetMax: number
  frequency: number
  frequencyCategory: FrequencyCategory
  startDate: Date
}