<script lang="ts">
  import { openPopup } from '$lib/store.ts'
  import { accountTypeIcons } from './types'
  export let name
  export let id
  export let type

  $: Icon = type ? accountTypeIcons[type] : undefined
  async function addTransaction () {
    $openPopup = 'transaction'
  }
</script>

<div class="header">
  <div class="icon">
    <svelte:component this={Icon}/>
  </div>
  <p>{name}</p>
<!--  <Button onClick={addTransaction}>-->
<!--    <MaterialSymbolsAddRounded/>-->
<!--  </Button>-->
</div>

<style>
    .icon {
        padding: 10px 25px;
    }
    .header {
        display: flex;
        justify-content: start;
    }
</style>