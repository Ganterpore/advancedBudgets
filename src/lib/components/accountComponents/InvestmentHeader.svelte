<script lang="ts">
  import type { Investment } from '$lib/types/accountTypes'
  import { currencyToString } from '$lib/utils'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import InvestmentValueForm from '$lib/components/accountComponents/InvestmentValueForm.svelte'

  export let investment: Investment
  let isOpen = false
  function updateAmount (e: MouseEvent) {
    // Don't also trigger the row click, which navigates to the investment page
    e.stopPropagation()
    isOpen = true
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
<Popup id="investmentValue-{investment.id}" bind:isOpen={isOpen} onClose={() => isOpen = false}>
  <h1 style="margin: 0">{investment.name}</h1>
  {#key isOpen}
    <InvestmentValueForm investment={investment} onSubmit={() => isOpen = false} />
  {/key}
</Popup>

<style>
  p {
    margin: 10px;
    font-size: large;
    color: var(--theme-secondary-text);
    font-weight: bold;
  }
  h1 {
    color: var(--theme-text);
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
