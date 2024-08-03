<script lang="ts">
  import List from "$lib/components/sharedComponents/List.svelte";
  import TransactionListItem from "$lib/components/transactionComponents/TransactionListItem.svelte";
  import AppBar from "$lib/components/sharedComponents/AppBar.svelte";
  import {goto} from "$app/navigation";
  import {openPopup, selectedParentAccount} from "$lib/store";
  import ParentAccountPopup from '$lib/components/accountComponents/ParentAccountPopup.svelte'
  import AccountPopup from '$lib/components/accountComponents/AccountPopup.svelte'
  import ArchiveAccountPopup from '$lib/components/accountComponents/ArchiveAccountPopup.svelte'
  import type { TransactionWithParent } from '$lib/types/transactionTypes'
  import TransactionMonthHeader from '$lib/components/transactionComponents/TransactionMonthHeader.svelte'

  export let data
  const transactions: TransactionWithParent[] = data.transactions
  const transactionsByMonth = transactions.reduce((monthMapping, transaction) => {
    const year = transaction.transactionTime.getFullYear()
    const month = transaction.transactionTime.toLocaleString('default', { month: 'long' });
    const key = `${year}_${month}`
    if (!monthMapping[key]){
      monthMapping[key] = {
        transactionList: [],
        positiveSum: 0,
        negativeSum: 0
      }
    }
    monthMapping[key].transactionList.push(transaction)
    if (transaction.amount > 0) monthMapping[key].positiveSum += transaction.amount
    else monthMapping[key].negativeSum += transaction.amount
    return monthMapping
  }, {})

  async function editAccount () {
    if (data.isParent) {
      $openPopup = 'newAccount'
    } else {
      $openPopup = 'childAccount'
      $selectedParentAccount = data.account.parent
    }
  }
  async function archiveAccount () {
    $openPopup = 'archiveAccount'
  }
</script>

<AppBar title="{data.account?.name ?? 'Transactions'}"
        leftButton={{ name: 'Back', action: () => goto('/') }}
        rightButtons={[
            { name: 'Edit', action: editAccount},
            { name: 'Archive', action: archiveAccount }
          ]}/>

<div class="container">
  <div class="listContainer">
    <List list={Object.keys(transactionsByMonth).map(key => ({
      id: key,
      header: TransactionMonthHeader,
      headerProps: {
        dateString: key,
        positiveSum: transactionsByMonth[key].positiveSum,
        negativeSum: transactionsByMonth[key].negativeSum
      },
      child: List,
      childProps: {
        secondary: true,
        list: transactionsByMonth[key].transactionList.map(t => ({
          id: t.id, header: TransactionListItem, headerProps: {
            id: t.id,
            description: t.description,
            amount: t.amount,
            accountName: t.accountName
          }
        }))
      }
    }))} />
  </div>
</div>

<ParentAccountPopup account={data.account}/>
<AccountPopup account={data.account}/>
<ArchiveAccountPopup accountId={data.account.id} isParent={data.isParent} />

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
