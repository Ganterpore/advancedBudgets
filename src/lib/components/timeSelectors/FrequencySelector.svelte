<script lang="ts">
    import {FrequencyCategory} from "$lib/types/sharedTypes";
    import {getOrdinalNum} from "$lib/utils";
    import DayOfWeekSelector from "$lib/components/timeSelectors/DayOfWeekSelector.svelte";

    export let type: FrequencyCategory
    export let value: number
    export let daysOf: number
</script>

<div class="container">
    <label>
        Every
        <input type="number" min="1" max="100" bind:value={value} />
        <select bind:value={type} on:input={() => daysOf = 1}>
            <option value={FrequencyCategory.DAILY}>{ `Day${value > 1 ? 's' : ''}`}</option>
            <option value={FrequencyCategory.WEEKLY}>{ `Week${ value > 1 ? 's' : ''}`}</option>
            <option value={FrequencyCategory.MONTHLY}>{ `Month${ value > 1 ? 's' : ''}`}</option>
        </select>

        {#if type === FrequencyCategory.MONTHLY}
            On the
            <input type="number" min="1" max="31" bind:value={daysOf} />
            {getOrdinalNum(daysOf)}
        {:else if type === FrequencyCategory.WEEKLY}
            On
            <DayOfWeekSelector bind:selectedDays={daysOf} />
        {/if}
    </label>
</div>

<style>
    .container {
        color: var(--theme-text);
    }
</style>
