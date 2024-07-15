<script lang="ts">
  import { dayBitMapToString } from '$lib/dayOfWeekFunctons'
  import { getOrdinalNum } from '$lib/utils'
  import { currencyToString } from '$lib/utils.js'
  import type { AccountTypeBudget } from '$lib/types/accountTypes'
  import { FrequencyCategory } from '$lib/types/sharedTypes'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import FrequencySelector from '$lib/components/timeSelectors/FrequencySelector.svelte'

  export let name
  export let dataObject: Omit<AccountTypeBudget, 'id'>
  let budget = 0
  let max = 0
  $: dataObject.regularBudget = budget * 100
  $: dataObject.budgetMax = max * 100

  function adjustBudgetMax () {
    max = Math.max(max, budget)
  }

  function buildMessageString (accountDetails: Omit<AccountTypeBudget, 'id'>, name) {
    let string = ''
    string += `You will receive ${currencyToString(accountDetails.regularBudget ?? 0)} to spend ${name ? `on ${name} ` : ''}`
    string += `every ${accountDetails.frequency > 1 ? accountDetails.frequency + ' ' : ''}
                  ${accountDetails.frequencyCategory}${accountDetails.frequency > 1 ? 's' + ' ' : ''}`
    if (accountDetails.frequencyCategory === FrequencyCategory.DAILY) return string
    string += `${accountDetails.dayOf > 0 ? ' on the ' : ''}
                ${accountDetails.frequencyCategory === FrequencyCategory.WEEKLY
      ? dayBitMapToString(accountDetails.dayOf)
      : accountDetails.dayOf + getOrdinalNum(accountDetails.dayOf)}.`
    return string
  }

  $: message = buildMessageString(dataObject, name)
  $: maxText = `You will never accumulate more than ${currencyToString(dataObject.budgetMax ?? 0)} in the account.`
</script>

<Input autofocus type="number" step="0.01" name="regularBudget" bind:value={budget} on:input={adjustBudgetMax} label="Budget Amount" />
<FrequencySelector bind:value={dataObject.frequency} bind:type={dataObject.frequencyCategory} bind:daysOf={dataObject.dayOf} />
<Input type="number" step="0.01" name="budgetMax" bind:value={max}
             on:focusout={adjustBudgetMax} label="Max" />
<p>{message}</p>
<p>{maxText}</p>
