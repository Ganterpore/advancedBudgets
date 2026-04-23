<script lang="ts">
    export let metrics: { label: string, value: string, subValue?: string }[]
</script>

<div class="metrics-grid">
  {#each metrics as metric}
    <div class="metric-card highlight">
      <span class="metric-value">{metric.value}</span>
      <span class="metric-label">{metric.label}</span>
        {#if metric.subValue}
          <span class="metric-sub-value">{metric.subValue}</span>
        {/if}
    </div>
  {/each}
</div>

<style>
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 15px;
        margin-bottom: 25px;
    }

    .metric-card {
        background: var(--theme-primary, rgba(255, 255, 255, 0.03));
        border: 1px solid var(--theme-text, rgba(255, 255, 255, 0.05));
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .metric-card.highlight {
        border: 1px solid var(--theme-secondary, rgba(255, 255, 255, 0.2));
        background: var(--theme-secondary, rgba(255, 255, 255, 0.08));
    }

    .metric-value {
        font-size: 1.4em;
        font-weight: bold;
        color: var(--theme-text);
        margin-bottom: 6px;
    }

    .metric-sub-value {
        font-size: 0.65em;
        font-style: italic;
        color: var(--theme-text);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .metric-label {
        font-size: 0.85em;
        color: var(--theme-text);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .metric-card.highlight .metric-label {
        color: var(--theme-secondary-text, rgba(255, 255, 255, 0.7));
    }
</style>