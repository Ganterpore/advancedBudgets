<script lang="ts">
  import Navigation from '$lib/components/sharedComponents/Navigation.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import type { ButtonContent } from '$lib/types/appBar'

  export let title: string
  export let leftButton: ButtonContent | undefined = undefined
  export let rightButton: ButtonContent | undefined = undefined
</script>

<Navigation>
  {#if leftButton}
    <Button on:click={leftButton.action}>{leftButton.name}</Button>
  {/if}
  <h1>{title}</h1>
  <div style="flex-grow: 1"></div>
  {#if rightButton}
    <Button on:click={rightButton.action}>{rightButton.name}</Button>
  {/if}
</Navigation>