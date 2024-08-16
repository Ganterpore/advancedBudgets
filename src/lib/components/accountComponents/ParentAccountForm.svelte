<script lang="ts">
  import Button from "$lib/components/sharedComponents/Button.svelte";
  import Input from "$lib/components/sharedComponents/Input.svelte";
  import type { ParentAccount } from '$lib/types/accountTypes'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import { enhance } from '$app/forms';
  import { invalidate } from '$app/navigation'

  export let account: Pick<ParentAccount, 'name'> & Partial<ParentAccount>
  export let onSubmit: () => void
  let error
</script>

<p style="font-style: italic">This should reflect a real world bank account</p>
<form class="form" method="post" action="/parentAccount"
  use:enhance={() => {
    return async ({ result, update }) => {
      if (result.type === 'error') {
        error = result.error.message
      } else {
        await invalidate('data:accounts')
        update()
        onSubmit()
      }
    }
  }}>
  {#if error}<Alert>{error}</Alert>{/if}

  <!-- Used to send the id to the server without showing it to the user-->
  {#if account.id}<input style="display: none" name="id" value={account.id} />{/if}
  <Input label="Name" name="account" autofocus bind:value={account.name}/>
  <Button>Create</Button>
</form>

<style>
  .form {
    width: 100%;
    display: flex;
    flex-direction: column;

  }
</style>