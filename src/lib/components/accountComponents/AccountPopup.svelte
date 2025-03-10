<script lang="ts">
  import EpBack from '~icons/ep/back'
  import { openPopup, selectedParentAccount } from '$lib/store.ts'
  import type { Account, AccountTypeBudget, AccountTypeSaving } from '$lib/types/accountTypes'
  import { AccountType, BudgetAccountType } from '$lib/types/accountTypes'
  import { FrequencyCategory } from '$lib/types/sharedTypes'
  import { invalidate } from '$app/navigation'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import AccountTypeList from '$lib/components/accountComponents/AccountTypeList.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import AccountTypeListItem from '$lib/components/accountComponents/AccountTypeListItem.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import BudgetAccountDetails from '$lib/components/accountComponents/BudgetAccountDetails.svelte'
  import SavingsAccountDetails from '$lib/components/accountComponents/SavingsAccountDetails.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import LoadingSpinner from '$lib/components/sharedComponents/LoadingSpinner.svelte'

  let accountName: string
  let error: string
  if (!accountName) accountName = ''
  let loading = false

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
    id: additionalBudgetDetails?.id ?? undefined,
    type: additionalBudgetDetails?.type ?? BudgetAccountType.WANT
  }

  async function createAccount () {
    loading = true
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
    loading = false
    if (res.status === 201) {
      onClose()
      $openPopup = false
      await invalidate('data:accounts')
    } else {
      const body = await res.json()
      error = body.error ?? body.message
    }
  }

  function onClose () {
    accountType = account?.type ?? undefined
    accountName = account?.name ?? ''
    error = ''
    loading = false
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
      {#if !account?.id}
        <Button on:click={() => accountType = undefined}>
          <EpBack />
        </Button>
      {/if}
      <AccountTypeListItem id={accountType} />
    </div>
    {#if error}
      <Alert>{error}</Alert>
    {/if}
    <div class="main">
      <Input label="Name" name="accountName" bind:value={accountName}/>
      {#if accountType === AccountType.BUDGET}
        <BudgetAccountDetails name={accountName} bind:dataObject={additionalBudgetDetails} />
      {:else if accountType === AccountType.SAVING}
        <SavingsAccountDetails bind:dataObject={additionalSavingsDetails} />
      {/if}
      <div><Button disabled={loading} on:click={() => !loading && createAccount()}>
        {account?.id ? 'Update' : 'Create'}
        {#if loading}
          <LoadingSpinner/>
        {/if}
      </Button></div>
    </div>
  {/if}
</Popup>

<style>
  .main {
    width: 100%;
    padding: 5px 0;
  }
  .header {
      margin: 0;
      color: var(--theme-text);
      font-size: larger;
      font-weight: bold;
  }
  .topBar {
    background-color: var(--theme-secondary);
    color: var(--theme-secondary-text);
    display: flex;
    flex-direction: row;
    justify-content: start;
    margin: 10px 0;
    border-radius: 5px;
  }
  .form {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
  }
</style>