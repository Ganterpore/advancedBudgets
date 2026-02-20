<script lang="ts">
  import Input from "$lib/components/sharedComponents/Input.svelte";
  import type { Debt } from '$lib/types/accountTypes'

  export let debt: Omit<Debt, 'id'|'user'>
  export let currentBalance: number | undefined = undefined

  let paid = (currentBalance || currentBalance === 0) ? currentBalance / 100 : undefined
  let principal = debt.principal / 100
  let payPerPeriod = debt.regularRepayment / 100

  $: currentBalance = paid !== undefined ? paid * 100 : undefined
  $: debt.principal = principal * 100
  $: debt.regularRepayment = payPerPeriod * 100

  const calculateN = (P, rate, M) => {
    const r = (rate / 100) / 12; // Convert annual % to monthly decimal
    const result = Math.log(M / (M - P * r)) / Math.log(1 + r)
    if (isNaN(result)) return '∞'
    return Math.round(result)
  }
  const formatDuration = (totalMonths) => {
    if (!isFinite(totalMonths)) return "Never (interest exceeds repayment)";

    // Use Math.ceil because even a partial month requires a full payment
    const total = Math.ceil(totalMonths);
    const years = Math.floor(total / 12);
    const months = total % 12;

    const yLabel = years === 1 ? "Year" : "Years";
    const mLabel = months === 1 ? "Month" : "Months";

    const yearPart = years > 0 ? `${years} ${yLabel}` : "";
    const monthPart = months > 0 ? `${months} ${mLabel}` : "";

    return [yearPart, monthPart].filter(Boolean).join(" and ") || "0 Months";
  };

  $: monthsUntilPaid = calculateN((debt.principal - (currentBalance ?? 0)), debt.percent, debt.regularRepayment)
  $: paymentTimeString = formatDuration(monthsUntilPaid)
</script>

<div class="container">
  <div class="input"><Input name="name" type="text" label="Name" bind:value={debt.name} /></div>
  <div class="input"><Input name="principal" type="number" label="Principal" bind:value={principal} /></div>
  {#if paid !== undefined}<div class="input"><Input type="number" label="Paid" bind:value={paid} /></div> {/if}
  <div class="input"><Input name="regularRepayment" type="number" label="Regular Deposit" bind:value={payPerPeriod} /></div>
  <div class="input"><Input name="percent" type="number" label="Interest Rate p/a" bind:value={debt.percent} /></div>
  <div class="input"><Input type="text" disabled label="Time until paid" value={paymentTimeString} /></div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-count: 1;
  }
</style>