<script>
  import Button from "$lib/components/sharedComponents/Button.svelte";

  export let name
  export let value
  export let unit
  export let additionalClickerValue = 0
</script>
<div class="numberClicker">
  <p class="name">{name}</p>
  <div class="clickers">
    {#if additionalClickerValue !== 0}<Button on:click={() => value += additionalClickerValue}>+{additionalClickerValue}</Button>{/if}
    <Button on:click={() => value++}>+</Button>
    <p>{value}{unit}</p>
    <Button on:click={() => value--}>-</Button>
    {#if additionalClickerValue !== 0}<Button on:click={() => value -= additionalClickerValue}>-{additionalClickerValue}</Button>{/if}
  </div>
</div>

<style>
  .numberClicker {
    display: flex;
    flex-direction: row;
    gap: 5px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .name {
    min-width: 20ch;
  }
  .clickers {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
  .clickers p {
    width: 5ch;
    text-align: center;
  }
</style>