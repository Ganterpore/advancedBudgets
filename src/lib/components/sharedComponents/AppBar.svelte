<script lang="ts">
  import Navigation from '$lib/components/sharedComponents/Navigation.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import type { ButtonContent } from '$lib/types/appBar'

  export let title: string
  export let leftButton: ButtonContent | undefined = undefined
  export let rightButtons: ButtonContent[] | undefined = undefined
</script>

<Navigation>
  {#if leftButton}
    <Button on:click={leftButton.action}>{leftButton.name}</Button>
  {/if}
  <h1>{title}</h1>
  <div style="flex-grow: 1"></div>
  {#if rightButtons}
    {#each rightButtons as rightButton}
      <Button on:click={rightButton.action}>{rightButton.name}</Button>
    {/each}
  {/if}
</Navigation>

<style>
  h1 {
      margin: 5px;
      align-self: center;
  }
</style>