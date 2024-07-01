<script lang="ts">
  import AccountTypeListItem from './AccountTypeListItem.svelte'
  import { AccountType } from '$lib/types/accountTypes'
  import List from '$lib/components/sharedComponents/List.svelte'
  export let onSelected: () => void = () => {}

</script>

<List secondary selectable onSelected={onSelected} list={Object.values(AccountType).map(a => {
  return {
    id: a,
    header: AccountTypeListItem,
    headerProps: { id: a }
  }
})} />