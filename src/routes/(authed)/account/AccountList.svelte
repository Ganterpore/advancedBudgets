<script lang="ts">
    import List from "$lib/components/List.svelte"
    import type { Account } from "./types";
    import AccountHeader from "./AccountHeader.svelte";
    import type { AccountTotals } from "../transactions/types";
    import Expandable from "$lib/components/Expandable.svelte";

    export let accounts: Account[]
    export let totals: AccountTotals[]
    export let onSelect: (isParent: boolean, id: string) => void

    const accountMap = {}
    for (const account of accounts) {
      if (!accountMap[account.type]) {
        accountMap[account.type] = []
      }
      accountMap[account.type].push(account)
    }
</script>

{#each Object.keys(accountMap) as category (category)}
  <Expandable name={category} >
    <List selectable secondary onSelected={(id) => onSelect(false, id)}
          list={accountMap[category].map(a => {
        return {
            id: a.id,
            header: AccountHeader,
            headerProps: {
                name: a.name,
                id: a.id,
                type: a.type,
                value: totals[a.id]
            }
        }
    })} />
  </Expandable>
{/each}
