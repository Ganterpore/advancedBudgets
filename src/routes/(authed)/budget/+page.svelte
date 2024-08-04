<script>
  import BottomNavigation from "$lib/components/sharedComponents/BottomNavigation.svelte";
  import FrequencySelector from "$lib/components/timeSelectors/FrequencySelector.svelte";
  import {frequencyDetailsToString} from "$lib/dayOfWeekFunctons";
  import {currencyToString} from "$lib/utils";
  import SavingsProgress from "$lib/components/accountComponents/SavingsProgress.svelte";

  export let data
  const { budget, budgetStartDate, amountToNeeds, amountToWants, excess } = data
  const maxNeeds = amountToNeeds.reduce((total, curr) => total + curr.maxAmountToAdd, 0)
  const currentNeeds = amountToNeeds.reduce((total, curr) => total + curr.actualAmountAdded, 0)
  const maxWants = amountToWants.reduce((total, curr) => total + curr.maxAmountToAdd, 0)
  const currentWants = amountToWants.reduce((total, curr) => total + curr.actualAmountAdded, 0)

  let isEditing = false

  async function edit () {
    if (isEditing) {
      await fetch('', {
        method: 'POST',
        body: JSON.stringify(budget),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    isEditing = !isEditing
  }
</script>

<h2>Budget</h2>

<div class="frequency">
  {#if isEditing}
    <p><FrequencySelector bind:value={budget.frequency} bind:type={budget.frequencyCategory} bind:daysOf={budget.dayOf}/></p>
  {:else}
    <p>{frequencyDetailsToString(budget)}</p>
  {/if}
  <button on:click={edit}>{isEditing ? 'Save' : 'Edit'}</button>
</div>

Your next budget starts on {budgetStartDate.toDateString()}
<br>
Income since your last budget: {currencyToString(data.incomeSinceLast)}

<div class="main">
  <div class="progress">
    <p>{((currentNeeds / maxNeeds) * 100).toFixed(2)}% progress to achieving budgeted needs ({currencyToString(maxNeeds)})</p>
    <SavingsProgress savingsGoal={maxNeeds} currentValue={currentNeeds} />
  </div>
  <div class="progress">
    <p>{((currentWants / maxWants) * 100).toFixed(2)}% progress to achieving budgeted wants ({currencyToString(maxWants)})</p>
    <SavingsProgress savingsGoal={maxWants} currentValue={currentWants} />
  </div>
</div>

<br>
You have {currencyToString(excess)} to spend anywhere you'd like

<BottomNavigation/>

<style>
  .main {
    background: var(--theme-plain);
    display: flex;
    flex-direction: column;
  }
  .progress {
    flex-grow: 1;
  }
  .frequency {
    display: flex;
    flex-direction: row;
    float: right;
  }
</style>