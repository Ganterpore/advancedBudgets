<script>
  import { openPopup } from '$lib/store.ts'
  import { fade, fly } from 'svelte/transition'

  export let id
  export let onClose = undefined
  $: isHidden = id !== $openPopup

  function onCloseWrapper () {
    $openPopup = false
    if (onClose) onClose()
  }
  function onKeyDown (event) {
      if (event.key === 'Escape') {
          onCloseWrapper()
      }
  }
</script>

{#if !isHidden}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal" on:click|self={onCloseWrapper} transition:fade={{duration: 500}} on:keydown={onKeyDown}>
        <div class="content" transition:fly={{ duration: 500, y: 100 }}>
            <button class="close-button" on:click={onCloseWrapper}>&times;</button>
            <slot />
        </div>
    </div>
{/if}

<style>
    .modal {
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
        border-width: 0;
    }
    .content {
        position: relative;
        background-color: var(--theme-background);
        margin: 15% auto;
        padding: 20px;
        border-radius: 5px;
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .close-button {
        position: absolute;
        top: 0;
        right: 0.5rem;
        color: var(--theme-highlight);
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        background: none;
        border: none;
    }
    .close-button:hover,
    .close-button:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
</style>