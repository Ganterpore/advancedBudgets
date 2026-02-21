<script lang="ts">
  import type { Debt } from '$lib/types/accountTypes'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import { enhance } from '$app/forms'
  import { invalidate } from '$app/navigation'
  import LoadingSpinner from '$lib/components/sharedComponents/LoadingSpinner.svelte'
  import DebtForm from '$lib/components/mortgageComponents/DebtForm.svelte'

  export let debt: Omit<Debt, 'id'|'user'|'parent'|'nominatedAccount'> & Partial<Debt>
  export let onSubmit: () => void
  let error
  let isLoading = false
</script>

<form class="form" method="post" action="/accounts/debt"
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
  <p class="subText">A Debt that needs to be paid off (eg. house, car)</p>
  {#if error}<Alert>{error}</Alert>{/if}
  <!-- Used to send the id to the server without showing it to the user-->
  {#if debt.id}<input style="display: none" name="id" value={debt.id} />{/if}
  <DebtForm debt={debt} />
  <Button disabled={isLoading} style="width: 100%">
    {debt.id ? 'Update' : 'Create'}
    {#if isLoading}<LoadingSpinner/>{/if}
  </Button>
</form>

<style>
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .subText {
    padding: 20px;
  }
  p {
    font-style: italic;
    margin: 0 0 20px 0;
    padding: 0;
    text-align: center;
    max-width: 80ch;
  }
</style>