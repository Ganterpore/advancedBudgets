<script lang="ts">
  import type { Investment } from '$lib/types/accountTypes'
  import InvestmentHeader from '$lib/components/accountComponents/InvestmentHeader.svelte'
  import ListItem from '$lib/components/sharedComponents/ListItem.svelte'
  import { goto } from '$app/navigation'

  export let investments: Investment[]
</script>

{#each investments as investment}
  <ListItem selectable onSelected={() => goto(`/investment/${investment.id}`)}>
    <InvestmentHeader investment={investment}/>
  </ListItem>
{/each}