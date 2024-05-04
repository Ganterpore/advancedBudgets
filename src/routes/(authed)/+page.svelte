<script lang="ts">
  import Popup from '$lib/components/Popup.svelte'
  import Input from '$lib/components/Input.svelte'
  import Button from '$lib/components/Button.svelte'
  import Alert from '$lib/components/Alert.svelte'
  import { openPopup } from '$lib/store.ts'

  let accountName: string
  let error: string
  if (!accountName) accountName = ''

  async function createAccount (account: string) {
    const res = await fetch('/account', {
      method: 'POST',
      body: JSON.stringify({ account }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const body = await res.json()
    if (res.status === 201) {
      accountName = ''
      error = ''
      $openPopup = false
    } else {
      error = body.error
    }
  }

  function onClose () {
    accountName = ''
    error = ''
  }
</script>

<Popup id="newAccount" onClose={onClose}>
    <h1 style="margin: 0">Create a new account</h1>
    <p style="font-style: italic">This should reflect a real world bank account</p>
    {#if error}
        <Alert>{error}</Alert>
    {/if}
    <form class="form">
        <p>Name:</p>
        <Input name="accountName" bind:value={accountName}/>
        <Button onClick={() => createAccount(accountName)} preventDefault>Create</Button>
    </form>
</Popup>

<style>
    .form {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center
    }
</style>
