<script lang="ts">
  import { frequencyDetailsToString, numberOfOccurrencesBetween } from '$lib/dayOfWeekFunctons'
  import { currencyToString } from '$lib/utils.js'
  import type { AccountTypeBudget } from '$lib/types/accountTypes'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import FrequencySelector from '$lib/components/timeSelectors/FrequencySelector.svelte'

  export let name
  export let dataObject: Omit<AccountTypeBudget, 'id'>
  let budget = dataObject?.regularBudget / 100 ?? 0
  let startDateString = dataObject.startDate.toISOString().split('T')[0]
  let endDateString = dataObject.endDate ? dataObject.endDate.toISOString().split('T')[0] : ''
  $: dataObject.regularBudget = budget * 100
  $: dataObject.startDate = new Date(startDateString)
  $: dataObject.endDate = new Date(endDateString)

  function buildMessageString (accountDetails: Omit<AccountTypeBudget, 'id'>, name) {
    const timesBetween = (dataObject.startDate && dataObject.endDate)
      ? numberOfOccurrencesBetween(dataObject, dataObject.startDate, dataObject.endDate)
      : 0
    let string = ''
    string += `You will receive ${currencyToString(accountDetails.regularBudget ?? 0)}`
    string += ` ${timesBetween} times`
    string += ` to spend ${name ? `on ${name} ` : ''}`
    string += frequencyDetailsToString(accountDetails)
    string += ` between ${dataObject.startDate.toLocaleDateString()} and ${dataObject.endDate ? dataObject.endDate.toLocaleDateString() : ''}`
    string += ` for a total of ${currencyToString(timesBetween * accountDetails.regularBudget ?? 0)}`
    return string
  }

  $: message = buildMessageString(dataObject, name)
</script>

<div class="container">
  <Input type="number" step="0.01" name="regularBudget" bind:value={budget} label="Budget Amount" />
  <div class="horizontal">
    <Input type="date" name="startDate" label="Start Date" bind:value={startDateString} />
    <Input type="date" name="endDate" label="End Date" bind:value={endDateString} />
  </div>
  <FrequencySelector bind:value={dataObject.frequency} bind:type={dataObject.frequencyCategory} bind:daysOf={dataObject.dayOf} />
  <p>{message}</p>
</div>

<style>
  .container {
    color: var(--theme-text);
    margin: 5px;
  }
  .horizontal {
    display: flex;
  }
</style>
