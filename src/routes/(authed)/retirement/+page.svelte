<script>
  import BottomNavigation from "$lib/components/sharedComponents/BottomNavigation.svelte";
  import AppBar from "$lib/components/sharedComponents/AppBar.svelte";
  import RetirementDescriber from "$lib/components/retirementComponents/RetirementDescriber.svelte";
  import NumberClicker from "$lib/components/sharedComponents/NumberClicker.svelte";
  import Input from "$lib/components/sharedComponents/Input.svelte";
  import Toggle from "$lib/components/sharedComponents/Toggle.svelte";
  import Alert from "$lib/components/sharedComponents/Alert.svelte";
  import {themes} from "$lib/types/userTypes";
  import Expandable from "$lib/components/sharedComponents/Expandable.svelte";
  import Button from "$lib/components/sharedComponents/Button.svelte";
  import DebtForm from "$lib/components/mortgageComponents/DebtForm.svelte";

  let withdrawalRate = 4
  let inflationRate = 3
  let roiInterestRate = 6
  let yearsUntilRetirement = 10
  let reduceInterestByWithdrawal = 'Retain'
  let deposit = 0
  let age = 0
  export let data
  let wantsBudget, needsBudget, budgetPeriodsPerYear, currentCapital, budgetedAmountToCapital, theme, debts
  $: ({ wantsBudget, needsBudget, budgetPeriodsPerYear, currentCapital, budgetedAmountToCapital, settings: { theme }, debts } = data)

  const addDebt = () => {
    debts = [...debts, {
      name: '',
      currentBalance: 0,
      principal: 100_000_00,
      percent: 5,
      regularRepayment: 1000_00
    }]
  }
  const removeDebt = (mortgage) => {
    debts = debts.filter(m => m !== mortgage)
  }

  $: withdrawalRate = Math.max(withdrawalRate, 1)
  $: roiInterestRate = Math.max(roiInterestRate, 0)
  $: yearsUntilRetirement = Math.max(yearsUntilRetirement, 1)

  $: initialBudget = (wantsBudget + needsBudget) / 100
  $: regularDeposit = budgetedAmountToCapital / 100

  $: budgetPerYear = initialBudget * 100 * budgetPeriodsPerYear
  $: updatedCapital = currentCapital + (deposit * 100)
  $: updatedInterestRate = reduceInterestByWithdrawal === 'Retain' ? roiInterestRate : roiInterestRate - withdrawalRate
</script>

<AppBar title="Retirement"/>

<div class="container">
  <div class="text">
    <RetirementDescriber age={age} theme={themes[theme] ?? themes.default} yearsUntil={yearsUntilRetirement} budgetPeriodsPerYear={budgetPeriodsPerYear}
                       inflationRate={inflationRate} withdrawalRate={withdrawalRate} interestRate={updatedInterestRate}
                       currentCapital={updatedCapital} budgetedAmountToCapital={regularDeposit * 100}
                       currentBudget={budgetPerYear} currentNeeds={needsBudget * budgetPeriodsPerYear}
                       debts={debts}/>
  </div>

  <div class="percentContainer">
    <div class="large-input"><NumberClicker unit="y" name="Years Until Retirement" bind:value={yearsUntilRetirement} additionalClickerValue={10}/></div>
    <div class="input"><Input type="number" label="Make one time deposit" bind:value={deposit} /></div>
    <div class="input"><Input type="number" label="Current budget per budget period" bind:value={initialBudget} /></div>
    <div class="input"><Input type="number" label="Regular deposit" bind:value={regularDeposit} /></div>
    <div class="input"><Input type="number" label="Age" bind:value={age} /></div>
  </div>

  <h4>Debts</h4>
  <Button on:click={addDebt}>+</Button>
  <div class="debt-container">
    {#each debts as debt}
      <div>
        <Button secondary on:click={() => removeDebt(debt)}>X</Button>
        <DebtForm bind:debt={debt} currentBalance={debt.currentBalance} />
      </div>
    {/each}
  </div>

  <Expandable name="Advanced Settings">
    <div class="percentContainer">
      <NumberClicker unit="%" name="Withdrawal Rate" bind:value={withdrawalRate}/>
      <NumberClicker unit="%" name="Investment Interest Rate" bind:value={roiInterestRate}/>
      <div class="toggle">
        Reduce Investment income by withdrawal rate?
        <Toggle bind:selected={reduceInterestByWithdrawal} values={["Reduce", "Retain"]} />
      </div>
      {#if reduceInterestByWithdrawal === 'Reduce' && withdrawalRate > roiInterestRate}
        <Alert>Withdrawal rate should not be greater than investment return if the reduction method is chosen</Alert>
      {/if}
      <NumberClicker unit="%" name="Inflation Rate" bind:value={inflationRate}/>
    </div>
  </Expandable>
</div>

<BottomNavigation selected="retirement"/>

<style>
  .container {
    margin: 10px;
    background-color: var(--theme-secondary);
    color: var(--theme-secondary-text);
    padding-bottom: 75px;
  }
  .text {
    background-color: var(--theme-plain);
    color: var(--theme-text);
  }
  .percentContainer {
    display: grid;
    grid-template-columns: 1fr;
    column-count: 1;
  }
  .large-input {
    grid-column: 1;
  }
  .toggle {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin: 10px;
  }
  .debt-container {
    background-color: var(--theme-plain);
  }
  @media (width >= 500px) {
    .percentContainer {
      grid-template-columns: 1fr 1fr;
    }
    .large-input {
      grid-column: 1 / 3;
    }
  }
</style>