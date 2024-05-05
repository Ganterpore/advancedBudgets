<script>
  import EpBack from '~icons/ep/back';
  import { page } from '$app/stores'
  import { openPopup } from '$lib/store.ts'
  import Button from '$lib/components/Button.svelte'
  import Navigation from '$lib/components/Navigation.svelte'
  import ParentAccountPopup from './parentAccount/ParentAccountPopup.svelte'
  import { goto } from '$app/navigation'
  export let data

  async function openAccountPopup () {
    $openPopup = 'newAccount'
  }
</script>

<Navigation>
    {#if $page.url.pathname !== '/'}
        <Button onClick={() => goto('/')}><EpBack /></Button>
    {/if}
    <h1>Welcome {data.user?.username ?? ''}</h1>
    <div style="flex-grow: 1"></div>
    {#if $page.url.pathname === '/'}
        <div><Button onClick={openAccountPopup} preventDefault>Add Account</Button></div>
    {/if}
    <form method="POST" action="/logout">
        <Button>log out</Button>
    </form>
</Navigation>

<ParentAccountPopup/>

<slot/>

<style>
    form, div {
        align-content: center;
    }
</style>