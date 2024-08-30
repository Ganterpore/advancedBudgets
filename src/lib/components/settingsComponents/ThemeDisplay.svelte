<script lang="ts">
  import type { Theme } from '$lib/types/userTypes'
  import { toCapitalCase } from '$lib/helpers/sharedHelpers'

  export let name: string
  export let theme: Theme
  export let isChosen: boolean
</script>

<div class="container">
  <input type="checkbox" checked={isChosen}>
  <p class="text">{toCapitalCase(name)}</p>
  <div class="color" style="flex-grow: 3; background-color: {theme.background}"/>
  <div class="color" style="flex-grow: 2; background-color: {theme.primary}"/>
  <div class="color" style="flex-grow: 1; background-color: {theme.secondary}"/>
  <div class="color" style="flex-grow: 1; background-color: {theme.tertiary}"/>
  <div class="color" style="flex-grow: 1; background-color: {theme.highlight}"/>
  <div class="color" style="flex-grow: 1; background-color: {theme.text}"/>
  <div class="color" style="flex-grow: 1; background-color: {theme['secondary-text']}"/>
  <div class="color" style="flex-grow: 1; background-color: {theme.alert}"/>
  <div class="color" style="flex-grow: 1; background-color: {theme.plain}"/>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    padding: 5px;
    gap: 5px;
  }
  .text {
    color: var(--theme-secondary-text);
    width: 10ch;
  }
</style>