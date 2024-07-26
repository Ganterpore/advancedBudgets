<script lang="ts">
  import EpBack from '~icons/ep/back'
  import { openPopup, selectedParentAccount } from '$lib/store.ts'
  import type { Account, AccountTypeBudget, AccountTypeSaving } from '$lib/types/accountTypes'
  import { FrequencyCategory } from '$lib/types/sharedTypes'
  import { AccountType } from '$lib/types/accountTypes'
  import { invalidate } from '$app/navigation'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import AccountTypeList from '$lib/components/accountComponents/AccountTypeList.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import AccountTypeListItem from '$lib/components/accountComponents/AccountTypeListItem.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import BudgetAccountDetails from '$lib/components/accountComponents/BudgetAccountDetails.svelte'
  import SavingsAccountDetails from '$lib/components/accountComponents/SavingsAccountDetails.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'

  let accountName: string
  let error: string
  if (!accountName) accountName = ''

  let accountType: AccountType | undefined

  export let account: Account | undefined = undefined

  let additionalSavingsDetails: Omit<AccountTypeSaving, 'id'|'account'> & Partial<AccountTypeSaving>
  let additionalBudgetDetails: Omit<AccountTypeBudget, 'id'|'account'> & Partial<AccountTypeBudget>
  function getAccountDetails (account: Account | undefined) {
    if (!account) return
    accountType = account.type
    accountName = account.name
    if (account.additionalAccountData) {
      if ('multiplier' in account.additionalAccountData) {
        additionalSavingsDetails = account.additionalAccountData as AccountTypeSaving
      } else {
        additionalBudgetDetails = account.additionalAccountData as AccountTypeBudget
      }
    }
  }
  getAccountDetails(account)
  $: if (accountType === AccountType.SAVING) additionalSavingsDetails = {
    multiplier: additionalSavingsDetails?.multiplier ?? 100,
    target: additionalSavingsDetails?.target ?? 0,
    account: additionalSavingsDetails?.account ?? undefined,
    id: additionalSavingsDetails?.id ?? undefined
  }
  $: if (accountType === AccountType.BUDGET) additionalBudgetDetails = {
    regularBudget: additionalBudgetDetails?.regularBudget ?? 0,
    budgetMax: additionalBudgetDetails?.budgetMax ?? 0,
    frequency: additionalBudgetDetails?.frequency ?? 1,
    frequencyCategory: additionalBudgetDetails?.frequencyCategory ?? FrequencyCategory.MONTHLY,
    startDate: additionalBudgetDetails?.startDate ?? new Date(),
    dayOf: additionalBudgetDetails?.dayOf ?? 1,
    account: additionalBudgetDetails?.account ?? undefined,
    id: additionalBudgetDetails?.id ?? undefined
  }

  async function createAccount () {
    const accountBody: Omit<Account, 'id'|'additionalAccountData'> & Partial<Account> = {
      name: accountName,
      type: accountType!,
      parent: account?.parent ?? $selectedParentAccount,
    }
    if (account?.id) accountBody.id = account.id
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
    accountType = account?.type ?? undefined
    accountName = account?.name ?? ''
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