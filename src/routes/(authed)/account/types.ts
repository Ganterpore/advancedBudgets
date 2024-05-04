import FluentBox16Regular from '~icons/fluent/box-16-regular';
import MapGroceryOrSupermarket from '~icons/map/grocery-or-supermarket';
import FaSolidPiggyBank from '~icons/fa-solid/piggy-bank';
import LaHandshakeSolid from '~icons/la/handshake-solid';

export enum AccountType {
  STORAGE = 'Storage',
  BUDGET = 'Budget',
  SAVING = 'Saving',
  OWED = 'Owed'
}

export const accountTypeIcons = {
  [AccountType.STORAGE]: FluentBox16Regular,
  [AccountType.BUDGET]: MapGroceryOrSupermarket,
  [AccountType.SAVING]: FaSolidPiggyBank,
  [AccountType.OWED]: LaHandshakeSolid
}
export const accountTypeDescriptions = {
  [AccountType.STORAGE]: 'This is an unlimited storage source.',
  [AccountType.BUDGET]: 'Create a budget account for tracking spending in a certain category.',
  [AccountType.SAVING]: 'Create a Savings account for tracking saving up for something.',
  [AccountType.OWED]: 'Create an Owing account for tracking who owes you money.'
}