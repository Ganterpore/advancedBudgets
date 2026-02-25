<script lang="ts">
  import {currencyToString} from "$lib/utils";
  import type { AccountNode } from '$lib/types/accountTypes'

  export let debts: (AccountNode & { repayment: number, principalRepaid: number })[]
</script>

<div>{#each debts as debt}
  <div class="budgetList">
    <p>{debt.name}</p>
    <div style="flex-grow: 1"></div>
    <div>
      <p>{currencyToString(debt.repayment)} / {currencyToString(debt.debtInfo.regularRepayment)}</p>
      <p class="additional-info">{currencyToString(debt.principalRepaid + debt.repayment)} / {currencyToString(debt.debtInfo.principal)}</p>
    </div>
  </div>
{/each}</div>


<style>
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