<script lang="ts">
  import type { AccountTree } from '$lib/types/accountTypes'
  import AllAccountsDropdown from '$lib/components/accountComponents/AllAccountsDropdown.svelte'
  import { currencyToString } from '$lib/utils'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'

  type Bucket = { id: number, account: number, name: string, plannedAmount: number, actualAmount: number }

  export let allAccounts: AccountTree
  export let addAccountCallback: (id) => Promise<void>
  export let updateAccountCallback: (Bucket) => Promise<void>
  export let removeAccountCallback: (id) => Promise<void>
  export let selectedAccounts: Bucket[]
  export let type: 'percent' | 'max' = 'percent'

  let accountToAdd = allAccounts[0]?.children[0]
  $: totalProportion = selectedAccounts.reduce((total, acc) => total + Number(acc.plannedAmount), 0)

  let isEditing = false
  async function edit () {
    if (isEditing) {
      for (const account of selectedAccounts) {
        await updateAccountCallback(account)
      }
    }
    isEditing = !isEditing
  }
</script>

<div class="main">
    <div class="newAccount">
      {#if isEditing}
          <AllAccountsDropdown style="flex-grow: 1" accounts={allAccounts} bind:selectedAccount={accountToAdd} accountsToIgnore={selectedAccounts.map(e => e.account)} />
          <Button on:click={() => addAccountCallback(accountToAdd)}>Add</Button>
      {/if}
      <div style="flex-grow: 1"></div>
      <Button on:click={edit}>{isEditing ? 'Save' : 'Edit'}</Button>
    </div>


  <div class="excessList">
    {#each selectedAccounts as account}
      <div class="excessListItem">
        <p>{account.name}</p>
        <div style="flex-grow: 1"></div>
        <div class="inner">
          {#if isEditing}
            {#if type==='max'}${/if}
            <Input style="width: 5ch" type="number" bind:value={account.plannedAmount} />
          {/if}
          {#if isEditing || account.actualAmount === 0}
            {#if type === 'percent'}
              {((account.plannedAmount / totalProportion) * 100).toFixed(2)}%
            {:else if !isEditing && type === 'max'}
              up to ${account.plannedAmount}
            {/if}
          {/if}
          {#if isEditing}
            <Button warning={true} on:click={() => removeAccountCallback(account.id)}>x</Button>
          {/if}
          {#if !isEditing && account.actualAmount !== 0}
            {currencyToString(account.actualAmount)}
          {/if}
        </div>
        <hr/>
      </div>
    {/each}
  </div>
</div>

<style>
  .newAccount {
    display: flex;
    flex-direction: row;
  }
  .excessList {
    width: 100%;
  }
  .excessList p {
    margin: 0;
    padding: 0;
  }
  .excessListItem {
    display: flex;
    gap: 5px;
    padding: 2px 5px;
    justify-content: end;
    align-items: center;
    background: var(--theme-plain);
    color: var(--theme-text);
    flex-wrap: wrap;
  }
  .inner {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  hr {
    border-radius: 5px;
    border-color: var(--theme-plain);
    width: 95%;
    padding: 0;
    margin: 0;
  }
</style>