<script>
    export let name
    export let value
</script>

<input name={name} bind:value={value} />

<style>
    input {
        margin: 10px;
        height: 40px;
        font-weight: bold;
        font-size: large;
    }
</style>