<script lang="ts">
  import {themes} from "$lib/types/userTypes";

  let settings
  export let data
  $: ({ settings } = data)
  $: selectedTheme = (settings.theme && themes[settings.theme]) ?? themes.default
  $: styles = Object.entries(selectedTheme)
    .map(([key, value]) => `--theme-${key}:${value}`)
    .join(';');
</script>

<div class="root" style={styles} >
  <slot />
</div>

<style>
  :root {
    --theme-background: #161c91;
    --theme-primary: #4a4de7;
    --theme-secondary: #7ea6f4;
    --theme-tertiary: #060c81;
    --theme-highlight: #a0e4f1;
    --theme-text: #a0e4f1;
    --theme-text-light: #a0e4f199;
    --theme-secondary-text: #161c91;
    --theme-alert: #ff6700;
    --theme-plain: #3e66b4;
  }
  .root {
    background-color: var(--theme-background);
    color: var(--theme-highlight);
    font-family: sans-serif;
    min-height: 100vh;
    min-width: 100vw;
    margin: 0;
    padding: 0;
    left: 0;
    top: 0;
  }
</style>
