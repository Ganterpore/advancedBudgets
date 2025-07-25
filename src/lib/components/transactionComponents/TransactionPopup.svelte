<script lang="ts">
  import { openPopup } from '$lib/store'
  import { invalidate } from '$app/navigation';
  import { currencyToString } from "$lib/utils";
  import type { Account, AccountTree, ParentAccount } from '$lib/types/accountTypes'
  import type { TransactionData } from '../../../routes/(authed)/transactions/[type=accountHierarchy]/[id]/+server'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import { TransactionType } from '$lib/types/transactionTypes'
  import AllAccountsDropdown from '$lib/components/accountComponents/AllAccountsDropdown.svelte'
  import LoadingSpinner from '$lib/components/sharedComponents/LoadingSpinner.svelte'

  export let isOpen: boolean
  export let onClose: () => void
  export let accounts: AccountTree | undefined
  export let account: Account | ParentAccount
  export let transactionId: number | undefined = undefined
  export let transactionName: string = ''
  export let transactionValue: number | string | undefined = ''
  export let selectedTransactionType: TransactionType
  let isLoading = false
  let accountList: { name: string, id: number }[]

  let previousTransactionValue: number | string | undefined = ''
  function switchValueSign () {
    if (!previousTransactionValue || previousTransactionValue === '0') {
      transactionValue = '-0'
    } else if (previousTransactionValue === '-0') {
      transactionValue = '0'
    } else {
      transactionValue = -1 * previousTransactionValue
    }
    previousTransactionValue = transactionValue
  }
  function onButtonPressed (event: InputEvent) {
    if (event.data === '-') switchValueSign()
    previousTransactionValue = transactionValue
  }
  function removeLeadingZeros (n: number | string | undefined) {
    if (!n) return 0
    if (typeof n === 'number') return n
    if ((n.startsWith('0') || n.startsWith('-0') ) && Number(n) !== 0) {
      return Number(n)
    }
    return n
  }
  $: transactionValue = removeLeadingZeros(transactionValue)
  $: actualValue = parseInt((Number(transactionValue) * 100).toString())
  let error: string

  let transferTo = (accountList ?? [])[0]?.id
  let prevTransactionType = selectedTransactionType
  const transferableTypes = [TransactionType.INDIVIDUAL, TransactionType.TRANSFER]
  $: transferAvailable = transferableTypes.includes(selectedTransactionType) && accounts !== undefined
  $: isTransferring = selectedTransactionType === TransactionType.TRANSFER || (selectedTransactionType === TransactionType.COMPLETION && actualValue !== account?.additionalAccountData?.target)

  function setDefaultTransferName (transactionType: TransactionType) {
    switch (transactionType) {
      case TransactionType.GROUPED_SAVING:
        return 'Savings Transaction'
      case TransactionType.TRANSFER:
        return 'Transfer'
      case TransactionType.COMPLETION:
        return 'Savings purchase'
      case TransactionType.UNSELECTED:
        return ''
      case TransactionType.INDIVIDUAL:
      default:
        return 'Transaction'
    }
  }
  $: transactionName = setDefaultTransferName(selectedTransactionType)

  function toggleTransfer () {
    if (selectedTransactionType === TransactionType.TRANSFER) {
      selectedTransactionType = prevTransactionType
    } else {
      prevTransactionType = selectedTransactionType
      selectedTransactionType = TransactionType.TRANSFER
    }
  }

  function convertCompletionToIndividual () {
    selectedTransactionType = TransactionType.INDIVIDUAL
    switchValueSign()
  }

  async function createOrUpdateTransaction () {
    if (isLoading) return
    isLoading = true
    const body: TransactionData = {
      amount: actualValue,
      description: transactionName,
      type: selectedTransactionType
    }
    if (transactionId) body.id = transactionId
    if (([TransactionType.TRANSFER, TransactionType.COMPLETION] as TransactionType[]).includes(selectedTransactionType)) body.transferTo = transferTo
    const url = `/transactions/${ selectedTransactionType === TransactionType.GROUPED_SAVING ? 'parentAccount' : 'account' }/${account.id}`
    const res = await fetch(url, {
      method: transactionId ? 'PUT' : 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:values')
    const responseBody = await res.json()
    isLoading = false
    if (res.status === 201) {
      onCloseWrapped()
      $openPopup = false
    } else {
      error = responseBody.message
    }
  }

  function onCloseWrapped () {
    isLoading = false
    error = ''
    if (transactionId) return onClose()
    transactionName = 'Transaction'
    transactionValue = 0
    previousTransactionValue = undefined
    onClose()
  }
</script>

<Popup isOpen={isOpen} id="transaction" onClose={onCloseWrapped}>
  <h1 style="margin: 0">Transaction on {account.name}</h1>
  {#if error}
    <Alert>{error}</Alert>
  {/if}
  <form class="form">
    <Input name="transactionName" bind:value={transactionName}/>
    <div class="footer">
      <Input type="number" step="0.01" name="transactionValue" autofocus
             label={selectedTransactionType === TransactionType.COMPLETION ? "Actual Cost" : "Value"}
             bind:value={transactionValue} on:input={onButtonPressed}/>
      <Button disabled={isLoading} on:click={createOrUpdateTransaction} >
        {#if transactionId}Update{:else}Create{/if}{#if isLoading}<LoadingSpinner/>{/if}
      </Button>
    </div>
    {#if !transactionId}
      {#if transferAvailable && !isTransferring}
        <div class="transfer">
            <Button on:click={toggleTransfer}>Make it a transfer</Button>
        </div>
      {/if}
      {#if isTransferring}
          <p style="text-align: center">
            {#if selectedTransactionType === TransactionType.COMPLETION}
              Transfer the remaining {currencyToString(Math.abs(account?.additionalAccountData?.target - actualValue))}
              {account?.additionalAccountData?.target - actualValue > 0 ? 'to' : 'from'}
            {/if}
            { !transactionValue || transactionValue >= 0 ? 'To' : 'From' }
          </p>
        <div class="transfer">
          <AllAccountsDropdown accounts={accounts} bind:selectedAccount={transferTo} accountsToIgnore={[account.id]} />
          {#if transferAvailable}
            <Button on:click={toggleTransfer}>X</Button>
          {/if}
        </div>
        {#if selectedTransactionType === TransactionType.COMPLETION}
          <div class="transfer">
            <Button on:click={convertCompletionToIndividual}>Reopen the account instead</Button>
          </div>
        {/if}
      {/if}
    {/if}
  </form>
</Popup>

<style>
  .footer {
      display: flex;
      flex-direction: row;
  }
  .transfer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
  }
</style>