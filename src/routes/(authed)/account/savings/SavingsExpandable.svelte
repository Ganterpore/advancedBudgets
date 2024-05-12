<script lang="ts">
  import Expandable from "$lib/components/Expandable.svelte";
  import type { Account } from "../types";
  import type { AccountTotals } from "../../transactions/types";
  import type { AccountTypeSaving } from "./types";
  import SavingsProgress from "./SavingsProgress.svelte";

  export let accounts: Account[]
  export let totals: AccountTotals

  $: savingsGoal = accounts.reduce(
    (acc: number, s: Account) => acc + (s.additionalAccountData as AccountTypeSaving).target,
    0
  )

  $: currentValue = Object.values(totals).reduce((acc: number, t?: number) => acc + (t ?? 0), 0)

</script>

<Expandable {...$$restProps}>
  <div slot="header" class="header">
    <p>{`$${currentValue} of $${savingsGoal}`}</p>
    <SavingsProgress savingsGoal={savingsGoal} currentValue={currentValue} />
  </div>
  <slot/>
</Expandable>

<style>
  .header {
      flex-grow: 1;
  }
  p {
      text-align: center;
  }
</style>