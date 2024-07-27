<script lang="ts">
  import List from "$lib/components/sharedComponents/List.svelte";
  import TransactionListItem from "$lib/components/transactionComponents/TransactionListItem.svelte";
  import AppBar from "$lib/components/sharedComponents/AppBar.svelte";
  import {goto} from "$app/navigation";
  import {openPopup, selectedParentAccount} from "$lib/store";
  import ParentAccountPopup from '$lib/components/accountComponents/ParentAccountPopup.svelte'
  import AccountPopup from '$lib/components/accountComponents/AccountPopup.svelte'

  export let data

  async function editAccount () {
    if (data.isParent) {
      $openPopup = 'newAccount'
    } else {
      $openPopup = 'childAccount'
      $selectedParentAccount = data.account.parent
    }
  }
</script>

<AppBar title="{data.account?.name ?? 'Transactions'}"
        leftButton={{ name: 'Back', action: () => goto('/') }}
        rightButton={{ name: 'Edit', action: editAccount}}/>

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

<ParentAccountPopup account={data.account}/>
<AccountPopup account={data.account}/>

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
