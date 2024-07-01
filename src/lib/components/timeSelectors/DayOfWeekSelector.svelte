<script lang="ts">
    import {daysOfWeek, isDayBitActive} from "$lib/dayOfWeekFunctons";
    export let selectedDays = 0;

    const toggleDay = (day: number) => selectedDays ^= day; // toggle the bit corresponding to the selected day
    $: isSelectedMinified = (day: number) => isDayBitActive(selectedDays, day)
</script>

<div>
    <h2>Select a Day of the Week:</h2>
    {#each daysOfWeek as day}
        <button class={`weekdayButton ${isSelectedMinified(day.id) ? 'selected' : ''}`} on:click={() => toggleDay(day.id)}>
            {day.name}
        </button>
    {/each}
</div>

<style>
    .weekdayButton {
        border-radius: 50%;
        width: 50px;
        aspect-ratio: 1 / 1;
    }
    .selected {
        background-color: var(--theme-alert);
    }
</style>
