<script>
    import DayOfWeekSelector from "$lib/components/DayOfWeekSelector.svelte";
    import {getOrdinalNum} from "$lib/utils";
    import {FrequencyCategory} from "$lib/types";

    export let type
    export let value
    export let daysOf
</script>

<div>
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
