<script lang="ts">
  import BottomNavigation from "$lib/components/sharedComponents/BottomNavigation.svelte";
  import FrequencySelector from "$lib/components/timeSelectors/FrequencySelector.svelte";
  import {currencyToString} from "$lib/utils";
  import SavingsProgress from "$lib/components/accountComponents/SavingsProgress.svelte";
  import BucketAssignment from "$lib/components/sharedComponents/BucketAssignment.svelte";
  import type { BudgetExcess, BudgetSavings } from '$lib/types/budgetTypes'
  import { invalidate } from '$app/navigation'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import AppBar from '$lib/components/sharedComponents/AppBar.svelte'
  import Expandable from '$lib/components/sharedComponents/Expandable.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import { FrequencyCategory } from '$lib/types/sharedTypes'
  import type { AccountNode } from '$lib/types/accountTypes'

  export let data
  $: ({ incomeOnAccounts, investmentIncome, totals, isReadyToRelease, budget, budgetStartDate, budgetEndDate, amountToNeeds, amountToWants, excess, savingsAccounts, excessAccounts, parentTransactions, transactions } = data)
  $: maxNeeds = amountToNeeds.reduce((total, curr) => total + curr.maxAmountToAdd, 0)
  $: currentNeeds = amountToNeeds.reduce((total, curr) => total + curr.actualAmountAdded, 0)
  $: maxWants = amountToWants.reduce((total, curr) => total + curr.maxAmountToAdd, 0)
  $: currentWants = amountToWants.reduce((total, curr) => total + curr.actualAmountAdded, 0)

  let isEditing = false
  let isReleasingBudget = false
  let error

  function allBuckets (): { id: string, name: string, plannedAmount: number, actualAmount: number }[] {
    const accountList = Object.values(data.accounts ?? {}).reduce((accs: { name: string, id: number }[], parentAccount: AccountNode) => {
      const children = parentAccount.children
      const childAccountList = Object.values(children).map(account => ({ id: `account_${account.id}`, name: `${parentAccount.name}: ${account.name}` }))
      return [...accs, ...childAccountList]
    }, [])
    const investmentList = data.investments.map(inv => ({ id: `investment_${inv.id}`, name: inv.name }))
    return [...accountList, ...investmentList]
  }

  async function edit () {
    if (isEditing) {
      // Reset the last budget to a recent instance of the budget when changed
      const prevBudgetDate = new Date()
      switch (budget.frequencyCategory) {
        case FrequencyCategory.MONTHLY:
          prevBudgetDate.setMonth(prevBudgetDate.getMonth() - budget.frequency)
          break
        case FrequencyCategory.WEEKLY:
          prevBudgetDate.setDate(prevBudgetDate.getDate() - budget.frequency * 7)
          break
        case FrequencyCategory.DAILY:
          prevBudgetDate.setDate(prevBudgetDate.getDate() - budget.frequency)
          break
      }
      budget.lastBudget = prevBudgetDate
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
  async function addSavingsAccount (accountId: string) {
    const accountSplit = accountId.split('_')
    const budgetSavings: Omit<BudgetSavings, 'id'|'user'> = {
      account: Number(accountSplit[1]),
      max: 10000,
      type: accountSplit[0] as 'account'|'investment'
    }
    await fetch('budget/savingsAccount', {
      method: 'POST',
      body: JSON.stringify(budgetSavings),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:budgetSavings')
  }
  async function updateSavingsAccount (budgetSavings: { id: string, name: string, plannedAmount: number, actualAmount: number }) {
    const accountSplit = budgetSavings.id.split('_')
    const budgetSavingsAccount : Omit<BudgetSavings, 'user'> = {
      id: Number(accountSplit[2]),
      account: Number(accountSplit[1]),
      max: budgetSavings.plannedAmount * 100,
      type: accountSplit[0] as 'account'|'investment'
    }
    await fetch('budget/savingsAccount', {
      method: 'POST',
      body: JSON.stringify(budgetSavingsAccount),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:budgetSavings')
  }
  async function deleteSavingsAccount (accountId: string) {
    const accountSplit = accountId.split('_')
    await fetch('budget/savingsAccount', {
      method: 'DELETE',
      body: JSON.stringify({ id: accountSplit[2] }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:budgetSavings')
  }
  async function addExcessAccount (accountId: string) {
    const accountSplit = accountId.split('_')
    const excess: Omit<BudgetExcess, 'id'|'user'> = {
      account: Number(accountSplit[1]),
      proportion: 10,
      type: accountSplit[0] as 'account'|'investment'
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
  async function updateExcessAccount (excess: { id: string, name: string, plannedAmount: number, actualAmount }) {
    const accountSplit = excess.id.split('_')
    const excessAccount: Omit<BudgetExcess, 'user'> = {
      id: Number(accountSplit[2]),
      account: Number(accountSplit[1]),
      proportion: excess.plannedAmount,
      type: accountSplit[0] as 'account'|'investment'
    }
    await fetch('budget/excessAccount', {
      method: 'POST',
      body: JSON.stringify(excessAccount),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:excess')
  }
  async function deleteExcessAccount (accountId: string) {
    const accountSplit = accountId.split('_')
    await fetch('budget/excessAccount', {
      method: 'DELETE',
      body: JSON.stringify({ id: accountSplit[2] }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await invalidate('data:excess')
  }
</script>

<AppBar title="Budget"
        subtext="from {budgetStartDate.toDateString()} to {budgetEndDate.toDateString()}"
        rightButtons={[{ name: isEditing ? 'Save' : 'Edit', action: edit }]}/>

<div class="header">
  <div class="frequency">
    {#if isEditing}
      <p><FrequencySelector bind:value={budget.frequency} bind:type={budget.frequencyCategory} bind:daysOf={budget.dayOf}/></p>
    {/if}
  </div>
</div>


<div class="outer">
  <div class="main">
    <div class="title"><h3>Income</h3>{currencyToString(data.incomeSinceLast)}</div>
    {#each incomeOnAccounts as income}
      <div class="income-list-item">
        <p>{data.accounts[income.parent]?.children[income.account]?.name} ({((income.total * 100) / data.incomeSinceLast).toFixed(0)}%)</p>
        <div style="flex-grow: 1"></div>
        <p>{currencyToString(income.total)}</p>
      </div>
      <hr/>
    {/each}
    {#each investmentIncome as income}
      <div class="income-list-item">
        <p>{income.name} ({((income.income * 100) / data.incomeSinceLast).toFixed(0)}%)</p>
        <div style="flex-grow: 1"></div>
        <p>{currencyToString(income.income)}</p>
        <p style="font-style: italic"> (+~{currencyToString(income.estimatedTotalIncome)})</p>
      </div>
      <hr/>
    {/each}

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
        <p>{((currentWants / maxWants) * 100).toFixed(2)}% progress towards {currencyToString(maxWants)}</p>
          <SavingsProgress savingsGoal={maxWants} currentValue={currentWants} />
      </div>
      <div style="padding-left: 25px">{#each amountToWants as want}
        <p>{currencyToString(want.actualAmountAdded)} to {want.parentName}: {want.name}
          to bring it up to {currencyToString((totals[want.parent]?.children[want.id] ?? 0) + want.actualAmountAdded)}</p>
      {/each}</div>
    </Expandable>

    <div class="title"><h3>Savings</h3>{currencyToString(savingsAccounts.reduce((total, acc) => total + acc.actualAmountAdded, 0))}</div>
    <BucketAssignment bucketsToAdd={allBuckets()}
                      buckets={savingsAccounts.map(acc => ({
                        id: `${acc.type}_${acc.account}_${acc.id}`, name: acc.name, plannedAmount: acc.max / 100, actualAmount: acc.actualAmountAdded
                      }))}
                      type="max"
                       addBucketCallback={addSavingsAccount} updateBucketCallback={updateSavingsAccount}
                       removeBucketCallback={deleteSavingsAccount} />

    <div class="title"><h3>Excess</h3>{currencyToString(excess)}</div>
    <BucketAssignment bucketsToAdd={allBuckets()}
                      buckets={excessAccounts.map(acc => ({
                        id: `${acc.type}_${acc.account}_${acc.id}`, name: acc.name, plannedAmount: acc.proportion, actualAmount: acc.actualAmountAdded
                      }))}
                      type="percent"
                      addBucketCallback={addExcessAccount} updateBucketCallback={updateExcessAccount}
                      removeBucketCallback={deleteExcessAccount} />
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
  .outer {
    padding-bottom: 50px;
  }
  .main {
    margin: 20px 0;
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
  .income-list-item {
    padding-top: 5px;
    padding-right: 5px;
    padding-left: 25px;
    display: flex;
  }
  .income-list-item p {
    margin: 0;
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