<script lang="ts">
  import { openPopup, selectedTransactionAccount, selectedTransactionType } from '$lib/store'
  import { invalidate } from '$app/navigation';
  import { currencyToString } from "$lib/utils";
  import type { AccountNode, AccountTree } from '$lib/types/accountTypes'
  import type { TransactionData } from '../../../routes/(authed)/transactions/[type=accountHierarchy]/[id]/+server'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import { TransactionType } from '$lib/types/transactionTypes'
  import AllAccountsDropdown from '$lib/components/accountComponents/AllAccountsDropdown.svelte'

  export let accounts: AccountTree
  let accountList: { name: string, id: number }[]
  $: accountList = Object.values(accounts ?? {}).reduce((accs: { name: string, id: number }[], parentAccount: AccountNode) => {
    const children = parentAccount.children
    const childAccountList = Object.values(children).map(account => ({ ...account, concatName: `${parentAccount.name}: ${account.name}` }))
    return [...accs, ...childAccountList]
  }, [])
  $: account = $selectedTransactionType === TransactionType.GROUPED_SAVING
    ? Object.values(accounts).find(parentAccount => parentAccount.id === $selectedTransactionAccount)
    : accountList.find(account => account.id === $selectedTransactionAccount)

  let transactionName: string
  let transactionValue: number | string | undefined
  let previousTransactionValue: number | string | undefined
  function onNegativePressed (event: InputEvent) {
    if (event.data === '-') {
      if (!previousTransactionValue|| previousTransactionValue === '0') {
        transactionValue = '-0'
      } else if (previousTransactionValue === '-0') {
        transactionValue = '0'
      } else {
        transactionValue = -1 * previousTransactionValue
      }
    }
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
  let prevTransactionType = $selectedTransactionType
  const transferableTypes = [TransactionType.INDIVIDUAL, TransactionType.TRANSFER]
  $: transferAvailable = transferableTypes.includes($selectedTransactionType)
  $: isTransferring = $selectedTransactionType === TransactionType.TRANSFER || ($selectedTransactionType === TransactionType.COMPLETION && actualValue !== account?.additionalAccountData?.target)

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
  $: transactionName = setDefaultTransferName($selectedTransactionType)

  function toggleTransfer () {
    if ($selectedTransactionType === TransactionType.TRANSFER) {
      selectedTransactionType.set(prevTransactionType)
    } else {
      prevTransactionType = $selectedTransactionType
      selectedTransactionType.set(TransactionType.TRANSFER)
    }
  }

  async function createTransaction () {
    const body: TransactionData = {
      amount: actualValue,
      description: transactionName,
      type: $selectedTransactionType
    }
    if ([TransactionType.TRANSFER, TransactionType.COMPLETION].includes($selectedTransactionType)) body.transferTo = transferTo
    const url = `/transactions/${ $selectedTransactionType === TransactionType.GROUPED_SAVING ? 'parentAccount' : 'account' }/${$selectedTransactionAccount}`
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:values')
    const responseBody = await res.json()
    if (res.status === 201) {
      onClose()
      $openPopup = false
    } else {
      error = responseBody.message
    }
  }

  function onClose () {
    transactionName = 'Transaction'
    error = ''
    transactionValue = 0
    $selectedTransactionAccount = 0
    $selectedTransactionType = TransactionType.UNSELECTED
  }
</script>

<Popup id="transaction" onClose={onClose}>
  <h1 style="margin: 0">Transaction on {account.name}</h1>
  {#if error}
    <Alert>{error}</Alert>
  {/if}
  <form class="form">
    <Input name="transactionName" bind:value={transactionName}/>
    <div class="footer">
      <Input type="number" step="0.01" name="transactionValue" autofocus
             label={$selectedTransactionType === TransactionType.COMPLETION ? "Actual Cost" : "Value"}
             bind:value={transactionValue} on:input={onNegativePressed}/>
      <Button on:click={createTransaction} >Create</Button>
    </div>

    {#if transferAvailable && !isTransferring}
      <div class="transfer">
          <Button on:click={toggleTransfer}>Make it a transfer</Button>
      </div>
    {/if}
    {#if isTransferring}
      {#if $selectedTransactionType === TransactionType.COMPLETION}
        <p style="text-align: center">
          Transfer the remaining {currencyToString(Math.abs(account?.additionalAccountData?.target - actualValue))}
          {account?.additionalAccountData?.target - actualValue > 0 ? 'to' : 'from'}
        </p>
      {/if}
      <div class="transfer">
        {account.name}
        {#if !transactionValue || transactionValue >= 0}
          <p>--></p>
        {:else}
          <p>{'<--'}</p>
        {/if}
        <AllAccountsDropdown accounts={accounts}  bind:selectedAccount={transferTo} accountsToIgnore={[account.id]} />
        {#if transferAvailable}
          <Button on:click={toggleTransfer}>X</Button>
        {/if}
      </div>
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