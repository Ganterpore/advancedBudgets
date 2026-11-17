<script lang="ts">
  import Button from "$lib/components/sharedComponents/Button.svelte";
  import Input from "$lib/components/sharedComponents/Input.svelte";
  import type { ParentAccount } from '$lib/types/accountTypes'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import { enhance } from '$app/forms';
  import { invalidate } from '$app/navigation'
  import LoadingSpinner from '$lib/components/sharedComponents/LoadingSpinner.svelte'

  export let account: Pick<ParentAccount, 'name'> & Partial<ParentAccount>
  export let onSubmit: () => void
  // When true, submitting converts the existing debt account back into a normal account
  export let removeDebt = false
  let error
  let isLoading = false
</script>

<p style="font-style: italic">This should reflect a real world bank account</p>
{#if removeDebt}
  <p style="font-style: italic; max-width: 50ch; text-align: center">Saving will convert this debt back into a normal account. The debt details (principal, interest and repayments) will be removed, but all child accounts and transactions are kept.</p>
{/if}
<form class="form" method="post" action="/parentAccount"
  use:enhance={() => {
    isLoading = true
    return async ({ result, update }) => {
      isLoading = false
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
  {#if removeDebt}<input style="display: none" name="removeDebt" value="true" />{/if}
  <Input label="Name" name="account" bind:value={account.name}/>
  <Button disabled={isLoading}>
    {removeDebt ? 'Convert to Account' : account.id ? 'Update' : 'Create'}
    {#if isLoading}<LoadingSpinner/>{/if}
  </Button>
</form>

<style>
  .form {
    width: 100%;
    display: flex;
    flex-direction: column;

  }
</style>