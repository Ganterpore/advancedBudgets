<script lang="ts">
  import { currencyToString } from '$lib/utils'
  import type { TransactionWithParent } from '$lib/types/transactionTypes'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import DeleteOutlineIcon from '~icons/material-symbols/DeleteOutline';
  import Expandable from '$lib/components/sharedComponents/Expandable.svelte'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import { invalidate } from '$app/navigation'
  import { openPopup } from '$lib/store'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import LoadingSpinner from '$lib/components/sharedComponents/LoadingSpinner.svelte'

  export let transaction: TransactionWithParent
  let deletePopupIsOpen: boolean = false
  let deleteErrorString: string
  let isLoading: boolean = false
  $: valueString = currencyToString(transaction.amount ?? 0)

  async function deleteTransaction () {
    if (isLoading) return
    isLoading = true
    const url = '/transactions'
    const res = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({ transactionId: transaction.id }),
      headers: { 'Content-Type': 'application/json' }
    })
    await invalidate('data:values')
    isLoading = false
    if (res.status === 204) {
      deletePopupIsOpen = false
      $openPopup = false
    } else {
      deleteErrorString = res.body.toString()
    }
  }
</script>

<div class="outer">
  <Expandable >
  <div slot="header" class="container">
    <div>
      <p class="text">{transaction.description}</p>
      <p class="sub-text">{transaction.accountName}</p>
    </div>
    <div>
      <p class="text">{valueString}</p>
      <p class="sub-text">{transaction.transactionTime.toLocaleString()}</p>
    </div>
  </div>
  <form class="actions">
    <Button on:click={() => deletePopupIsOpen = true }>
      <DeleteOutlineIcon/>
    </Button>
  </form>
  </Expandable>
</div>

<Popup id="deleteTransaction" isOpen={deletePopupIsOpen} onClose={() => deletePopupIsOpen = false} >
  {#if deleteErrorString}<Alert>{deleteErrorString}</Alert>{/if}
  <p>Are you sure you want to delete</p>
  <div class="container">
    <div>
      <p class="text">{transaction.description}</p>
      <p class="sub-text">{transaction.accountName}</p>
    </div>
    <div>
      <p class="text">{valueString}</p>
      <p class="sub-text">{transaction.transactionTime.toLocaleString()}</p>
    </div>
  </div>
  <div class="actions">
    <Button disabled={isLoading} on:click={deleteTransaction}>Yes{#if isLoading}<LoadingSpinner/>{/if}</Button>
    <Button secondary on:click={() => deletePopupIsOpen = false }>No</Button>
  </div>
</Popup>

<style>
  .outer {
    display: flex;
    flex-direction: column;
  }
  .container {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 5px;
    font-weight: bold;
  }
  .actions {
    display: flex;
    justify-content: right;
  }
  .text {
    margin: 0;
    padding: 5px;
  }
  .sub-text {
    color: var(--theme-text-light);
    font-size: smaller;
    margin: 0;
    padding: 5px;
  }
</style>