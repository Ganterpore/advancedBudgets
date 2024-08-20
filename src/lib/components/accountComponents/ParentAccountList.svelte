<script lang="ts">
  import ParentAccountHeader from './ParentAccountHeader.svelte'
  import type { ParentAccountTotals } from '$lib/types/transactionTypes'
  import type { AccountNode } from '$lib/types/accountTypes'
  import AccountList from '$lib/components/accountComponents/AccountList.svelte'
  import ListItem from '$lib/components/sharedComponents/ListItem.svelte'

  export let totals: ParentAccountTotals
  export let accounts: { [key: number]: AccountNode }
  export let onSelect: (isParent: boolean, id: string) => void
</script>

{#each Object.values(accounts ?? {}) as a}
  <ListItem selectable style="margin: 5px 5px 0 5px"
    onSelected={() => onSelect(true, a.id)}>
    <ParentAccountHeader
      name={a.name} id={a.id} value={totals[a.id]?.value} />
  </ListItem>
  <AccountList parent={a.id}
               accounts={Object.values(a.children)}
               totals={totals[a.id]?.children ?? {}}
               onSelect={onSelect} />
{/each}