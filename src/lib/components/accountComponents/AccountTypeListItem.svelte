<script lang="ts">
  import { accountTypeDescriptions, accountTypeIcons } from '$lib/types/accountTypes'

  export let id: string

  $: Icon = id ? accountTypeIcons[id] : undefined
  $: description = id ? accountTypeDescriptions[id] : undefined
</script>

<div class="container">
  <div class="icon">
    <svelte:component this={Icon}/>
  </div>
  <div class="textContainer">
    <p class="name">{id}</p>
    <p class="description">{description}</p>
  </div>
</div>

<style>
  .container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--theme-secondary);
    border-radius: 5px;
  }
  .icon {
    padding: 10px 25px;
    color: var(--theme-highlight);
  }
  .textContainer {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    height: min-content;
    justify-content: center;
  }
  p {
    color: var(--theme-secondary-text);
  }
  .name {
    font-weight: bold;
    height: min-content;
  }
  .description {
    font-style: italic;
    font-weight: normal;
    padding-bottom: 10px;
  }
  p {
    align-items: center;
  }
</style>