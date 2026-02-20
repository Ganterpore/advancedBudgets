<script lang="ts">
  import Input from "$lib/components/sharedComponents/Input.svelte";

  export let debt: {
    currentBalance: number,
    total: number,
    percent: number,
    payPerPeriod: number
  }

  let paid = debt.currentBalance / 100
  let total = debt.total / 100
  let payPerPeriod = debt.payPerPeriod / 100

  $: debt.currentBalance = paid * 100
  $: debt.total = total * 100
  $: debt.payPerPeriod = payPerPeriod * 100

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

  $: monthsUntilPaid = calculateN((debt.total - debt.currentBalance), debt.percent, debt.payPerPeriod)
  $: paymentTimeString = formatDuration(monthsUntilPaid)
</script>

<div class="container">
  <div class="input"><Input type="number" label="Principal" bind:value={total} /></div>
  <div class="input"><Input type="number" label="Paid" bind:value={paid} /></div>
  <div class="input"><Input type="number" label="Regular Deposit" bind:value={payPerPeriod} /></div>
  <div class="input"><Input type="number" label="Interest Rate p/a" bind:value={debt.percent} /></div>
  <div class="input"><Input type="text" disabled label="Time until paid" value={paymentTimeString} /></div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-count: 1;
  }
</style>