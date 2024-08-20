<script lang="ts">
  import { currencyToString } from '$lib/utils'
  import type { TransactionWithParent } from '$lib/types/transactionTypes'

  export let transaction: TransactionWithParent
  $: valueString = currencyToString(transaction.amount ?? 0)
</script>

<div class="outer">
  <div class="container">
    <p>{transaction.description}</p>
    <p>{transaction.accountName}</p>
    <p>{valueString}</p>
  </div>
</div>

<style>
  .outer {
    display: flex;
    flex-direction: column;
  }
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 5px;
    font-weight: bold;
  }
</style>