<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Input from '$lib/components/Input.svelte'
  import Popup from '$lib/components/Popup.svelte'
  import Alert from '$lib/components/Alert.svelte'
  import { openPopup, selectedAccount } from '$lib/store.js'
  import { invalidate } from '$app/navigation';

  let transactionName: string
  let transactionValue: number
  let error: string
  if (!transactionName) transactionName = 'Transaction'

  async function createTransaction () {
    const body = {
      amount: transactionValue,
      description: transactionName,
      account: $selectedAccount
    }
    const res = await fetch('/transactions', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const responseBody = await res.json()
    if (res.status === 201) {
      onClose()
      $openPopup = false
      await invalidate('data:values')
    } else {
      error = responseBody.error
    }
  }

  function onClose () {
    transactionName = 'Transaction'
    error = ''
    transactionValue = 0
  }
</script>

<Popup id="transaction" onClose={onClose}>
  <h1 style="margin: 0">Add a transaction</h1>
  {#if error}
    <Alert>{error}</Alert>
  {/if}
  <form class="form">
    <Input name="transactionName" bind:value={transactionName}/>
    <div class="footer">
      <Input type="number" label="Value" name="transactionValue" autofocus bind:value={transactionValue}/>
      <Button on:click={createTransaction} >Create</Button>
    </div>
  </form>
</Popup>

<style>
  .footer {
      display: flex;
      flex-direction: row;
  }
</style>