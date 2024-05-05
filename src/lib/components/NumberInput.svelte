<script>
  export let name = undefined
  export let value = undefined
  export let label = undefined
  export let autofocus = undefined
</script>

<div class="container">
  {#if label}
    <p>{label}:</p>
  {/if}
  <input name={name} bind:value={value} type="number" {autofocus} />
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    input {
        margin: 10px;
        height: 40px;
        font-weight: bold;
        font-size: large;
    }
</style>