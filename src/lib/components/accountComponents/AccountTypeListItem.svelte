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
      display: flex;
      flex-direction: row;
      align-items: center;
  }
  .icon {
      padding: 10px 25px;
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
      color: var(--theme-text);
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