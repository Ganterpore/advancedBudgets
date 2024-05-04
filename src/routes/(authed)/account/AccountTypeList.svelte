<script lang="ts">
  import AccountTypeListItem from './AccountTypeListItem.svelte'
  import List from '$lib/components/List.svelte'
  import { AccountType } from './types'
  export let onSelected: () => void = () => {}

</script>

<List secondary selectable onSelected={onSelected} list={Object.values(AccountType).map(a => {
  return {
    id: a,
    header: AccountTypeListItem,
    headerProps: { id: a }
  }
})} />