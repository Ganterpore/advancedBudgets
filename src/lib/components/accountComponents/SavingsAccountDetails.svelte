<script lang="ts">
  import type { AccountTypeSaving } from '$lib/types/accountTypes'
  import { getHighlightColour } from '$lib/utils'
  import RangeInput from '$lib/components/sharedComponents/RangeInput.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Toggle from '$lib/components/sharedComponents/Toggle.svelte'
  import { savingsAccountMultiplierToString } from '$lib/helpers/accountHelpers'

  const multipliers = [0, 50, 100, 150, 200, 250, 300, 500, 1000]

  export let dataObject: Omit<AccountTypeSaving, 'id'>
  let sliderMode = multipliers.includes(dataObject.multiplier) ? 'slider' : 'input'
  let savingsTarget = dataObject?.target ? dataObject.target / 100 : ''
  let sliderValue = dataObject?.multiplier !== undefined ? multiplierToSliderValue(dataObject.multiplier) : 1
  $: dataObject.multiplier = Math.round(Math.max(0, dataObject.multiplier))
  $: dataObject.target = savingsTarget * 100
  $: highlightColour = getHighlightColour(false, dataObject.multiplier)

  function sliderValueToMultiplierValue (sliderValue: number): number {
    return multipliers[sliderValue]
  }
  function multiplierToSliderValue (multiplier: number): number {
    return multipliers.reduce((closestIndex, currentValue, currentIndex, array) => {
      return Math.abs(multiplier - currentValue) < Math.abs(multiplier - array[closestIndex]) ? currentIndex : closestIndex
    }, 0)
  }
  function normaliseValues () {
    if (sliderMode === 'slider') {
      // If going to slider, normalise the value
      sliderValue = multiplierToSliderValue(dataObject.multiplier)
      dataObject.multiplier = sliderValueToMultiplierValue(sliderValue)
    }
  }
</script>

<div class="container" style="--multiplier-highlight:{highlightColour}">
  <Input type="number" step="0.01" name="target" bind:value={savingsTarget} label="Savings Target" />
  <div class="multiplier_container"><p class="centered">Multiplier:&nbsp;&nbsp;&nbsp;</p><p class="multiplier">     {savingsAccountMultiplierToString(dataObject.multiplier)}</p></div>
  <p style="font-style: italic">Determines how quickly this savings goal will reach it's target relative to other savings goals.</p>
  <Toggle bind:selected={sliderMode} value1="slider" value2="input" onChange={normaliseValues} />
  {#if sliderMode === 'slider'}
    <RangeInput min="0" max="8" step="1" bind:value={sliderValue} ticks={['⏸', '1', '2', '3', '10']}
                on:input={() => dataObject.multiplier = sliderValueToMultiplierValue(sliderValue)}  />
  {:else}
    <Input type="number" step="0.25" bind:value={dataObject.multiplier} />
  {/if}
</div>

<style>
    .container {
      display: flex;
      flex-direction: column;
      color: var(--theme-text);
      margin: 5px;
    }
    .centered {
        text-align: center;
    }
    .multiplier_container {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .multiplier {
        font-weight: bold;
        color: var(--theme-secondary-text);
        text-shadow: -1px -1px 5px var(--multiplier-highlight), 1px -1px 5px var(--multiplier-highlight), -1px 1px 5px var(--multiplier-highlight), 1px 1px 5px var(--multiplier-highlight);
    }
</style>