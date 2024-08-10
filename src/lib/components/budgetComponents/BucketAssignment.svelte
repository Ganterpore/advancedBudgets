<script lang="ts">
  import type { BudgetExcess } from '$lib/types/budgetTypes'
  import type { AccountTree } from '$lib/types/accountTypes'
  import AllAccountsDropdown from '$lib/components/accountComponents/AllAccountsDropdown.svelte'
  import { currencyToString } from '$lib/utils'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'

  export let allAccounts: AccountTree
  export let addAccountCallback: (id) => Promise<void>
  export let updateAccountCallback: (BudgetExcess) => Promise<void>
  export let removeAccountCallback: (id) => Promise<void>
  export let excessAccounts: (BudgetExcess & { name: string })[]

  let accountToAdd = allAccounts[0]?.children[0]
  $: totalProportion = excessAccounts.reduce((total, acc) => total + Number(acc.proportion), 0)

  let isEditing = false
  async function edit () {
    if (isEditing) {
      for (const account of excessAccounts) {
        await updateAccountCallback(account)
      }
    }
    isEditing = !isEditing
  }
</script>

<div class="main">
    <div class="newAccount">
      {#if isEditing}
          <AllAccountsDropdown style="flex-grow: 1" accounts={allAccounts} bind:selectedAccount={accountToAdd} accountsToIgnore={excessAccounts.map(e => e.account)} />
          <Button on:click={() => addAccountCallback(accountToAdd)}>Add</Button>
      {/if}
      <div style="flex-grow: 1"></div>
      <Button on:click={edit}>{isEditing ? 'Save' : 'Edit'}</Button>
    </div>


  <div class="excessList">
    {#each excessAccounts as account}
      <div class="excessListItem">
        <p>{account.name}</p>
        <div style="flex-grow: 1"></div>
        <div class="inner">
          {#if isEditing}
            <Input style="width: 5ch" type="number" bind:value={account.proportion} />
          {/if}
          {#if isEditing || account.actualAmountAdded === 0}
            {((account.proportion / totalProportion) * 100).toFixed(2)}%
          {/if}
          {#if isEditing}
            <Button warning={true} on:click={() => removeAccountCallback(account.id)}>x</Button>
          {/if}
          {#if !isEditing && account.actualAmountAdded !== 0}
            {currencyToString(account.actualAmountAdded)}
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