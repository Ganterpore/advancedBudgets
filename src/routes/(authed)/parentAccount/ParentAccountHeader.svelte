<script lang="ts">
  import { openPopup, selectedParentAccount } from '$lib/store.ts'
  import Button from '$lib/components/Button.svelte'
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
  export let name: string
  export let id: number
  export let value: number = 0
  $: valueNum = value ?? 0
  $: valueString = valueNum >= 0 ? `$${valueNum}` : `-$${Math.abs(valueNum)}`

  async function openChildAccount (id: number) {
    $openPopup = 'childAccount'
    $selectedParentAccount = id
  }
</script>

<div class="header">
  <p>{name}</p>
  <div class="separator" ></div>
  <p>{valueString}</p>
  <Button onClick={() => openChildAccount(id)}>
    <MaterialSymbolsAddRounded/>
  </Button>
</div>

<style>
  .header {
      display: flex;
      justify-content: space-between;
      padding: 0 0 0 20px;
      gap: 5px;
  }
  .separator {
      flex-grow: 1;
  }
</style>