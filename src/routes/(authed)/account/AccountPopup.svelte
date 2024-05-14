<script lang="ts">
  import EpBack from '~icons/ep/back'
  import { openPopup, selectedParentAccount } from '$lib/store.ts'
  import Button from '$lib/components/Button.svelte'
  import Input from '$lib/components/Input.svelte'
  import Popup from '$lib/components/Popup.svelte'
  import Alert from '$lib/components/Alert.svelte'
  import AccountTypeList from './AccountTypeList.svelte'
  import AccountTypeListItem from './AccountTypeListItem.svelte'
  import { invalidate } from '$app/navigation'
  import { FrequencyCategory } from '$lib/types'
  import type { Account } from './types'
  import { AccountType } from './types'
  import type { AccountTypeSaving } from "./savings/types";
  import type { AccountTypeBudget } from "./budget/types";
  import BudgetAccountDetails from "./budget/BudgetAccountDetails.svelte";
  import SavingsAccountDetails from "./savings/SavingsAccountDetails.svelte";

  let accountName: string
  let error: string
  if (!accountName) accountName = ''

  let accountType: AccountType | undefined

  let additionalSavingsDetails: Omit<AccountTypeSaving, 'id'|'account'>
  $: if (accountType === AccountType.SAVING)  additionalSavingsDetails = {
    multiplier: 1,
    target: 0
  }
  let additionalBudgetDetails: Omit<AccountTypeBudget, 'id'|'account'>
  $: if (accountType === AccountType.BUDGET) additionalBudgetDetails = {
    regularBudget: 0,
    budgetMax: 0,
    frequency: 1,
    frequencyCategory: FrequencyCategory.MONTHLY,
    startDate: new Date(),
    dayOf: 1
  }

  async function createAccount () {
    const accountBody: Omit<Account, 'id'> = {
      name: accountName,
      type: accountType!,
      parent: $selectedParentAccount
    }
    if (accountType === AccountType.BUDGET) {
      accountBody.additionalAccountData = additionalBudgetDetails
    } else if (accountType === AccountType.SAVING) {
      accountBody.additionalAccountData = additionalSavingsDetails
    }
    const res = await fetch('/account', {
      method: 'POST',
      body: JSON.stringify(accountBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const body = await res.json()
    if (res.status === 201) {
      onClose()
      $openPopup = false
      await invalidate('data:accounts')
    } else {
      error = body.error
    }
  }

  function onClose () {
    accountType = undefined
    accountName = ''
    error = ''
  }

  function onSelected (id: string) {
    accountType = id as AccountType
  }
</script>

<Popup id="childAccount" onClose={onClose}>
  <p class="header" >Choose an account type</p>
  {#if !accountType}
  <AccountTypeList onSelected={onSelected}/>
  {:else }
    <div class="topBar">
      <Button on:click={() => accountType = undefined}>
        <EpBack />
      </Button>
      <AccountTypeListItem id={accountType} />
    </div>
    {#if error}
      <Alert>{error}</Alert>
    {/if}
      {#if accountType === AccountType.BUDGET}
        <BudgetAccountDetails name={accountName} bind:dataObject={additionalBudgetDetails} />
      {:else if accountType === AccountType.SAVING}
        <SavingsAccountDetails bind:dataObject={additionalSavingsDetails} />
      {/if}
    <form class="form">
      <Input autofocus={![AccountType.SAVING, AccountType.BUDGET].includes(accountType)} label="Name" name="accountName" bind:value={accountName}/>
      <div><Button on:click={() => createAccount()} >Create</Button></div>
    </form>
  {/if}
</Popup>

<style>
  .header {
      margin: 0;
      color: var(--theme-text);
      font-size: larger;
      font-weight: bold;
  }
  .topBar {
      display: flex;
      flex-direction: row;
      justify-content: start;
  }
  .form {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
  }
</style>