<script lang="ts">
    import FrequencySelector from "$lib/components/FrequencySelector.svelte";
    import {dayBitMapToString} from "$lib/dayOfWeekFunctons";
    import {getOrdinalNum} from "$lib/utils";
    import Input from "$lib/components/Input.svelte";
    import type { AccountTypeBudget } from './types'
    import { FrequencyCategory } from '$lib/types'
    import { currencyToString } from "$lib/utils.js";

    export let name
    export let dataObject: Omit<AccountTypeBudget, 'id'>
    let budget = 0
    let max = 0
    $: dataObject.regularBudget = budget * 100
    $: dataObject.budgetMax = max * 100

    function adjustBudgetMax () {
      max = Math.max(max, budget)
    }

    $: introText = `You will receive ${currencyToString(dataObject.regularBudget ?? 0)} to spend ${name ? `on ${name} ` : ''}`
    $: frequencyText = `every ${dataObject.frequency > 1 ? dataObject.frequency + ' ' : ''}
                    ${dataObject.frequencyCategory}${dataObject.frequency > 1 ? 's' + ' ' : ''}`
    $: dayOfText = `${dataObject.dayOf > 0 ? ' on the ' : ''}
                  ${dataObject.frequencyCategory === FrequencyCategory.WEEKLY
                      ? dayBitMapToString(dataObject.dayOf)
                      : dataObject.dayOf + getOrdinalNum(dataObject.dayOf)}.`
    $: maxText = `You will never accumulate more than ${currencyToString(dataObject.budgetMax ?? 0)} in the account.`
</script>

<Input autofocus type="number" name="regularBudget" bind:value={budget} on:input={adjustBudgetMax} label="Budget Amount" />
<FrequencySelector bind:value={dataObject.frequency} bind:type={dataObject.frequencyCategory} bind:daysOf={dataObject.dayOf} />
<Input type="number" name="budgetMax" bind:value={max}
             on:focusout={adjustBudgetMax} label="Max" />
<p>{introText + frequencyText + dayOfText}</p>
<p>{maxText}</p>
