<script lang="ts">
  import Input from "$lib/components/sharedComponents/Input.svelte";
  import type { Investment } from '$lib/types/accountTypes'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import { enhance } from '$app/forms'
  import { invalidate } from '$app/navigation'

  export let investment: Investment
  export let onSubmit: () => void
  let error

  let percentRoi = investment.expectedROI / 100
  $: investment.expectedROI = percentRoi * 100
  let percentWithdraw = investment.withdrawalRate / 100
  $: investment.withdrawalRate = percentWithdraw * 100
</script>

<form class="form" method="post" action="/accounts/investment"
  use:enhance={() => {
    return async ({ result, update }) => {
      if (result.type === 'error') {
        error = result.error.message
      } else {
        await invalidate('data:accounts')
        update()
        onSubmit()
      }
    }
  }}>
  <p class="subText">This should be an investment that will increase in value over time, such as shares or a house</p>
  {#if error}<Alert>{error}</Alert>{/if}
  <!-- Used to send the id to the server without showing it to the user-->
  {#if investment.id}<input style="display: none" name="id" value={investment.id} />{/if}
  <Input label="Name" name="account" autofocus bind:value={investment.name}/>
  <Input label="Initial Value" name="amount" autofocus bind:value={investment.amount}/>
  <div class="percents">
    <div class="inputWithTooltip">
      <Input type="number" label="Estimated ROI" name="expectedROIPercent" bind:value={percentRoi}>
        %pa
      </Input>
      <p>
        How much you estimate it will return each year. Try to be conservative with your estimate
      </p>
    </div>

    <div class="inputWithTooltip">
      <Input type="number" label="Withdrawal Rate" name="withdrawalRate" bind:value={percentWithdraw}>
        %pa
      </Input>
      {#if percentRoi < percentWithdraw}<Alert>If withdrawal rate is greater than ROI you may eventually run out</Alert>{/if}
      <p>
        What percent of the total amount to pay yourself each year.<br/>
        Ensure you invest more than you withdraw until you are near retirement.
      </p>
    </div>
  </div>
  <Button style="width: 100%">Create</Button>
</form>

<style>
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .subText {
    padding: 20px;
  }
  p {
    font-style: italic;
    margin: 0 0 20px 0;
    padding: 0;
    text-align: center;
    max-width: 80ch;
  }
  .inputWithTooltip {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 1;
    flex-grow: 1;
    max-width: 100%;
    min-width: 40%;
  }
  .percents {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>