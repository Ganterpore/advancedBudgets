<script>
  export let name = undefined
  export let value = undefined
  export let label = undefined
  export let autofocus = false
</script>

<div class="container">
  {#if label}
    <p>{label}:</p>
  {/if}
  <input name={name} bind:value={value} type="number" {autofocus} on:input on:focusout />
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