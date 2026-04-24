<script lang="ts">
  import Chart from 'chart.js/auto'
  import { onMount } from 'svelte';
  import type { Theme } from '$lib/types/userTypes'
  import { currencyToString } from '$lib/utils'
  import type { RetirementChartData } from '$lib/helpers/financeHelpers'

  export let age
  export let theme: Theme
  export let data: RetirementChartData[]

  let ctx
  let chartCanvas
  let chart

  Chart.defaults.color = theme.text
  const tooltip = { callbacks: { label: (context) => `${context.dataset.label}: ${currencyToString(context.parsed.y)}` } }
  let datasets
  $: datasets = [
    {
      label: 'Required Capital for Needs',
      backgroundColor: theme.highlight + '25',
      data: data.map(d => d.needsCapitalRequired),
      type: 'line',
      tooltip
    },
    {
      label: 'Required Capital',
      backgroundColor: theme.highlight,
      data: data.map(d => d.capitalRequired),
      type: 'line',
      tooltip
    },
    {
      label: 'Debt',
      backgroundColor: theme.alert,
      data: data.map(d => d.debtRemaining),
      type: 'line',
      tooltip
    },
    {
      label: 'Savings',
      backgroundColor: theme.highlight,
      data: data.map(d => d.capital),
      tooltip
    }
  ]
  $: if (data && datasets && chart) {
    chart.data.datasets = datasets
    chart.data.labels = data.map(d => Number(d.year) + Number(age))
    chart.update()
  }

  onMount(() => {
    ctx = chartCanvas.getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.year + age),
        datasets
      },
      options: {
        scales: {
          x: {
            stacked: true
          },
          y: {
            ticks: {
              callback: function (value) {
                return currencyToString(value)
              }
            }
          }
        },
        interaction: {
          mode: 'x'
        }
      }
    })
  })
</script>

<div>
  <canvas bind:this={chartCanvas}></canvas>
</div>
