<script lang="ts">
  import { frequencyDetailsToString } from '$lib/dayOfWeekFunctons'
  import { currencyToString } from '$lib/utils.js'
  import type { AccountTypeBudget } from '$lib/types/accountTypes'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import FrequencySelector from '$lib/components/timeSelectors/FrequencySelector.svelte'
  import { BudgetAccountType } from '$lib/types/accountTypes'
  import Toggle from '$lib/components/sharedComponents/Toggle.svelte'

  export let name
  export let dataObject: Omit<AccountTypeBudget, 'id'>
  let budget = dataObject?.regularBudget / 100 ?? 0
  let max = dataObject?.budgetMax / 100 ?? 0
  $: dataObject.regularBudget = budget * 100
  $: dataObject.budgetMax = max * 100

  function adjustBudgetMax () {
    max = Math.max(max, budget)
  }

  function buildMessageString (accountDetails: Omit<AccountTypeBudget, 'id'>, name) {
    let string = ''
    string += `You will receive ${currencyToString(accountDetails.regularBudget ?? 0)} to spend ${name ? `on ${name} ` : ''}`
    string += frequencyDetailsToString(accountDetails)
    return string
  }

  $: message = buildMessageString(dataObject, name)
  $: maxText = `You will never accumulate more than ${currencyToString(dataObject.budgetMax ?? 0)} in the account.`
</script>

<Toggle bind:selected={dataObject.type} value1={BudgetAccountType.WANT} value2={BudgetAccountType.NEED} />
<p>Is it a want (you can live without it) or a need.</p>
<Input type="number" step="0.01" name="regularBudget" bind:value={budget} on:input={adjustBudgetMax} label="Budget Amount" />
<FrequencySelector bind:value={dataObject.frequency} bind:type={dataObject.frequencyCategory} bind:daysOf={dataObject.dayOf} />
<Input type="number" step="0.01" name="budgetMax" bind:value={max}
             on:focusout={adjustBudgetMax} label="Max" />
<p>{message}</p>
<p>{maxText}</p>
