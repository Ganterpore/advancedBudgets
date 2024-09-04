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
    capitalRequired: number
  }[]

  let ctx
  let chartCanvas
  let chart

  Chart.defaults.color = theme.text
  let datasets
  $: datasets = [
    {
      label: 'Required Capital',
      backgroundColor: theme.alert,
      data: data.map(d => d.capitalRequired),
      type: 'line'
    },
    {
      label: 'Principle',
      backgroundColor: theme.highlight + '55',
      data: data.map(d => d.principle)
    },
    {
      label: 'Deposits',
      backgroundColor: theme.highlight + '55',
      data: data.map(d => d.deposits + d.principle)
    },
    {
      label: 'Simple Interest',
      backgroundColor: theme.highlight + '55',
      data: data.map(d => d.deposits + d.principle + d.simpleInterest)
    },
    {
      label: 'Compounded Interest',
      backgroundColor: theme.highlight + '55',
      data: data.map(d => d.deposits + d.principle + d.simpleInterest + d.compoundedInterest)
    },

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
        }
      }
    })
  })
</script>

<div>
  <canvas bind:this={chartCanvas}></canvas>
</div>
