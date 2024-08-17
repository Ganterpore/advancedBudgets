<script lang="ts">
  import type { Investment } from '$lib/types/accountTypes'
  import InvestmentHeader from '$lib/components/accountComponents/InvestmentHeader.svelte'
  import ListItem from '$lib/components/sharedComponents/ListItem.svelte'

  export let investments: Investment[]
</script>

{#each investments as investment}
  <ListItem>
    <InvestmentHeader investment={investment}/>
  </ListItem>
{/each}