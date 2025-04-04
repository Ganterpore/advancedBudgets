<script lang="ts">
  import Chart from 'chart.js/auto'
  import { onMount } from 'svelte';
  import type { Theme } from '$lib/types/userTypes'
  import { currencyToString } from '$lib/utils'

  export let age
  export let theme: Theme
  export let data: {
    year: number,
    capital: number,
    principle: number,
    deposits: number,
    simpleInterest: number,
    compoundedInterest: number,
    capitalRequired: number,
    needsCapitalRequired: number
  }[]

  let ctx
  let chartCanvas
  let chart

  Chart.defaults.color = theme.text
  const tooltip = { callbacks: { label: (context) => `${context.dataset.label}: ${currencyToString(context.parsed.y)}` } }
  let datasets
  $: datasets = [
    {
      label: 'Required Capital',
      backgroundColor: theme.alert,
      data: data.map(d => d.capitalRequired),
      type: 'line',
      tooltip
    },
    {
      label: 'Required Capital for Needs',
      backgroundColor: theme.secondary,
      data: data.map(d => d.needsCapitalRequired),
      type: 'line',
      tooltip
    },
    {
      label: 'Principle',
      backgroundColor: theme.highlight + '55',
      data: data.map(d => d.principle),
      tooltip
    },
    {
      label: 'P+Deposits',
      backgroundColor: theme.highlight + '55',
      data: data.map(d => d.deposits + d.principle),
      tooltip
    },
    {
      label: 'P+D+Simple Interest',
      backgroundColor: theme.highlight + '55',
      data: data.map(d => d.deposits + d.principle + d.simpleInterest),
      tooltip
    },
    {
      label: 'P+D+i+Compounded Interest',
      backgroundColor: theme.highlight + '55',
      data: data.map(d => d.deposits + d.principle + d.simpleInterest + d.compoundedInterest),
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
