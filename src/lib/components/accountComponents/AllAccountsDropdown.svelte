<script lang="ts">
  import type { Account } from '$lib/types/accountTypes'

  export let accounts: Account[]
  export let selectedAccount: number
  export let accountsToIgnore: number[] = []

</script>

<select {...$$restProps } bind:value={selectedAccount}>
  {#each accounts as accountItem}
    {#if !accountsToIgnore.includes(accountItem.id)}
      <option id={accountItem.id} value={accountItem.id}>{accountItem.type}: {accountItem.name}</option>
    {/if}
  {/each}
</select>