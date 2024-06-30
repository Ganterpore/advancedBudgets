<script>
  import EpBack from '~icons/ep/back';
  import { page } from '$app/stores'
  import {openPopup} from '$lib/store.ts'
  import Button from '$lib/components/Button.svelte'
  import Navigation from '$lib/components/Navigation.svelte'
  import ParentAccountPopup from './parentAccount/ParentAccountPopup.svelte'
  import { goto } from '$app/navigation'
  export let data

  async function openAccountPopup () {
    $openPopup = 'newAccount'
  }

  $: pathname = $page.url.pathname
  $: title = pathname === '/'
    ? `Welcome ${data.user?.username ?? ''}`
    : pathname.split('/')[1].charAt(0).toUpperCase() + pathname.split('/')[1].slice(1)

  const handleLogout = async () => goto('/logout')
</script>

<Navigation>
    {#if $page.url.pathname === '/'}
        <Button on:click={handleLogout}>log out</Button>
    {:else}
        <Button on:click={() => goto('/')}><EpBack /></Button>
    {/if}
    <h1>{title}</h1>
    <div style="flex-grow: 1"></div>
    {#if $page.url.pathname === '/'}
        <div><Button on:click={openAccountPopup}>Add Account</Button></div>
    {/if}
</Navigation>

<ParentAccountPopup/>

<slot/>

<style>
    div {
        align-content: center;
    }
</style>