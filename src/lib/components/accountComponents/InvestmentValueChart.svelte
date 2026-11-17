<script lang="ts">
  import Chart from 'chart.js/auto'
  import type { Plugin } from 'chart.js'
  import { onDestroy, onMount } from 'svelte'
  import { currencyToString } from '$lib/utils'
  import type { InvestmentValue } from '$lib/types/accountTypes'

  // Values in any order; the chart sorts them chronologically
  export let values: InvestmentValue[]

  let canvas: HTMLCanvasElement
  let chart: Chart<'line', { x: number, y: number }[]> | undefined

  $: points = [...values]
    .map(v => ({ x: new Date(v.onDate).getTime(), y: v.amount }))
    .sort((a, b) => a.x - b.x)
  // With one value (or all values equal) Chart.js has no range to work with, so give it one:
  // a month either side of a lone date, and some headroom around a flat value
  const DAY = 24 * 60 * 60 * 1000
  $: xs = points.map(p => p.x)
  $: ys = points.map(p => p.y)
  $: xBounds = points.length && Math.min(...xs) === Math.max(...xs)
    ? { min: xs[0] - 30 * DAY, max: xs[0] + 30 * DAY }
    : { min: undefined, max: undefined }
  // 10% headroom above and below the data, never going below $0 (investment values can't be negative)
  $: yBounds = (() => {
    if (!points.length) return { suggestedMin: undefined, suggestedMax: undefined }
    const min = Math.min(...ys)
    const max = Math.max(...ys)
    if (min === max) return { suggestedMin: 0, suggestedMax: max === 0 ? 100000 : max * 1.2 }
    const pad = (max - min) * 0.1
    return { suggestedMin: Math.max(0, min - pad), suggestedMax: max + pad }
  })()
  $: if (chart) {
    chart.data.datasets[0].data = points
    Object.assign(chart.options.scales!.x!, xBounds)
    Object.assign(chart.options.scales!.y!, yBounds)
    chart.update()
  }

  // Matches currencyToString's AUD formatting, but compact for axis ticks (eg. $21.5K)
  const compactCurrency = new Intl.NumberFormat('en-au', {
    style: 'currency', currency: 'AUD', notation: 'compact', maximumFractionDigits: 1
  })
  const formatDate = (ms: number) => new Date(ms).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', year: '2-digit'
  })

  // Vertical hairline that follows the hovered point, so readers aim at a date rather than the line
  const crosshair: Plugin<'line'> = {
    id: 'crosshair',
    afterDatasetsDraw (c) {
      const active = c.tooltip?.getActiveElements()
      if (!active?.length) return
      const x = active[0].element.x
      const { top, bottom } = c.chartArea
      c.ctx.save()
      c.ctx.beginPath()
      c.ctx.moveTo(x, top)
      c.ctx.lineTo(x, bottom)
      c.ctx.lineWidth = 1
      c.ctx.strokeStyle = (c.options.plugins as { crosshair?: { color: string } }).crosshair?.color ?? '#888'
      c.ctx.stroke()
      c.ctx.restore()
    }
  }

  onMount(() => {
    // Pull colours from the user's theme so the chart matches whichever theme is active
    const style = getComputedStyle(canvas)
    const themeVar = (name: string, fallback: string) => style.getPropertyValue(`--theme-${name}`).trim() || fallback
    const line = themeVar('highlight', '#525032')
    const surface = themeVar('primary', '#CCB394')
    const text = themeVar('text', '#311E0F')
    const grid = text + '26' // text colour at ~15% opacity: a recessive hairline

    chart = new Chart(canvas, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Value',
          data: points,
          borderColor: line,
          borderWidth: 2,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          tension: 0,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: line,
          pointBorderColor: surface,
          pointBorderWidth: 2,
          pointHitRadius: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        scales: {
          x: {
            type: 'linear',
            ...xBounds,
            ticks: { color: text, maxTicksLimit: 6, callback: (v) => formatDate(Number(v)) },
            grid: { display: false },
            border: { color: grid }
          },
          y: {
            ...yBounds,
            ticks: { color: text, maxTicksLimit: 5, callback: (v) => compactCurrency.format(Number(v) / 100) },
            grid: { color: grid, lineWidth: 1 },
            border: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          // @ts-expect-error custom plugin options
          crosshair: { color: grid },
          tooltip: {
            displayColors: false,
            backgroundColor: text,
            titleColor: surface,
            bodyColor: surface,
            titleFont: { weight: 'bold', size: 14 },
            callbacks: {
              title: (items) => currencyToString(items[0].parsed.y),
              label: (item) => formatDate(item.parsed.x)
            }
          }
        }
      },
      plugins: [crosshair]
    })
  })

  onDestroy(() => chart?.destroy())
</script>

<div class="chart" role="img"
     aria-label="Investment value over time. The full list of values is in the Value History below.">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart {
    position: relative;
    height: 260px;
    width: 100%;
  }
</style>
