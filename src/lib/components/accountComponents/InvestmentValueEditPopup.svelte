<script lang="ts">
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import LoadingSpinner from '$lib/components/sharedComponents/LoadingSpinner.svelte'
  import type { InvestmentValue } from '$lib/types/accountTypes'
  import type { SubmitFunction } from '@sveltejs/kit'
  import { enhance } from '$app/forms'
  import { invalidateAll } from '$app/navigation'
  import { currencyToString } from '$lib/utils'

  export let value: InvestmentValue
  export let isOpen = false
  // Deleting is blocked for the last remaining value
  export let canDelete = true

  // <input type="datetime-local"> works in local time without a timezone, eg. 2026-11-17T12:30
  const toLocalInput = (date: Date) => {
    const d = new Date(date)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  let amountDollars = value.amount / 100
  let localDate = toLocalInput(value.onDate)
  // Sent to the server as an ISO string, so the server doesn't have to guess the browser's timezone
  $: isoDate = localDate ? new Date(localDate).toISOString() : ''
  let error: string | undefined
  let isLoading = false
  let confirmingDelete = false

  function close () {
    isOpen = false
    confirmingDelete = false
    error = undefined
  }

  const submit: SubmitFunction = () => {
    isLoading = true
    return async ({ result }) => {
      isLoading = false
      if (result.type === 'error') {
        error = result.error.message
      } else {
        await invalidateAll()
        close()
      }
    }
  }
</script>

<Popup id="investmentValueEdit-{value.id}" bind:isOpen={isOpen} onClose={close}>
  <h1 style="margin: 0">Edit Value</h1>
  {#if error}<Alert>{error}</Alert>{/if}

  {#if confirmingDelete}
    <p>Delete the {currencyToString(value.amount)} value from {new Date(value.onDate).toLocaleString()}?</p>
    <form class="actions" method="post" action="?/deleteValue" use:enhance={submit}>
      <input type="hidden" name="valueId" value={value.id} />
      <Button warning disabled={isLoading}>Delete{#if isLoading}<LoadingSpinner/>{/if}</Button>
      <Button secondary type="button" on:click={() => confirmingDelete = false}>Cancel</Button>
    </form>
  {:else}
    <form class="form" method="post" action="?/editValue" use:enhance={submit}>
      <input type="hidden" name="valueId" value={value.id} />
      <input type="hidden" name="onDate" value={isoDate} />
      <Input type="number" step="0.01" label="Value" name="amount" bind:value={amountDollars} />
      <Input type="datetime-local" label="Date" bind:value={localDate} required />
      <Button disabled={isLoading} style="width: 100%">
        Save
        {#if isLoading}<LoadingSpinner/>{/if}
      </Button>
    </form>
    {#if canDelete}
      <Button secondary style="width: 100%; margin-top: 10px" on:click={() => confirmingDelete = true}>Delete value</Button>
    {/if}
  {/if}
</Popup>

<style>
  h1, p {
    color: var(--theme-text);
  }
  p {
    max-width: 40ch;
    text-align: center;
  }
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 30ch;
  }
  .actions {
    display: flex;
    gap: 10px;
  }
</style>
