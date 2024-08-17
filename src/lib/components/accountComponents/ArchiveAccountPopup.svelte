<script lang="ts">
  import Popup from '$lib/components/sharedComponents/Popup.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'
  import { openPopup } from '$lib/store'
  import { AccountHierarchy } from '../../../params/accountHierarchy'
  import { goto, invalidate } from '$app/navigation'
  import Alert from '$lib/components/sharedComponents/Alert.svelte'

  export let accountId: number
  export let isParent: boolean
  let error: string

  async function onClick () {
    const endpoint = isParent ? AccountHierarchy.PARENT_ACCOUNT : AccountHierarchy.ACCOUNT
    const res = await fetch(`/${endpoint}/${accountId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.status === 204) {
      $openPopup = false
      await invalidate('data:accounts')
      await goto('/')
    } else {
      const body = await res.json()
      error = body.error ?? body.message
    }
  }
  function onExit () {
    error = ''
    $openPopup = false
  }
</script>

<Popup id="archiveAccount" onClose={onExit}>
  <h1>Archive {isParent ? 'Parent' : ''} Account</h1>
  <p>Are you sure you want to archive this account?</p>
  {#if error}
    <Alert>{error}</Alert>
  {/if}
  <div>
    <Button on:click={onClick}>Yes</Button>
    <Button secondary={true} on:click={onExit}>No</Button>
  </div>
</Popup>