<script lang="ts">
  import ParentAccountHeader from './ParentAccountHeader.svelte'
  import type { ParentAccountTotals } from '$lib/types/transactionTypes'
  import type { AccountNode } from '$lib/types/accountTypes'
  import List from '$lib/components/sharedComponents/List.svelte'
  import AccountList from '$lib/components/accountComponents/AccountList.svelte'

  export let totals: ParentAccountTotals
  export let accounts: { [key: number]: AccountNode }
  export let onSelect: (isParent: boolean, id: string) => void
</script>

<List
    selectable onSelected={(id) => onSelect(true, id)}
    list={Object.values(accounts ?? {}).filter(a => !a.archived).map(a => {
      const children = Object.values(a.children)
      const hasChildren = children.length > 0
      return {
       id: a.id,
       header: ParentAccountHeader,
       headerProps: { name: a.name, id: a.id, value: totals[a.id]?.value },
       child: hasChildren ? AccountList : undefined,
       childProps: !hasChildren ? undefined : {
           parent: a.id,
           accounts: children,
           totals: totals[a.id]?.children ?? {},
           onSelect
       }
  }})}/>