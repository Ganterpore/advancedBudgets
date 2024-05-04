<script lang="ts">
  import type { AccountTree } from '../../db/models/parentAccounts'
  import List from '$lib/components/List.svelte'
  import ParentAccountHeader from './parentAccount/ParentAccountHeader.svelte'
  import AccountPopup from './account/AccountPopup.svelte'
  import AccountHeader from './account/AccountHeader.svelte'
  export let data

  let accounts: AccountTree = data?.accounts
</script>

<List list={Object.values(data.accounts).map(a => {
  const children = Object.values(a.children)
  const hasChildren = children.length > 0
  return {
   id: a.id,
   header: ParentAccountHeader,
   headerProps: { name: a.name, id: a.id },
   child: hasChildren ? List: undefined,
   childProps: !hasChildren ? undefined : {
     secondary: true,
     list: Object.values(a.children)
       ? Object.values(a.children).map(c => {
         return {
          header: AccountHeader,
          headerProps: {
            name: c.name,
            id: c.id,
            type: c.type
          }
         }
       })
       : []
   }
  }})} />
<AccountPopup/>
