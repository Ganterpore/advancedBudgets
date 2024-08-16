<script lang="ts">
  import { openPopup } from '$lib/store.js'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import type { Investment, ParentAccount } from '$lib/types/accountTypes'
  import Toggle from '$lib/components/sharedComponents/Toggle.svelte'
  import ParentAccountForm from '$lib/components/accountComponents/ParentAccountForm.svelte'
  import InvestmentAccountForm from '$lib/components/accountComponents/InvestmentAccountForm.svelte'

  let accountType: 'Cash' | 'Investment' = 'Cash'
  export let account: Pick<ParentAccount, 'name'> & Partial<ParentAccount> = {
    name: ''
  }
  export let investment: Omit<Investment, 'id'|'user'> & Partial<Investment> = {
    name: '',
    amount: 0,
    expectedROI: 600,
    withdrawalRate: 0
  }

  async function onSubmit () {
    if (!account.id) {
      account.name = ''
    } if (!investment.id) {
      investment.name = ''
      investment.amount = 0
      investment.expectedROI = 600
      investment.withdrawalRate = 0
    }
    $openPopup = false
  }

  function onClose () {
    if (!account.id) {
      account.name = ''
    }
  }

  $: isUpdating = account.id || investment.id
  const refreshAccountType = (accountId?: number, investmentId?: number) => {
    if (accountId) return 'Cash'
    if (investmentId) return 'Investment'
    return accountType
  }
  $: accountType = refreshAccountType(account.id, investment.id)
</script>

<div class="container">
  <Popup id="newAccount" onClose={onClose}>
    <h1 style="margin: 0">{isUpdating ? 'Update' : 'Add'} Account</h1>
    <Toggle disabled={isUpdating} value1="Cash" value2="Investment" bind:selected={accountType} />

    {#if accountType === 'Cash'}
      <ParentAccountForm account={account} onSubmit={onSubmit} />
    {:else if accountType === 'Investment'}
      <InvestmentAccountForm investment={investment} onSubmit={onSubmit} />
    {/if}
  </Popup>
</div>

<style>
  .container {
    transition: width 1s, height 1s;
  }
</style>