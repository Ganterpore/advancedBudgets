<script lang="ts">
  import type { BudgetExcess } from '$lib/types/budgetTypes'
  import type { AccountTree } from '$lib/types/accountTypes'
  import AllAccountsDropdown from '$lib/components/accountComponents/AllAccountsDropdown.svelte'

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
          <AllAccountsDropdown accounts={allAccounts} bind:selectedAccount={accountToAdd} accountsToIgnore={excessAccounts.map(e => e.account)} />
          <button on:click={() => addAccountCallback(accountToAdd)}>Add</button>
      {/if}
      <button on:click={edit}>{isEditing ? 'Save' : 'Edit'}</button>
    </div>


  <div class="excessList">
    {#each excessAccounts as account}
      <div class="excessListItem">
        {account.name}
        <div style="flex-grow: 1"></div>
        {#if isEditing}
          <input class="proportionInput" type="number" bind:value={account.proportion} />
        {/if}
        {((account.proportion / totalProportion) * 100).toFixed(2)}%
        {#if isEditing}
          <button on:click={() => removeAccountCallback(account.id)}>x</button>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .excessList {
    width: fit-content;
  }
  .excessListItem {
    display: flex;
    gap: 5px;
    padding: 2px 5px;
    justify-content: end;
    background: var(--theme-secondary);
    color: var(--theme-secondary-text)
  }
  .proportionInput {
    width: 5ch;
  }
</style>