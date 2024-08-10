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

  export let data
  $: ({ totals, isReadyToRelease, budget, budgetStartDate, budgetEndDate, amountToNeeds, amountToWants, excess, excessAccounts, parentTransactions, transactions } = data)
  $: maxNeeds = amountToNeeds.reduce((total, curr) => total + curr.maxAmountToAdd, 0)
  $: currentNeeds = amountToNeeds.reduce((total, curr) => total + curr.actualAmountAdded, 0)
  $: maxWants = amountToWants.reduce((total, curr) => total + curr.maxAmountToAdd, 0)
  $: currentWants = amountToWants.reduce((total, curr) => total + curr.actualAmountAdded, 0)

  let isEditing = false
  let isReleasingBudget = false

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
    <div style="padding-left: 25px">{#each amountToNeeds as need}
      <p>{currencyToString(need.actualAmountAdded)} being added to {need.parentName}: {need.name}
      to bring it up to {currencyToString((totals[need.parent]?.children[need.id] ?? 0) + need.actualAmountAdded)}</p>
    {/each}</div>
  </div>
  <div class="progress">
    <p>{((currentWants / maxWants) * 100).toFixed(2)}% progress to achieving budgeted wants ({currencyToString(maxWants)})</p>
    <SavingsProgress savingsGoal={maxWants} currentValue={currentWants} />
    <div style="padding-left: 25px">{#each amountToWants as want}
      <p>{currencyToString(want.actualAmountAdded)} being added to {want.parentName}: {want.name}
        to bring it up to {currencyToString((totals[want.parent]?.children[want.id] ?? 0) + want.actualAmountAdded)}</p>
    {/each}</div>
  </div>
</div>

<br>
Your excess {currencyToString(excess)} will be distributed to the accounts as follows
<BucketAssignment allAccounts={data.accounts} excessAccounts={excessAccounts}
  addAccountCallback={addExcessAccount} updateAccountCallback={updateExcessAccount}
  removeAccountCallback={deleteExcessAccount} />

{#if isReleasingBudget}
  <p>In Order to release your budget you will need to make the following physical transactions between your accounts:</p>
  {#each parentTransactions as t}
    <p>Transfer {currencyToString(t.amount)} from {t.from} to {t.to}</p>
  {/each}
{/if}
{#if isReadyToRelease}
  <Button on:click={releaseBudget}>{isReleasingBudget ? 'Release budget' : 'Prepare Budget Release'}</Button>
{/if}

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