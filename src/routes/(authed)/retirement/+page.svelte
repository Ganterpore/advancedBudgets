<script>
  import BottomNavigation from "$lib/components/sharedComponents/BottomNavigation.svelte";
  import AppBar from "$lib/components/sharedComponents/AppBar.svelte";
  import RetirementDescriber from "$lib/components/retirementComponents/RetirementDescriber.svelte";
  import NumberClicker from "$lib/components/sharedComponents/NumberClicker.svelte";
  import Input from "$lib/components/sharedComponents/Input.svelte";
  import Toggle from "$lib/components/sharedComponents/Toggle.svelte";
  import Alert from "$lib/components/sharedComponents/Alert.svelte";
  import {themes} from "$lib/types/userTypes";

  let withdrawalRate = 4
  let inflationRate = 3
  let roiInterestRate = 6
  let yearsUntilRetirement = 10
  let reduceInterestByWithdrawal = 'Retain'
  let deposit = 0
  let age = 0

  export let data
  let wantsBudget, needsBudget, budgetPeriodsPerYear, currentCapital, budgetedAmountToCapital
  let theme
  $: ({ wantsBudget, needsBudget, budgetPeriodsPerYear, currentCapital, budgetedAmountToCapital, theme } = data)

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
                       currentBudget={budgetPerYear} currentNeeds={needsBudget}/>
  </div>

  <div class="percentContainer">
    <NumberClicker unit="%" name="Withdrawal Rate" bind:value={withdrawalRate}/>
    <NumberClicker unit="%" name="Investment Interest Rate" bind:value={roiInterestRate}/>
    <div class="toggle">
      Reduce Investment income by withdrawal rate?
      <Toggle bind:selected={reduceInterestByWithdrawal} value1="Reduce" value2="Retain" />
    </div>
    {#if reduceInterestByWithdrawal === 'Reduce' && withdrawalRate > roiInterestRate}
      <Alert>Withdrawal rate should not be greater than investment return if the reduction method is chosen</Alert>
    {/if}
    <NumberClicker unit="%" name="Inflation Rate" bind:value={inflationRate}/>
    <NumberClicker unit="y" name="Years Until Retirement" bind:value={yearsUntilRetirement} additionalClickerValue={10}/>
    <Input type="number" label="Current budget per budget period" bind:value={initialBudget} />
    <Input type="number" label="Make one time deposit" bind:value={deposit} />
    <Input type="number" label="Regular deposit" bind:value={regularDeposit} />
    <Input type="number" label="Age" bind:value={age} />
  </div>
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
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .toggle {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin: 10px;
  }
</style>