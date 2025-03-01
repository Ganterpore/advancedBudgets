<script>
  import { page } from "$app/stores";
  import AppBar from "$lib/components/sharedComponents/AppBar.svelte";
  import {openPopup} from "$lib/store";
  import {goto} from "$app/navigation";
  import BottomNavigation from "$lib/components/sharedComponents/BottomNavigation.svelte";
  export let data
  async function openAccountPopup () {
    $openPopup = 'newAccount'
  }
  function openSettings () {
    goto('/settings')
  }
</script>

<AppBar title="Welcome {data.user?.username ?? ''}"
        leftButton={{ name: 'Settings', action: openSettings }}
        rightButtons={[{ name: 'Add Account', action: openAccountPopup }]}/>
<div>
  <h1>{$page.error.message}</h1>
</div>

<BottomNavigation selected=""/>

<style>
  h1 {
    color: var(--theme-secondary-text);
  }
  div {
    background-color: var(--theme-secondary);
    margin: 20px;
    padding: 20px;
    border-radius: 5px
  }
</style>