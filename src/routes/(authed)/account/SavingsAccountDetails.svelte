<script lang="ts">
  import type { AccountTypeSaving } from '../../../db/models/accountTypeSaving'
  import RangeInput from "$lib/components/RangeInput.svelte";
  import Input from "$lib/components/Input.svelte";

  export let dataObject: Omit<AccountTypeSaving, 'id'>
  $: sliderValue = 2
  $: dataObject.multiplier = sliderValueToMultiplierValue(sliderValue)

  function sliderValueToMultiplierValue (sliderValue: number): number {
      return (2 ** sliderValue) * 25
  }
</script>

<div class="container">
    <Input type="number" autofocus name="target" bind:value={dataObject.target} label="Savings Target" />
    <div class="multiplier_container"><p class="centered">Multiplier:&nbsp;&nbsp;&nbsp;</p><p class="multiplier">     {dataObject.multiplier / 100}X</p></div>
    <p style="font-style: italic">Determines how quickly this savings goal will reach it's target.</p>
    <RangeInput bind:value={sliderValue} ticks={['¼', '½', '1', '2', '4']} />
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
        color: var(--theme-highlight);
        text-shadow: red;
    }
</style>