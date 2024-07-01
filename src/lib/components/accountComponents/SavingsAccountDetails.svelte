<script lang="ts">
  import type { AccountTypeSaving } from '$lib/types/accountTypes'
  import { getHighlightColour } from '$lib/utils'
  import RangeInput from '$lib/components/sharedComponents/RangeInput.svelte'
  import Input from '$lib/components/sharedComponents/Input.svelte'

  export let dataObject: Omit<AccountTypeSaving, 'id'>
  let savingsTarget
  $: sliderValue = 0
  $: dataObject.multiplier = sliderValueToMultiplierValue(sliderValue)
  $: dataObject.target = savingsTarget * 100
  $: highlightColour = getHighlightColour(false, dataObject.multiplier)

  function sliderValueToMultiplierValue (sliderValue: number): number {
    if (sliderValue === 0) return 100
    if (sliderValue === -3) return 25
    const sign = Math.sign(sliderValue)
    const abs = Math.abs(sliderValue)
    if (abs === 1) return  sign * 25 + sliderValueToMultiplierValue(sliderValue - sign)
    const multiplier = (2 ** (abs - 2)) * 25 * sign
    return multiplier + sliderValueToMultiplierValue(sliderValue - sign)
  }
</script>

<div class="container" style="--multiplier-highlight:{highlightColour}">
  <Input type="number" step="0.01" autofocus name="target" bind:value={savingsTarget} label="Savings Target" />
  <div class="multiplier_container"><p class="centered">Multiplier:&nbsp;&nbsp;&nbsp;</p><p class="multiplier">     {dataObject.multiplier / 100}X</p></div>
  <p style="font-style: italic">Determines how quickly this savings goal will reach it's target.</p>
  <RangeInput min="-2" max="6" step="1" bind:value={sliderValue} ticks={['½', '1', '1.5', '3', '9']} />
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
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