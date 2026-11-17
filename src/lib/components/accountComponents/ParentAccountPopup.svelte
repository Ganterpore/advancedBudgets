<script lang="ts">
  import { openPopup } from '$lib/store.js'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import type { Account, AccountNode, Debt, Investment, ParentAccount } from '$lib/types/accountTypes'
  import Toggle from '$lib/components/sharedComponents/Toggle.svelte'
  import ParentAccountForm from '$lib/components/accountComponents/ParentAccountForm.svelte'
  import InvestmentAccountForm from '$lib/components/accountComponents/InvestmentAccountForm.svelte'
  import DebtAccountForm from '$lib/components/accountComponents/DebtAccountForm.svelte'

  let accountType: 'Cash' | 'Investment' | 'Debt' = 'Cash'
  export let account: Pick<ParentAccount, 'name'> & Partial<ParentAccount> = {
    name: ''
  }
  export let investment: Omit<Investment, 'id'|'user'> & Partial<Investment> = {
    name: '',
    amount: 0,
    expectedROI: 600,
    withdrawalRate: 0
  }
  export let debt: Omit<Debt, 'id'|'user'|'parent'|'nominatedAccount'> & Partial<Debt> = {
    name: '',
    principal: 0,
    percent: 0,
    regularRepayment: 0
  }
  export let isOpen = undefined

  async function onSubmit () {
    if (!account.id) {
      account.name = ''
    } if (!investment.id) {
      investment.name = ''
      investment.amount = 0
      investment.expectedROI = 600
      investment.withdrawalRate = 0
    } if (!debt.id && !debt.parent) {
      debt.name = ''
      debt.principal = 0
      debt.percent = 0
      debt.regularRepayment = 0
    }
    $openPopup = false
    if (isOpen !== undefined) isOpen = false
  }

  function onClose () {
    if (!account.id) {
      account.name = ''
    }
    if (isOpen !== undefined) isOpen = false
  }

  $: isUpdating = account.id || investment.id
  // An existing parent account can be converted between a normal (cash) account and a debt account
  $: canConvert = !!account.id && !investment.id
  $: isDebt = !!debt.id
  $: repaymentAccountOptions = Object.values((account as Partial<AccountNode>).children ?? {})
    .filter((a: Account) => !a.archived)
  const refreshAccountType = (accountId?: number, investmentId?: number, debtId?: number) => {
    if (investmentId) return 'Investment'
    if (debtId) return 'Debt'
    if (accountId) return 'Cash'
    return accountType
  }
  // Parents re-pass these props as new objects on unrelated updates, so only reset the selected type
  // when the underlying ids actually change. Otherwise the Cash/Debt toggle would snap back immediately.
  let lastIdsKey: string | undefined
  $: {
    const idsKey = `${account.id}|${investment.id}|${debt.id}`
    if (idsKey !== lastIdsKey) {
      lastIdsKey = idsKey
      accountType = refreshAccountType(account.id, investment.id, debt.id)
    }
  }
</script>

<div class="container">
  <Popup id="newAccount" onClose={onClose} bind:isOpen={isOpen}>
    <h1 style="margin: 0">{isUpdating ? 'Update' : 'Add'} Account</h1>
    {#if canConvert}
      <Toggle values={["Cash", "Debt"]} bind:selected={accountType} />
    {:else}
      <Toggle disabled={isUpdating} values={["Cash", "Investment", "Debt"]} bind:selected={accountType} />
    {/if}

    {#if accountType === 'Cash'}
      <ParentAccountForm account={account} onSubmit={onSubmit} removeDebt={canConvert && isDebt} />
    {:else if accountType === 'Investment'}
      <InvestmentAccountForm investment={investment} onSubmit={onSubmit} />
    {:else if accountType === 'Debt'}
      <DebtAccountForm debt={debt} onSubmit={onSubmit} repaymentAccountOptions={repaymentAccountOptions} />
    {/if}
  </Popup>
</div>

<style>
  .container {
    background-color: var(--theme-primary);
    transition: width 1s, height 1s;
    color: var(--theme-text);
  }
</style>