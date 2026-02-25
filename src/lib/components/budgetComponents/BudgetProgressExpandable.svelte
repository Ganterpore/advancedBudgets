<script>
  import {currencyToString} from "$lib/utils";
  import Expandable from "$lib/components/sharedComponents/Expandable.svelte";

  export let name
  export let currentAmount
  export let neededAmount
  export let budgetItems
</script>

<Expandable name={name}>
  <div slot="header" class="progress">
    <div class="header-text">
      <div style="flex-grow: 1"></div>
      <p class="additional-info">{currencyToString(currentAmount)}</p>
      <p>{((currentAmount / neededAmount) * 100).toFixed(2)}%</p>
      <div style="flex-grow: 1"></div>
      {currencyToString(neededAmount)}
    </div>
  </div>
  <div>{#each budgetItems as need}
    <div class="budgetList">
      <p>{need.parentName}: {need.name}</p>
      <div style="flex-grow: 1"></div>
      <p class="additional-info">{currencyToString(need.actualAmountAdded)}</p>
      {#if need.budgetAmount > need.maxAmountToAdd}
        <p class="special-info">{currencyToString(need.budgetAmount - need.maxAmountToAdd)} saved!</p>
      {/if}
      <div style="flex-grow: 1"></div>
      <p>{currencyToString(need.maxAmountToAdd)}</p>
    </div>
  {/each}</div>
</Expandable>


<style>
  .progress {
    flex-grow: 1;
  }
  .header-text {
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 5px;
  }
  .additional-info {
    font-style: italic;
    font-size: smaller;
    align-self: center;
    color: var(--theme-text-light);
  }
  .special-info {
    color: var(--theme-highlight);
  }
  .budgetList {
    padding-left: 25px;
    padding-right: 5px;
    display: flex;
    flex-direction: row;
  }
  p {
    padding: 0;
    margin: 2px;
  }
</style>