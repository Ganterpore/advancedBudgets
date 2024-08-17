<script lang="ts">
  import type { Investment } from '$lib/types/accountTypes'
  import { currencyToString } from '$lib/utils'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded'
  import ParentAccountPopup from '$lib/components/accountComponents/ParentAccountPopup.svelte'

  export let investment: Investment
  let isOpen = false
  function updateAmount () {
    isOpen = !isOpen
  }
</script>

<div class="header">
  <p>{investment.name}</p>
  <div class="separator" ></div>
  <p>{currencyToString(investment.amount)}</p>
  <Button on:click={updateAmount}>
    <MaterialSymbolsAddRounded/>
  </Button>
</div>
<ParentAccountPopup bind:isOpen={isOpen} bind:investment={investment}/>

<style>
  p {
    margin: 10px;
    font-size: large;
    color: var(--theme-secondary-text);
    font-weight: bold;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 0 20px;
    gap: 5px;
  }
  .separator {
    flex-grow: 1;
  }
</style>