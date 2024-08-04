<script lang="ts">
  import type { Account, AccountNode, AccountTree } from '$lib/types/accountTypes'

  export let accounts: AccountTree
  export let selectedAccount: number
  export let accountsToIgnore: number[] = []

  let accountList: Account & { concatName: string }[]
  $: accountList = Object.values(accounts ?? {}).reduce((accs: { name: string, id: number }[], parentAccount: AccountNode) => {
    const children = parentAccount.children
    const childAccountList = Object.values(children).map(account => ({ ...account, concatName: `${parentAccount.name}: ${account.name}` }))
    return [...accs, ...childAccountList]
  }, [])
</script>

<select bind:value={selectedAccount}>
  {#each accountList as accountItem}
    {#if !accountsToIgnore.includes(accountItem.id)}
      <option id={accountItem.id} value={accountItem.id}>{accountItem.concatName}</option>
    {/if}
  {/each}
</select>