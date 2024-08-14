<script lang="ts">
  import BottomNavigation from "$lib/components/sharedComponents/BottomNavigation.svelte";
  import FrequencySelector from "$lib/components/timeSelectors/FrequencySelector.svelte";
  import {frequencyDetailsToString} from "$lib/dayOfWeekFunctons";
  import {currencyToString} from "$lib/utils";
  import SavingsProgress from "$lib/components/accountComponents/SavingsProgress.svelte";
  import BucketAssignment from "$lib/components/budgetComponents/BucketAssignment.svelte";
  import type { BudgetExcess } from '$lib/types/budgetTypes'
  import { invalidate } from '$app/navigation'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import AppBar from '$lib/components/sharedComponents/AppBar.svelte'
  import Expandable from '$lib/components/sharedComponents/Expandable.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'

  export let data
  $: ({ totals, isReadyToRelease, budget, budgetStartDate, budgetEndDate, amountToNeeds, amountToWants, excess, excessAccounts, parentTransactions, transactions } = data)
  $: maxNeeds = amountToNeeds.reduce((total, curr) => total + curr.maxAmountToAdd, 0)
  $: currentNeeds = amountToNeeds.reduce((total, curr) => total + curr.actualAmountAdded, 0)
  $: maxWants = amountToWants.reduce((total, curr) => total + curr.maxAmountToAdd, 0)
  $: currentWants = amountToWants.reduce((total, curr) => total + curr.actualAmountAdded, 0)

  let isEditing = false
  let isReleasingBudget = false
  let error

  async function edit () {
    if (isEditing) {
      await fetch('', {
        method: 'POST',
        body: JSON.stringify(budget),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      await invalidate('data:budget')
    }
    isEditing = !isEditing
  }
  async function releaseBudget () {
    if (isReleasingBudget && isReadyToRelease) {
      const res = await fetch('transactions', {
        method: 'POST',
        body: JSON.stringify(transactions),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      await invalidate('data:values')
      // TODO add error handling
      if(res.ok) {
        budget.lastBudget = new Date()
        await fetch('', {
          method: 'POST',
          body: JSON.stringify(budget),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        await invalidate('data:budget')
      } else {
        const body = await res.json()
        error = body.error ?? body.message
      }
    }
    isReleasingBudget = !isReleasingBudget
  }
  async function addExcessAccount (accountId: number) {
    const excess: Omit<BudgetExcess, 'id'|'user'> = {
      account: accountId,
      proportion: 10
    }
    await fetch('budget/excessAccount', {
      method: 'POST',
      body: JSON.stringify(excess),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:excess')
  }
  async function updateExcessAccount (excess: BudgetExcess) {
    await fetch('budget/excessAccount', {
      method: 'POST',
      body: JSON.stringify(excess),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:excess')
  }
  async function deleteExcessAccount (accountId: number) {
    await fetch('budget/excessAccount', {
      method: 'DELETE',
      body: JSON.stringify({ id: accountId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:excess')
  }
</script>

<AppBar title="Budget"
        subtext="{frequencyDetailsToString(budget)}"
        rightButtons={[{ name: isEditing ? 'Save' : 'Edit', action: edit }]}/>

<div class="header">
  <div class="frequency">
    {#if isEditing}
      <p><FrequencySelector bind:value={budget.frequency} bind:type={budget.frequencyCategory} bind:daysOf={budget.dayOf}/></p>
    {/if}
  </div>
</div>

<p>Your next budget starts on {budgetStartDate.toDateString()}. You have earned {currencyToString(data.incomeSinceLast)} since your last budget</p>

<div class="main">
  <div class="title"><h3>Budget</h3>{currencyToString(currentNeeds + currentWants)}</div>
  <Expandable name="Needs">
    <div slot="header" class="progress">
      <p>{((currentNeeds / maxNeeds) * 100).toFixed(2)}% progress towards {currencyToString(maxNeeds)}</p>
      <SavingsProgress savingsGoal={maxNeeds} currentValue={currentNeeds} />
    </div>
    <div style="padding-left: 25px">{#each amountToNeeds as need}
      <p>{currencyToString(need.actualAmountAdded)} to {need.parentName}: {need.name}
        to bring it up to {currencyToString((totals[need.parent]?.children[need.id] ?? 0) + need.actualAmountAdded)}</p>
    {/each}</div>
  </Expandable>
  <hr/>
  <Expandable name="Wants">
    <div slot="header" class="progress">
      <p>{((currentWants / maxWants) * 100).toFixed(2)}% progress towards ({currencyToString(maxWants)})</p>
        <SavingsProgress savingsGoal={maxWants} currentValue={currentWants} />
    </div>
    <div style="padding-left: 25px">{#each amountToWants as want}
      <p>{currencyToString(want.actualAmountAdded)} to {want.parentName}: {want.name}
        to bring it up to {currencyToString((totals[want.parent]?.children[want.id] ?? 0) + want.actualAmountAdded)}</p>
    {/each}</div>
  </Expandable>

  <div class="title"><h3>Excess</h3>{currencyToString(excess)}</div>
  <BucketAssignment allAccounts={data.accounts} excessAccounts={excessAccounts}
                    addAccountCallback={addExcessAccount} updateAccountCallback={updateExcessAccount}
                    removeAccountCallback={deleteExcessAccount} />
  {#if isReadyToRelease}
    <div class="title"><h3>Final Steps</h3></div>
    <div class="release-box">
      {#if error}
        <Alert>{error}</Alert>
      {/if}
      {#if isReleasingBudget}
        <p>In Order to release your budget you will need to make the following physical transactions between your accounts:</p>
        {#each parentTransactions as t}
          <p>Transfer {currencyToString(t.amount)} from {t.from} to {t.to}</p>
        {/each}
      {/if}
      {#if !isReleasingBudget}
        <Button warning={true} secondary={true} on:click={releaseBudget}>Prepare Budget Release</Button>
      {/if}
      {#if isReleasingBudget}
        <div class="button-array">
          <Button style="flex-grow: 1" warning={true} on:click={releaseBudget}>Release budget</Button>
          <Button secondary={true} on:click={() => isReleasingBudget=false}>Cancel</Button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<BottomNavigation selected="budget"/>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
  }
  .title {
    background-color: var(--theme-secondary);
    color: var(--theme-secondary-text);
    font-size: 32px;

    font-weight: bold;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .title h3 {
    margin: 0;
    padding: 0 0 0 20px;
  }
  .main {
    background: var(--theme-plain);
    display: flex;
    flex-direction: column;
  }
  .release-box {
    display: flex;
    flex-direction: column;
    margin: 5px;
  }
  .progress {
    flex-grow: 1;
  }
  .progress p {
    text-align: center;
  }
  .frequency {
    display: flex;
    flex-direction: row;
    float: right;
  }
  .button-array {
    display: flex;
    flex-direction: row;
  }
  hr {
    border-radius: 5px;
    border-color: var(--theme-plain);
    width: 95%;
  }
</style>