<script lang="ts">
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
  import AccountHeader from './AccountHeader.svelte'
  import type { Account, AccountTypeBudget, AccountTypeSaving, ParentAccount } from '$lib/types/accountTypes'
  import { AccountType, BudgetAccountType } from '$lib/types/accountTypes'
  import type { AccountTotals } from '$lib/types/transactionTypes'
  import Expandable from '$lib/components/sharedComponents/Expandable.svelte'
  import ListItem from '$lib/components/sharedComponents/ListItem.svelte'
  import { currencyToString } from '$lib/utils'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import SavingsProgress from '$lib/components/accountComponents/SavingsProgress.svelte'
  import { TransactionType } from '$lib/types/transactionTypes'
  import type { Budget } from '$lib/types/budgetTypes'
  import TransactionPopup from '$lib/components/transactionComponents/TransactionPopup.svelte'
  import { savingsAccountMultiplierToString } from '$lib/helpers/accountHelpers'

  export let parent: ParentAccount
  export let accounts: Account[]
  export let totals: AccountTotals
  export let budgetDetails: Budget
  export let onSelect: (isParent: boolean, id: string) => void

  function sortAccounts (category: AccountType): (a: Account, b: Account) => number {
    const isCurrent = (acc: AccountTypeBudget) => {
      const now = new Date()
      if (!acc.endDate) return false
      return acc.startDate < now && acc.endDate > now
    }
    const isPast = (acc: AccountTypeBudget) => {
      const now = new Date()
      if (!acc.endDate) return false
      return acc.endDate < now
    }
    switch (category) {
      case AccountType.PLANNED:
        return (a: Account, b: Account) => {
          const ab = a.additionalAccountData as AccountTypeBudget
          const bb = b.additionalAccountData as AccountTypeBudget
          // Put Current tasks at the top
          if (isCurrent(ab) && !isCurrent(bb)) return -1
          if (!isCurrent(ab) && isCurrent(bb)) return 1
          // Put past tasks at the bottom
          if (isPast(ab) && !isPast(bb)) return 1
          if (!isPast(ab) && isPast(bb)) return -1
          // Sort those in the same category by name
          return a.name.localeCompare(b.name)

        }
      case AccountType.SAVING:
        return (a: Account, b: Account) => {
          const isPaused = (account: Account) => (account.additionalAccountData as AccountTypeSaving).multiplier === 0
          if (isPaused(a) && !isPaused(b)) return 1
          if (!isPaused(a) && isPaused(b)) return -1
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
  const propsFor = (category) => {
    const accounts = accountMap ? accountMap[category] : []
    const props: {
      name: string,
      total: number,
      goal?: number
      totalMultiplier?: number
    } = {
      name: category,
      total: accounts.reduce((total, acc) => {
        total += isNaN(totals[acc.id]) ? 0 : totals[acc.id]
        return total
      }, 0)
    }
    if (category === AccountType.SAVING) {
      props.goal = accounts.reduce(
        (acc: number, s: Account) => acc + (s.additionalAccountData as AccountTypeSaving).target,
        0
      )
      props.totalMultiplier = accounts.reduce((total, acc) => {
        const amountSaved = totals[acc.id]
        const savingsData = acc.additionalAccountData as AccountTypeSaving
        const goal = savingsData.target
        if (amountSaved >= goal) return total
        return total + savingsData.multiplier
      }, 0)
    }
    return props
  }
  const sortOrder = [
    AccountType.INCOME,
    AccountType.BUDGET,
    `${AccountType.BUDGET} - ${BudgetAccountType.NEED}`,
    `${AccountType.BUDGET} - ${BudgetAccountType.WANT}`,
    AccountType.STORAGE,
    AccountType.PLANNED,
    AccountType.OWED,
    AccountType.SAVING
  ]

  let isTransactionPopupOpen = false
  async function addTransaction (e) {
    e.stopPropagation()
    isTransactionPopupOpen = true
  }
</script>

<TransactionPopup
  accounts={accounts}
  account={parent}
  selectedTransactionType={TransactionType.GROUPED_SAVING}
  isOpen={isTransactionPopupOpen}
  onClose={() => isTransactionPopupOpen = false}/>

{#each Object.keys(accountMap).sort((acc1, acc2) => sortOrder.indexOf(acc1) - sortOrder.indexOf(acc2)) as category (category)}
  <div style="padding: 0 20px; margin: 0;">
    <Expandable name={category}>
      <div>
        {#each accountMap[category] as a}
          <ListItem selectable secondary onSelected={() => onSelect(false, a.id)} >
            <AccountHeader account={a}
                           accounts={accounts}
                           additionalAccountData={a.additionalAccountData}
                           value={totals[a.id]} budgetDetails={budgetDetails} />
          </ListItem>
        {/each}
      </div>

      <div slot="subtext" class="subtext">
        {#if category === AccountType.SAVING}
          <p style="align-self: center; margin: 0; padding: 0; font-style: italic">{savingsAccountMultiplierToString(propsFor(category).totalMultiplier)}</p>
        {/if}
      </div>
      <div slot="header" class="header">
        {#if category !== AccountType.SAVING}
          <p class="currency">{currencyToString(propsFor(category).total)}</p>
        {:else}
          <Button on:click={addTransaction}>
            <MaterialSymbolsAddRounded/>
          </Button>
          <div class="progress">
            <div>
            <p class="currency">{currencyToString(propsFor(category).total)}</p>
            <p class="additional-info">{currencyToString(propsFor(category).goal)}</p>
            </div>
            <SavingsProgress savingsGoal={propsFor(category).goal} currentValue={propsFor(category).total} />
          </div>
        {/if}
      </div>
    </Expandable>
    </div>
{/each}

<style>
  .header {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .progress {
    flex-grow: 1;
    justify-content: right;
  }
  .currency {
    text-align: right;
    width: 100%;
    margin: 0;
  }
  .subtext {
  }
  .additional-info {
    text-align: right;
    font-weight: lighter;
    font-style: italic;
    font-size: smaller;
    color: var(--theme-text-light);
    margin: 5px;
    padding: 0;
  }
</style>