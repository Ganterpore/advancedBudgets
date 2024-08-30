<script lang="ts">
  import type { AccountTypeSaving } from '$lib/types/accountTypes'
  import { getHighlightColour } from '$lib/utils'
  import RangeInput from '$lib/components/sharedComponents/RangeInput.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'

  const multipliers = [25, 50, 100, 125, 150, 200, 300, 500, 900]

  export let dataObject: Omit<AccountTypeSaving, 'id'>
  let savingsTarget = dataObject?.target ? dataObject.target / 100 : ''
  let sliderValue = dataObject?.multiplier ? multiplierToSliderValue(dataObject.multiplier) : 100
  $: dataObject.multiplier = sliderValueToMultiplierValue(sliderValue)
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
</script>

<div class="container" style="--multiplier-highlight:{highlightColour}">
  <Input type="number" step="0.01" name="target" bind:value={savingsTarget} label="Savings Target" />
  <div class="multiplier_container"><p class="centered">Multiplier:&nbsp;&nbsp;&nbsp;</p><p class="multiplier">     {dataObject.multiplier / 100}X</p></div>
  <p style="font-style: italic">Determines how quickly this savings goal will reach it's target.</p>
  <RangeInput min="0" max="8" step="1" bind:value={sliderValue} ticks={['½', '1', '1.5', '3', '9']} />
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