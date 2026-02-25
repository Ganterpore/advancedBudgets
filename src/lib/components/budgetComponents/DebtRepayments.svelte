<script lang="ts">
  import {currencyToString} from "$lib/utils";
  import type { AccountNode } from '$lib/types/accountTypes'

  export let debts: (AccountNode & { repayment: number, principalRepaid: number })[]
</script>

<div>{#each debts as debt}
  <div class="budgetList">
    <h3>{debt.name}</h3>
    <div style="flex-grow: 1"></div>
    <div>
      <div class="container">
        <p class="additional-info">{currencyToString(debt.repayment)}</p>
        <p>{((debt.repayment / debt.debtInfo.regularRepayment) * 100).toFixed(2)}%</p>
      </div>
      <p class="additional-info">{currencyToString(debt.principalRepaid + debt.repayment)} / {currencyToString(debt.debtInfo.principal)}</p>
    </div>
    <div style="flex-grow: 1"></div>
    <p>{currencyToString(debt.debtInfo.regularRepayment)}</p>
  </div>
{/each}</div>


<style>
  .container {
    display: flex;
    flex-direction: row;
  }
  .additional-info {
    font-style: italic;
    font-size: smaller;
    align-self: center;
    color: var(--theme-text-light);
  }
  .budgetList {
    background-color: var(--theme-plain);
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