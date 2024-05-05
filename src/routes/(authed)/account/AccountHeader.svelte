<script lang="ts">
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
  import { openPopup, selectedAccount } from '$lib/store.ts'
  import { accountTypeIcons } from './types'
  import Button from '$lib/components/Button.svelte'
  export let id
  export let name
  export let type

  $: Icon = type ? accountTypeIcons[type] : undefined
  async function addTransaction () {
    $openPopup = 'transaction'
    $selectedAccount = id
  }
</script>

<div class="header">
  <div class="icon">
    <svelte:component this={Icon}/>
  </div>
  <p>{name}</p>
  <div class="separator" ></div>
  <Button onClick={addTransaction}>
    <MaterialSymbolsAddRounded/>
  </Button>
</div>

<style>
    .icon {
        padding: 10px 25px;
    }
    .header {
        display: flex;
        justify-content: start;
    }
    .separator {
        flex-grow: 1;
    }
</style>