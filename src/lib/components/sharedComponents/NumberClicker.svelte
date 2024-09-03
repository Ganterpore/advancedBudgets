<script>
  import Button from "$lib/components/sharedComponents/Button.svelte";

  export let name
  export let value
  export let unit
</script>
<div class="numberClicker">
  <p style="width: 15ch">{name}</p>
  <Button on:click={() => value++}>+</Button>
  <p>{value}{unit}</p>
  <Button on:click={() => value--}>-</Button>
</div>

<style>
  .numberClicker {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
</style>