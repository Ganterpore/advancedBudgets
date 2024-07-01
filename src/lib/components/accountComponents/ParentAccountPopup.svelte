<script lang="ts">
  import { openPopup } from '$lib/store.js'
  import { invalidate } from '$app/navigation'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'

  let accountName: string
  let error: string
  if (!accountName) accountName = ''

  async function createAccount (account: string) {
    const res = await fetch('/parentAccount', {
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
      await invalidate('data:accounts')
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
    <Input label="Name" name="accountName" autofocus bind:value={accountName}/>
    <Button on:click={() => createAccount(accountName)}>Create</Button>
  </form>
</Popup>