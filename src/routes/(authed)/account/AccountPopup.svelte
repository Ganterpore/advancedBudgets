<script lang="ts">
  import EpBack from '~icons/ep/back';
  import { openPopup, selectedParentAccount } from '$lib/store.ts'
  import Button from '$lib/components/Button.svelte'
  import Input from '$lib/components/Input.svelte'
  import Popup from '$lib/components/Popup.svelte'
  import Alert from '$lib/components/Alert.svelte'
  import AccountTypeList from './AccountTypeList.svelte'
  import type { Account, AccountTypes } from '../../../db/models/accounts.js'
  import AccountTypeListItem from './AccountTypeListItem.svelte'
  import { invalidate } from '$app/navigation';

  let accountName: string
  let error: string
  if (!accountName) accountName = ''

  let accountType: AccountTypes | undefined

  async function createAccount () {
    const accountBody: Omit<Account, 'id'> = {
      name: accountName,
      type: accountType!,
      parent: $selectedParentAccount
    }
    const res = await fetch('/account', {
      method: 'POST',
      body: JSON.stringify(accountBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const body = await res.json()
    if (res.status === 201) {
      onClose()
      $openPopup = false
      await invalidate('data:accounts')
    } else {
      error = body.error
    }
  }

  function onClose () {
    accountType = undefined
    accountName = ''
    error = ''
  }

  function onSelected (id: string) {
    accountType = id as AccountTypes
  }
</script>

<Popup id="childAccount" onClose={onClose}>
  <p class="header" >Choose an account type</p>
  {#if !accountType}
  <AccountTypeList onSelected={onSelected}/>
  {:else }
    <div class="topBar">
      <Button onClick={() => accountType = undefined}>
        <EpBack />
      </Button>
      <AccountTypeListItem id={accountType} />
    </div>
    {#if error}
      <Alert>{error}</Alert>
    {/if}
    <form class="form">
      <Input autofocus label="Name" name="accountName" bind:value={accountName}/>
      <div><Button onClick={() => createAccount()} preventDefault>Create</Button></div>
    </form>
  {/if}
</Popup>

<style>
  .header {
      margin: 0;
      color: var(--theme-text);
      font-size: larger;
      font-weight: bold;
  }
  .topBar {
      display: flex;
      flex-direction: row;
      justify-content: start;
  }
  .form {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
  }
</style>