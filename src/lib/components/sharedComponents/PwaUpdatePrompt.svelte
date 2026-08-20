<script lang="ts">
  import { onMount } from 'svelte';

  let needRefresh = false;
  let offlineReady = false;
  let updateFn: (() => Promise<void>) | undefined;

  onMount(async () => {
    // Loaded dynamically so this (and its navigator/serviceWorker usage) never runs during SSR.
    const { useRegisterSW } = await import('virtual:pwa-register/svelte');
    const sw = useRegisterSW({
      onRegisterError(error: unknown) {
        console.error('Service worker registration failed', error);
      }
    });
    updateFn = sw.updateServiceWorker;
    sw.needRefresh.subscribe((v) => (needRefresh = v));
    sw.offlineReady.subscribe((v) => (offlineReady = v));
  });

  function reload() {
    updateFn?.();
  }

  function close() {
    needRefresh = false;
    offlineReady = false;
  }
</script>

{#if needRefresh}
  <div class="pwa-toast">
    <span>A new version is available.</span>
    <button on:click={reload}>Reload</button>
    <button class="dismiss" on:click={close}>&times;</button>
  </div>
{:else if offlineReady}
  <div class="pwa-toast">
    <span>App ready to work offline.</span>
    <button class="dismiss" on:click={close}>&times;</button>
  </div>
{/if}

<style>
  .pwa-toast {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: var(--theme-tertiary, #060c81);
    color: var(--theme-highlight, #a0e4f1);
    border: 1px solid var(--theme-primary, #4a4de7);
    border-radius: 8px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    font-size: 0.9rem;
  }
  .pwa-toast button {
    background: var(--theme-primary, #4a4de7);
    color: inherit;
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
  }
  .pwa-toast button.dismiss {
    background: transparent;
    padding: 0 4px;
    font-size: 1.1rem;
  }
</style>
