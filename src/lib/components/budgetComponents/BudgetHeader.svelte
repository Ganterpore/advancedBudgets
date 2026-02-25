<script lang="ts">
  import {currencyToString} from "$lib/utils"
  import SavingsProgress from '$lib/components/accountComponents/SavingsProgress.svelte'

  export let title: string
  export let current: number
  export let goal: number
</script>

<div class="container">
  <div class="title">
    <h3>{title}</h3>
    <div class="progress-label">
      <p class="additional-info">{currencyToString(current)}</p>
      <p>{((current / goal) * 100).toFixed(2)}%</p>
    </div>
    {currencyToString(goal)}
  </div>
  <SavingsProgress
    savingsGoal={goal}
    currentValue={Math.min(current, goal)} />
</div>

<style>
  .container {
    background-color: var(--theme-secondary);
    border-radius: 5px;
  }
  .title {
    padding: 10px;
    font-size: large;
    color: var(--theme-secondary-text);
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .title h3 {
    margin: 0;
    padding: 0 20px;
  }
  .progress-label {
    display: flex;
    font-size: small;
    font-weight: normal;
    flex-direction: row;
    justify-content: center;
    gap: 5px;
  }
  .progress-label p {
    margin: 0;
    align-self: flex-end;
  }
  .additional-info {
    font-style: italic;
    font-size: smaller;
    align-self: center;
    color: var(--theme-secondary-text);
  }
</style>