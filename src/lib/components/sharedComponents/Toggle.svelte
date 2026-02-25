<script lang="ts">
  import { tweened } from "svelte/motion";

  export let values: string[]
  export let selected: string = values[0]
  export let disabled = false
  export let onChange: (() => void) | undefined = undefined

  const select = (value: string) => {
    if (disabled) return
    if (values.length === 2) {
      selected = selected === values[0] ? values[1] : values[0]
    } else {
      selected = value
    }
    onChange?.()
  }

  const leftTween = tweened(0, { duration: 100 })
  const widthTween = tweened(0, { duration: 100 })

  $: {
    const idx = values.indexOf(selected)
    const preceding = values.slice(0, idx)
    const leftOffset = preceding.reduce((acc, v) => acc + v.length + 8, 0) + (idx > 0 ? 1 : 0)
    leftTween.set(leftOffset)
    widthTween.set((values[idx]?.length ?? 0) + 10)
  }
</script>

<button class="toggle" on:click|self={() => {}} style="--left-distance:{$leftTween}ch; --width:{$widthTween}ch;">
  <span class="highlight"></span>
  {#each values as value}
    <span
      class="item {selected === value ? 'active' : ''}"
      on:click={() => select(value)}
      on:keydown={(e) => e.key === 'Enter' && select(value)}
      role="button"
      tabindex="0"
    >
      {value}
    </span>
  {/each}
</button>

<style>
  .toggle {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: var(--theme-plain);
    border-radius: 2ch;
    margin: 0;
    padding: 0;
    width: fit-content;
    position: relative;
    border: none;
    cursor: pointer;
  }
  .highlight {
    background-color: var(--theme-highlight);
    width: var(--width);
    height: 25px;
    border-radius: 2ch;
    position: absolute;
    left: var(--left-distance);
    transition: none;
  }
  .item {
    color: var(--theme-secondary-text);
    border-radius: 5rem;
    padding: 5px 5ch;
    margin: 0;
    z-index: 1;
    cursor: pointer;
    user-select: none;
  }
</style>