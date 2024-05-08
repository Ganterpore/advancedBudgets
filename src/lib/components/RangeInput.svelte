<script lang="ts">
    export let ticks: string[]
    export let value
</script>

<input type="range" min="0" max="4" step="1" bind:value={value}/>
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