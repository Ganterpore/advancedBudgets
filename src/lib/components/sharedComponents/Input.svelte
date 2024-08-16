<script>
    export let value = undefined
    export let label = undefined
</script>

<div class="container">
  {#if label}
    <p>{label}:</p>
  {/if}
  <div class="textbox">
    <input bind:value={value} on:input on:focusout {...$$restProps} />
    <slot/>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .container p {
    margin: 0 0 0 10px;
    padding: 0;
  }
  .textbox {
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
    width: 100%;
  }
</style>