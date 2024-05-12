<script>
  import List from '$lib/components/List.svelte'
  import TransactionListItem from './TransactionListItem.svelte'

  export let data
</script>

<div class="container">
  <div class="listContainer">
    <List secondary list={data.transactions.map(t => ({id: t.id, header: TransactionListItem, headerProps: {
        id: t.id,
        description: t.description,
        amount: t.amount,
        accountName: t.accountName
      }
    }))}/>
  </div>
</div>

<style>
  .container {
      display: flex;
      justify-content: center;
  }
  .listContainer {
      max-width: 600px;
      flex-grow: 1;
  }
</style>
