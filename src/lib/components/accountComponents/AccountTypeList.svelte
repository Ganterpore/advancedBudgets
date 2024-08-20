<script lang="ts">
  import AccountTypeListItem from './AccountTypeListItem.svelte'
  import { AccountType } from '$lib/types/accountTypes'
  import ListItem from '$lib/components/sharedComponents/ListItem.svelte'
  export let onSelected: (id: number) => void = () => {}

</script>

{#each Object.values(AccountType) as a}
  <ListItem style="width: 100%" secondary selectable onSelected={() => onSelected(a)}>
    <AccountTypeListItem id={a} />
  </ListItem>
{/each}
