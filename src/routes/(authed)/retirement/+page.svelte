<script>
  import BottomNavigation from "$lib/components/sharedComponents/BottomNavigation.svelte";
  import AppBar from "$lib/components/sharedComponents/AppBar.svelte";
  import RetirementDescriber from "$lib/components/retirementComponents/RetirementDescriber.svelte";
  import NumberClicker from "$lib/components/sharedComponents/NumberClicker.svelte";
  import Input from "$lib/components/sharedComponents/Input.svelte";

  let withdrawalRate = 4
  let inflationRate = 3
  let yearsUntilRetirement = 0

  export let data
  let wantsBudget, needsBudget, budgetPeriodsPerYear
  $: ({ wantsBudget, needsBudget, budgetPeriodsPerYear } = data)

  $: initialBudget = (wantsBudget + needsBudget) / 100
  $: withdrawalRate = Math.max(withdrawalRate, 1)
  $: yearsUntilRetirement = Math.max(yearsUntilRetirement, 0)
  $: budgetPerYear = initialBudget * 100 * budgetPeriodsPerYear
</script>

<AppBar title="Retirement"/>

<div class="container">
  <div class="percentContainer">
    <NumberClicker unit="%" name="Withdrawal Rate" bind:value={withdrawalRate}/>
    <NumberClicker unit="%" name="Inflation Rate" bind:value={inflationRate}/>
    <NumberClicker unit="y" name="Years Until Retirement" bind:value={yearsUntilRetirement}/>
    <Input label="Current budget per budget period" bind:value={initialBudget} />
  </div>

  <RetirementDescriber yearsUntil={yearsUntilRetirement}
                       inflationRate={inflationRate} withdrawalRate={withdrawalRate}
                       currentBudget={budgetPerYear}/>
</div>

<BottomNavigation selected="retirement"/>

<style>
  .container {
    background-color: var(--theme-plain);
    color: var(--theme-text);
  }
  .percentContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .percentInput {
    display: flex;
    flex-direction: row;
    gap: 5ch;
  }
</style>