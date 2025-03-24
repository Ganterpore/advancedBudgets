<script>
  import {currencyToString} from "$lib/utils";
  import Expandable from "$lib/components/sharedComponents/Expandable.svelte";
  import SavingsProgress from "$lib/components/accountComponents/SavingsProgress.svelte";

  export let name
  export let currentAmount
  export let neededAmount
  export let budgetItems
</script>

<Expandable name={name}>
  <div slot="header" class="progress">
    <div class="header-text">
      <p>{((currentAmount / neededAmount) * 100).toFixed(2)}%</p>
      <p class="additional-info">{currencyToString(neededAmount)}</p>
    </div>
    <SavingsProgress savingsGoal={neededAmount} currentValue={currentAmount} />
  </div>
  <div>{#each budgetItems as need}
    <div class="budgetList">
      <p>{need.parentName}: {need.name}</p>
      <div style="flex-grow: 1"></div>
      <div>
      {#if need.actualAmountAdded < need.maxAmountToAdd}
        <p>{currencyToString(need.actualAmountAdded)}</p>
        <p class="additional-info">{currencyToString(need.maxAmountToAdd)}</p>
      {:else}
        <p>{currencyToString(need.maxAmountToAdd)}</p>
      {/if}
      </div>
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