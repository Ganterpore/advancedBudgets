<script>
  import Popup from '$lib/components/Popup.svelte'
  import Input from '$lib/components/Input.svelte'
  import Button from '$lib/components/Button.svelte'

  export let data
  export let form
</script>

<Popup id="newAccount">
    <h1 style="margin: 0">Create a new account</h1>
    <p style="font-style: italic">This should reflect a real world bank account</p>
    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}
    <form method="POST" action="?/createAccount" style="display: flex; flex-direction: row; justify-content: center; align-items: center">
        <p>Account Name:</p>
        <Input name="accountName" />
        <Button>Create</Button>
    </form>
</Popup>
