<script lang="ts">
  import { numberFormatter } from '$lib/utils'
  export let description
  export let amount
  export let accountName
  $: valueString = numberFormatter.format(amount ?? 0)
  // eslint-disable-next-line svelte/valid-compile
  export let id
</script>

<div class="container">
  <p>{description}</p>
  <p>{accountName}</p>
  <p>{valueString}</p>
</div>

<style>
  .container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 0 5px;
  }
</style>