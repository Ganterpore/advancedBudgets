<script lang="ts">
  import List from '$lib/components/List.svelte'
  import ParentAccountHeader from './parentAccount/ParentAccountHeader.svelte'
  import AccountPopup from './account/AccountPopup.svelte'
  import TransactionPopup from './transactions/TransacionPopup.svelte'
  import AccountHeader from './account/AccountHeader.svelte'
  import { goto } from '$app/navigation'
  export let data
  $: totals = data.totals

  function onSelected (isParent: boolean) {
    return (id: string) => {
      const url = `/transactions/${isParent ? 'parentAccount/' : 'account/'}${id}`
      throw goto(url)
    }
  }
</script>

<List
    selectable onSelected={onSelected(true)}
    list={Object.values(data.accounts).map(a => {
      const children = Object.values(a.children)
      const hasChildren = children.length > 0
      return {
       id: a.id,
       header: ParentAccountHeader,
       headerProps: { name: a.name, id: a.id, value: totals[a.id]?.value },
       child: hasChildren ? List: undefined,
       childProps: !hasChildren ? undefined : {
         selectable: true,
         onSelected: onSelected(false),
         secondary: true,
         list: Object.values(a.children)
           ? Object.values(a.children).map(c => {
             return {
               id: c.id,
               header: AccountHeader,
               headerProps: {
                 name: c.name,
                 id: c.id,
                 type: c.type,
                 value: totals[a.id]?.children[c.id]
              }
             }
           })
           : []
       }
  }})} />
<AccountPopup/>
<TransactionPopup />
