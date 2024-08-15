<script lang="ts">
  import { openPopup } from '$lib/store.js'
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'
  import type { ParentAccount } from '$lib/types/accountTypes'
  import Toggle from '$lib/components/sharedComponents/Toggle.svelte'
  import ParentAccountForm from '$lib/components/accountComponents/ParentAccountForm.svelte'

  export let account: Pick<ParentAccount, 'name'> & Partial<ParentAccount> = {
    name: ''
  }
  let error: string
  let accountType: 'Cash' | 'Investment' = 'Cash'

  async function onSubmit () {
    if (!account.id) {
      account.name = ''
    }
    error = ''
    $openPopup = false
  }

  function onClose () {
    if (!account.id) {
      account.name = ''
    }
    error = ''
  }
</script>

<Popup id="newAccount" onClose={onClose}>
  <h1 style="margin: 0">Create a new account</h1>
  <Toggle value1="Cash" value2="Investment" bind:selected={accountType} />
  <p style="font-style: italic">This should reflect a real world bank account</p>
  {#if error}
    <Alert>{error}</Alert>
  {/if}
  <ParentAccountForm account={account} onSubmit={onSubmit} />
</Popup>