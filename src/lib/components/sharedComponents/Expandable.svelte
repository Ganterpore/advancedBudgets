<script>
  import MaterialSymbolsExpandMore from '~icons/material-symbols/expand-more';
  import {writable} from "svelte/store";
  import {tweened} from "svelte/motion";
  import { cubicIn } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  const expanded = writable(false)
  const rotation = tweened(0, { duration: 100, easing: cubicIn })

  export let name

  function onclick () {
    expanded.set(!$expanded)
    rotation.set($expanded ? 180 : 0)
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div class="expandableHeader" on:click={onclick}>
  <h3>{name}</h3>
  <slot name="header" />
  <div style={`rotate: ${$rotation + 'deg'}`}><MaterialSymbolsExpandMore /></div>
</div>
{#if $expanded}
  <div transition:slide={{duration: 200}}>
    <slot />
  </div>
{/if}

<style>
  .expandableHeader {
      background-color: var(--theme-plain);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 5px;
      border-width: 2px;
      gap: 5px;
  }
  .expandableHeader:hover {
      filter: brightness(85%);
  }
</style>