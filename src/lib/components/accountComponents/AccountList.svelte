<script lang="ts">
  import * as svelte from 'svelte'
  import AccountHeader from "./AccountHeader.svelte";
  import type { Account, AccountTypeSaving } from '$lib/types/accountTypes'
  import type { AccountTotals } from '$lib/types/transactionTypes'
  import { AccountType } from '$lib/types/accountTypes'
  import Expandable from '$lib/components/sharedComponents/Expandable.svelte'
  import SavingsExpandable from '$lib/components/accountComponents/SavingsExpandable.svelte'
  import List from '$lib/components/sharedComponents/List.svelte'

  export let parent: number
  export let accounts: Account[]
  export let totals: AccountTotals
  export let onSelect: (isParent: boolean, id: string) => void

  const headerTypeObjects: { [key: AccountType]: svelte.ComponentType } = {
    [AccountType.STORAGE]: Expandable,
    [AccountType.SAVING]: SavingsExpandable,
    [AccountType.BUDGET]: Expandable,
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
      if (!am[a.type]) {
        am[a.type] = []
      }
      if (filterAccounts(a.type)(a)) am[a.type].push(a)
      am[a.type].sort(sortAccounts(a.type))
      return am
    },
    {}
  )
  let propsFor: { [key: AccountType]: unknown } = {}
  $: Object.values(AccountType).map(category => {
    propsFor[category] = {}
    switch (category) {
      case AccountType.SAVING:
        propsFor[category].parent = parent
        propsFor[category].accounts = accountMap[category]
        propsFor[category].totals = {}
        accountMap[category]?.forEach(a => propsFor[category].totals[a.id] = totals[a.id])
      // eslint-disable-next-line no-fallthrough
      case AccountType.BUDGET:
      case AccountType.OWED:
      case AccountType.STORAGE:
        propsFor[category].name = category
    }
  })
</script>

{#each Object.keys(accountMap) as category (category)}
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
