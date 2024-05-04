<script>
    export let name = undefined
    export let value = undefined
    export let label = undefined
</script>

<div class="container">
  <p>{label}:</p>
  <input name={name} bind:value={value} />
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