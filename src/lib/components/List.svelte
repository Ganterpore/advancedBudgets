<script lang="ts">
  import * as svelte from 'svelte'

  export type ListItem = {
    id: string
    header?: svelte.ComponentType
    headerProps?: any
    child?: svelte.ComponentType
    childProps?: any
  }
  export let list: ListItem[] = []
  export let secondary: boolean = false
  export let selectable: boolean = false
  export let onSelected: (id: string) => void = () => {}
</script>

<div style="width: 100%; margin-top: 20px">
  {#each list as listItem}
    <div class="content">
      <div class={`list-item ${secondary ? 'secondary' : ''} ${selectable ? 'selectable' : ''}`}
        on:click={() => onSelected(listItem.id)}>
        <svelte:component this={listItem.header} {...listItem.headerProps}/>
      </div>
      {#if listItem.child}
        <div class="children">
          <svelte:component this={listItem.child} {...listItem.childProps}/>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
    .content {
        display: flex;
        margin: 5px;
        flex-direction: column;
    }
    .list-item {
        background-color: var(--theme-secondary);
        color: var(--theme-secondary-text);
        font-size: 32px;

        font-weight: bold;
        border-radius: 5px;
    }
    .list-item.secondary {
        background-color: var(--theme-primary);
        color: var(--theme-text);
        font-size: medium;
    }
    .list-item.selectable {
        cursor: pointer;
    }
    .list-item.selectable:hover {
        transform: translateY(-1px);
        background-color: var(--theme-tertiary);
        box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    }
    .children {
        margin: 0 5px;
        padding: 0;
        background-color: var(--theme-tertiary);
    }
</style>