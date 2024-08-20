<script lang="ts">
  export let secondary: boolean = false
  export let selectable: boolean = false
  export let onSelected: () => void = () => {}
</script>

<div class="content" {...$$restProps}>
  <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
  <div class={`list-item ${secondary ? 'secondary' : ''} ${selectable ? 'selectable' : ''}`}
       on:click={() => onSelected()}>
    <slot/>
  </div>
  <div class="children">
    <slot name="children"/>
  </div>
</div>


<style>
  .content {
    display: flex;
    margin: 5px;
    flex-direction: column;
  }
  .list-item {
    background-color: var(--theme-secondary);
    border-radius: 5px;
  }
  .list-item.secondary {
    background-color: var(--theme-primary);
    color: var(--theme-text);
  }
  .list-item.selectable {
    cursor: pointer;
  }
  .list-item.selectable:hover {
    transform: translateY(-1px);
    filter: brightness(70%);
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  }
  .children {
    margin: 0 5px;
    padding: 0;
    background-color: var(--theme-tertiary);
  }
</style>