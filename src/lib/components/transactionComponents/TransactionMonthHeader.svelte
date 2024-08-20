<script>
  import {currencyToString} from "$lib/utils";

  export let dateString
  export let positiveSum
  export let negativeSum
  const dateStringSplit = dateString.split('_')
  const month = dateStringSplit[1]
</script>

<div>
  <p class="month">{month}</p>
  <div style="flex-grow: 1"></div>
  <p class="positive">+ {currencyToString(positiveSum)}</p>
  <p class="negative">- {currencyToString(Math.abs(negativeSum))}</p>
  <p class="sum">= {currencyToString(positiveSum + negativeSum)}</p>
</div>
<style>
  p {
    font-size: medium;
    align-self: center;
    color: var(--theme-secondary-text);
    font-weight: bold;
  }
  div {
    margin: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
  }
  .month {
    font-size: large;
  }
  .positive {
    color: greenyellow;
  }
  .negative {
    color: crimson;
  }
</style>