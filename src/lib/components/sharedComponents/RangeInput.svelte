<script lang="ts">
    export let ticks: string[]
    export let value
</script>

<input type="range" {...$$restProps} bind:value={value} on:input/>
<div class="ticks">
    {#each ticks as tick}
        <p>{tick}</p>
    {/each}
</div>

<style>
    .ticks {
        display: flex;
        justify-content: space-between;
    }
</style>