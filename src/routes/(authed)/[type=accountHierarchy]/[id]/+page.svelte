<script>

  import List from "$lib/components/sharedComponents/List.svelte";
  import TransactionListItem from "$lib/components/transactionComponents/TransactionListItem.svelte";
  import AppBar from "$lib/components/sharedComponents/AppBar.svelte";
  import {goto} from "$app/navigation";

  export let data
</script>

<AppBar title="{data.account.name}"
        leftButton={{ name: 'Back', action: () => goto('/') }} />

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
