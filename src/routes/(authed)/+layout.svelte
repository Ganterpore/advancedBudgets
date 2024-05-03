<script>
  import { openPopup } from '$lib/store.ts'
  import Button from '$lib/components/Button.svelte'
  import Navigation from '$lib/components/Navigation.svelte'
  export let data

  async function openAccountPopup () {
    $openPopup = 'newAccount'
  }
</script>

<Navigation>
    <h1>Welcome {data.user?.username ?? ''}</h1>
    <div style="flex-grow: 1"></div>
    <div><Button on:click={openAccountPopup} preventDefault>Add</Button></div>
    <form method="POST" action="/logout">
        <Button>log out</Button>
    </form>
</Navigation>

<slot/>

<style>
    form, div {
        align-content: center;
    }
</style>