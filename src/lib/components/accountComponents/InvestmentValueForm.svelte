<script lang="ts">
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import LoadingSpinner from '$lib/components/sharedComponents/LoadingSpinner.svelte'
  import type { Investment } from '$lib/types/accountTypes'
  import { enhance } from '$app/forms'
  import { invalidate } from '$app/navigation'

  export let investment: Investment
  export let onSubmit: () => void
  let error: string | undefined
  let isLoading = false
  let amountDollars = investment.amount / 100
</script>

<form class="form" method="post" action="/investment/{investment.id}?/value"
  use:enhance={() => {
    isLoading = true
    return async ({ result }) => {
      isLoading = false
      if (result.type === 'error') {
        error = result.error.message
      } else {
        error = undefined
        await invalidate('data:accounts')
        onSubmit()
      }
    }
  }}>
  {#if error}<Alert>{error}</Alert>{/if}
  <Input type="number" step="0.01" label="Current Value" name="amount" bind:value={amountDollars}/>
  <Button disabled={isLoading} style="width: 100%">
    Update
    {#if isLoading}<LoadingSpinner/>{/if}
  </Button>
</form>

<style>
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 30ch;
  }
</style>
