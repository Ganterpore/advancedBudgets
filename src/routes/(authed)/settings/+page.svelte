<script>
  import AppBar from "$lib/components/sharedComponents/AppBar.svelte";
  import {goto, invalidate} from "$app/navigation";
  import Expandable from "$lib/components/sharedComponents/Expandable.svelte";
  import {themes} from "$lib/types/userTypes";
  import ListItem from "$lib/components/sharedComponents/ListItem.svelte";
  import ThemeDisplay from "$lib/components/settingsComponents/ThemeDisplay.svelte";
  import Alert from "$lib/components/sharedComponents/Alert.svelte";

  export let data
  let settings = data.settings
  let isLoading = false
  let error

  const handleLogout = async () => goto('/logout')
  const handleSave = async () => {
    if (isLoading) return
    isLoading = true
    const res = await fetch('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    isLoading = false
    if (res.status === 204) {
      await invalidate('data:settings')
      await goto('/')
    } else {
      const responseBody = await res.json()
      error = responseBody.message
    }
  }

  $: selectedTheme = (settings.theme && themes[settings.theme]) ?? themes.default
  $: styles = Object.entries(selectedTheme)
    .map(([key, value]) => `--theme-${key}:${value}`)
    .join(';');
</script>

<AppBar title="Settings"
        leftButton={{ name: 'Log Out', action: handleLogout }}
        rightButtons={[{ name: 'Save', action: handleSave }]}/>

<div class="container">
  {#if error}<Alert>{error}</Alert>{/if}
  <div class="theming" style={styles}>
    <Expandable name="Themes">
      {#each Object.keys(themes) as theme}
        <ListItem selectable={true} onSelected={() => settings.theme = theme}>
          <ThemeDisplay name={theme} theme={themes[theme]} isChosen={theme===settings.theme} />
        </ListItem>
      {/each}
    </Expandable>
  </div>
</div>

<style>
  .container {
    margin: 0 20px;
  }
</style>