<script lang="ts">
  import { openPopup } from '$lib/store.js'
  import { invalidate } from '$app/navigation'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import type { ParentAccount } from '$lib/types/accountTypes'

  export let account: Pick<ParentAccount, 'name'> & Partial<ParentAccount> = {
    name: ''
  }
  let error: string

  async function createAccount () {
    const res = await fetch('/parentAccount', {
      method: 'POST',
      body: JSON.stringify({ account: account.name, id: account.id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const body = await res.json()
    if (res.status === 201) {
      if (!account.id) {
        account.name = ''
      }
      error = ''
      $openPopup = false
      await invalidate('data:accounts')
    } else {
      error = body.error
    }
  }

  function onClose () {
    if (!account.id) {
      account.name = ''
    }
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
    <Input label="Name" name="accountName" autofocus bind:value={account.name}/>
    <Button on:click={() => createAccount()}>Create</Button>
  </form>
</Popup>