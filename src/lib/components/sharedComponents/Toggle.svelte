<script lang="ts">
  import { tweened } from "svelte/motion";

  export let value1: string
  export let value2: string
  export let selected: string

  const toggle = () => {
    if (selected === value1) selected = value2
    else selected = value1
  }

  const leftTween = tweened(0, { duration: 100 })
  const widthTween = tweened(0, { duration: 100 })

  $: leftTween.set((selected === value1) ? 1 : value1.length + 8)
  $: widthTween.set((selected === value1) ? value1.length + 10 : value2.length + 10)
</script>

<button class="toggle" on:click={toggle} style="--left-distance:{$leftTween}ch; --width:{$widthTween}ch;">
  <span class="highlight"></span>
  <span class="item {selected===value1 ? 'active' : ''}">{value1}</span>
  <span class="item {selected===value2 ? 'active' : ''}">{value2}</span>
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
  }
  .highlight {
    background-color: var(--theme-highlight);
    width: var(--width);
    height: 25px;
    border-radius: 2ch;
    position: absolute;
    left: var(--left-distance);
  }
  .item {
    color: var(--theme-secondary-text);
    border-radius: 5rem;
    padding: 5px 5ch;
    margin: 0;
    z-index: 1;
  }
</style>