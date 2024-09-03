<script>
  import Button from "$lib/components/sharedComponents/Button.svelte";

  export let name
  export let value
  export let unit
  export let additionalClickerValue = 0
</script>
<div class="numberClicker">
  <p style="width: 15ch">{name}</p>
  {#if additionalClickerValue !== 0}<Button on:click={() => value += additionalClickerValue}>+{additionalClickerValue}</Button>{/if}
  <Button on:click={() => value++}>+</Button>
  <p>{value}{unit}</p>
  <Button on:click={() => value--}>-</Button>
  {#if additionalClickerValue !== 0}<Button on:click={() => value -= additionalClickerValue}>-{additionalClickerValue}</Button>{/if}
</div>

<style>
  .numberClicker {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
</style>