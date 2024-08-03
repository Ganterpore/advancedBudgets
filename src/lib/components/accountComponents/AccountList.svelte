<script lang="ts">
  import * as svelte from 'svelte'
  import AccountHeader from './AccountHeader.svelte'
  import type { Account, AccountTypeSaving } from '$lib/types/accountTypes'
  import { AccountType, BudgetAccountType } from '$lib/types/accountTypes'
  import type { AccountTotals } from '$lib/types/transactionTypes'
  import Expandable from '$lib/components/sharedComponents/Expandable.svelte'
  import SavingsExpandable from '$lib/components/accountComponents/SavingsExpandable.svelte'
  import List from '$lib/components/sharedComponents/List.svelte'

  export let parent: number
  export let accounts: Account[]
  export let totals: AccountTotals
  export let onSelect: (isParent: boolean, id: string) => void

  const headerTypeObjects: { [key: AccountType]: svelte.ComponentType } = {
    [AccountType.INCOME]: Expandable,
    [AccountType.STORAGE]: Expandable,
    [AccountType.SAVING]: SavingsExpandable,
    [AccountType.BUDGET]: Expandable,
    [`${AccountType.BUDGET} - ${BudgetAccountType.WANT}`]: Expandable,
    [`${AccountType.BUDGET} - ${BudgetAccountType.NEED}`]: Expandable,
    [AccountType.OWED]: Expandable
  }
  function sortAccounts (category: AccountType): (a: Account, b: Account) => number {
    switch (category) {
      case AccountType.SAVING:
        return (a: Account, b: Account) => {
          const aPercent = (totals[a.id] ?? 0) / ((a.additionalAccountData as AccountTypeSaving).target ?? 1)
          const bPercent = (totals[b.id] ?? 0) / ((b.additionalAccountData as AccountTypeSaving).target ?? 1)
          return bPercent - aPercent
        }
      default:
        return (a: Account, b: Account) => a.name.localeCompare(b.name)
    }
  }
  function filterAccounts (category: AccountType): (account: Account) => boolean {
    if (category !== AccountType.SAVING) return () => true
    return account => !(account.additionalAccountData as AccountTypeSaving).completed
  }
  let accountMap: { [key: AccountType]: Account[] }
  $: accountMap = accounts.filter(a => !a.archived).reduce(
    (am, a) => {
      let type: string = a.type
      if (type === AccountType.BUDGET && a.additionalAccountData?.type) {
        type = `${type} - ${a.additionalAccountData.type}`
      }
      if (!am[type]) {
        am[type] = []
      }
      if (filterAccounts(a.type)(a)) am[type].push(a)
      am[type].sort(sortAccounts(a.type))
      return am
    },
    {}
  )
  $: propsFor = {
    [AccountType.SAVING]: {
      name: AccountType.SAVING,
      parent,
      accounts: accountMap ? accountMap[AccountType.SAVING] : [],
      totals: accountMap ? accountMap[AccountType.SAVING].reduce((totalsMap, acc) => {
        totalsMap[acc.id] = totals[acc.id]
        return totalsMap
      }, {}) : {}
    },
    [AccountType.BUDGET]: {
      name: AccountType.BUDGET
    },
    [`${AccountType.BUDGET} - ${BudgetAccountType.WANT}`]: {
      name: 'Budget - Wants'
    },
    [`${AccountType.BUDGET} - ${BudgetAccountType.NEED}`]: {
      name: 'Budget - Needs'
    },
    [AccountType.OWED]: {
      name: AccountType.OWED
    },
    [AccountType.STORAGE]: {
      name: AccountType.STORAGE
    },
    [AccountType.INCOME]: {
      name: AccountType.INCOME
    }
  }
  const sortOrder = [
    AccountType.INCOME,
    AccountType.BUDGET,
    `${AccountType.BUDGET} - ${BudgetAccountType.NEED}`,
    `${AccountType.BUDGET} - ${BudgetAccountType.WANT}`,
    AccountType.STORAGE,
    AccountType.OWED,
    AccountType.SAVING
  ]
</script>

{#each Object.keys(accountMap).sort((acc1, acc2) => sortOrder.indexOf(acc1) - sortOrder.indexOf(acc2)) as category (category)}
  <svelte:component this={headerTypeObjects[category]} {...propsFor[category]} >
    <List selectable secondary onSelected={(id) => onSelect(false, id)}
          list={accountMap[category].map(a => {
        return {
            id: a.id,
            header: AccountHeader,
            headerProps: {
                name: a.name,
                id: a.id,
                type: a.type,
                additionalAccountData: a.additionalAccountData,
                value: totals[a.id]
            }
        }
    })} />
  </svelte:component>
{/each}
