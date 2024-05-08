<script lang="ts">
    import NumberInput from '$lib/components/NumberInput.svelte'
    import type {AccountTypeBudget} from '../../../db/types/accountTypeBudget'
    import {FrequencyCategory} from "../../../db/types/accountTypeBudget";
    import FrequencySelector from "$lib/components/FrequencySelector.svelte";
    import {dayBitMapToString} from "$lib/dayOfWeekFunctons";
    import {getOrdinalNum} from "$lib/utils";

    export let name
    export let dataObject: Omit<AccountTypeBudget, 'id'>
    if (!dataObject.frequencyCategory) dataObject.frequencyCategory = FrequencyCategory.WEEKLY

    function adjustBudgetMax () {
        dataObject.budgetMax = Math.max(dataObject.budgetMax, dataObject.regularBudget)
    }

    $: introText = `You will receive $${dataObject.regularBudget ?? 0} to spend ${name ? `on ${name} ` : ''}`
    $: frequencyText = `every ${dataObject.frequency > 1 ? dataObject.frequency + ' ' : ''}
                    ${dataObject.frequencyCategory}${dataObject.frequency > 1 ? 's' + ' ' : ''}`
    $: dayOfText = `${dataObject.dayOf > 0 ? ' on the ' : ''}
                  ${dataObject.frequencyCategory === FrequencyCategory.WEEKLY
                      ? dayBitMapToString(dataObject.dayOf)
                      : dataObject.dayOf + getOrdinalNum(dataObject.dayOf)}.`
    $: maxText = `You will never accumulate more than $${dataObject.budgetMax} in the account.`
</script>

<NumberInput autofocus name="regularBudget" bind:value={dataObject.regularBudget} on:input={adjustBudgetMax} label="Budget Amount" />
<FrequencySelector bind:value={dataObject.frequency} bind:type={dataObject.frequencyCategory} bind:daysOf={dataObject.dayOf} />
<NumberInput name="budgetMax" bind:value={dataObject.budgetMax}
             on:focusout={adjustBudgetMax} label="Max" />
<p>{introText + frequencyText + dayOfText}</p>
<p>{maxText}</p>
