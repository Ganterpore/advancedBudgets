<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Input from '$lib/components/Input.svelte'
  import Popup from '$lib/components/Popup.svelte'
  import Alert from '$lib/components/Alert.svelte'
  import { openPopup, selectedTransactionAccount, selectedTransactionType } from '$lib/store'
  import { invalidate } from '$app/navigation';
  import { TransactionType } from "./types";
  import type { AccountNode, AccountTree } from "../parentAccount/types";
  import type { TransactionData } from "./[type=accountHierarchy]/[id]/+server";

  export let accounts: AccountTree
  let accountList: { name: string, id: number }[]
  $: accountList = Object.values(accounts).reduce((accs: { name: string, id: number }[], parentAccount: AccountNode) => {
    const children = parentAccount.children
    const childAccountList = Object.values(children).map(account => ({ name: `${parentAccount.name}: ${account.name}`, id: account.id }))
    return [...accs, ...childAccountList]
  }, [])
  $: account = $selectedTransactionType === TransactionType.GROUPED_SAVING
    ? Object.values(accounts).find(parentAccount => parentAccount.id === $selectedTransactionAccount)
    : accountList.find(account => account.id === $selectedTransactionAccount)

  let transactionName: string
  let transactionValue: number
  let error: string

  let transferTo = (accountList ?? [])[0]?.id
  let prevTransactionType = $selectedTransactionType
  $: transferAvailable = $selectedTransactionType !== TransactionType.GROUPED_SAVING

  function setDefaultTransferName (transactionType: TransactionType) {
    switch (transactionType) {
      case TransactionType.GROUPED_SAVING:
        return 'Savings Transaction'
      case TransactionType.TRANSFER:
        return 'Transfer'
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
      amount: parseInt((transactionValue * 100).toString()),
      description: transactionName,
      type: $selectedTransactionType
    }
    if ($selectedTransactionType === TransactionType.TRANSFER) body.transferTo = transferTo
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
      <Input type="number" label="Value" name="transactionValue" autofocus bind:value={transactionValue}/>
      <Button on:click={createTransaction} >Create</Button>
    </div>
    {#if transferAvailable}
      <div class="transfer">
        {#if $selectedTransactionType !== TransactionType.TRANSFER}
          <Button on:click={toggleTransfer}>Make it a transfer</Button>
        {:else}
          {account.name} -->
          <select bind:value={transferTo}>
            {#each accountList as accountItem}
              {#if accountItem.id !== account.id}
                <option id={accountItem.id} value={accountItem.id}>{accountItem.name}</option>
              {/if}
            {/each}
          </select>
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