<script>
  import { openPopup } from '$lib/store.ts'
  import { fade, fly } from 'svelte/transition'
  import { onMount } from 'svelte'

  export let id
  export let onClose = undefined
  export let isOpen = undefined
  let portalTarget

  $: isHidden = checkIsHidden(isOpen, $openPopup)

  function checkIsHidden (isOpen, openPoupId) {
    if (isOpen === undefined) {
      return id !== openPoupId
    } else {
      return !isOpen
    }
  }

  function onCloseWrapper () {
    $openPopup = false
    if (onClose) onClose()
  }
  function onKeyDown (event) {
    if (event.key === 'Escape') {
      onCloseWrapper()
    }
  }

  onMount(() => {
    // Find the root div and create portal target
    const rootElement = document.querySelector('.root')
    if (rootElement) {
      portalTarget = document.createElement('div')
      portalTarget.id = `popup-portal-${id}`
      rootElement.appendChild(portalTarget)
    }

    return () => {
      // Cleanup
      if (portalTarget && portalTarget.parentNode) {
        portalTarget.parentNode.removeChild(portalTarget)
      }
    }
  })
</script>

{#if !isHidden && portalTarget}
  <div use:portal={portalTarget}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal" on:click|self={onCloseWrapper} transition:fade={{duration: 500}} on:keydown={onKeyDown}>
      <div class="content" transition:fly={{ duration: 500, y: 100 }}>
        <button class="close-button" on:click={onCloseWrapper}>&times;</button>
        <slot />
      </div>
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
    background-color: var(--theme-primary);
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

<script context="module">
  // Portal action
  function portal(node, target) {
    target.appendChild(node)
    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node)
        }
      }
    }
  }
</script>