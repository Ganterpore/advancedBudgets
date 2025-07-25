<script lang="ts">
  import TransactionListItem from "$lib/components/transactionComponents/TransactionListItem.svelte";
  import AppBar from "$lib/components/sharedComponents/AppBar.svelte";
  import {goto} from "$app/navigation";
  import {openPopup, selectedParentAccount} from "$lib/store";
  import ParentAccountPopup from '$lib/components/accountComponents/ParentAccountPopup.svelte'
  import AccountPopup from '$lib/components/accountComponents/AccountPopup.svelte'
  import ArchiveAccountPopup from '$lib/components/accountComponents/ArchiveAccountPopup.svelte'
  import TransactionMonthHeader from '$lib/components/transactionComponents/TransactionMonthHeader.svelte'
  import ListItem from '$lib/components/sharedComponents/ListItem.svelte'
  import AccountOverview from '$lib/components/transactionComponents/AccountOverview.svelte'

  export let data
  $: transactions = data.transactions
  $: transactionsByMonth = transactions.reduce((monthMapping, transaction) => {
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
  <AccountOverview transactionList={data.transactions} />
  <div class="listContainer">
    {#each Object.keys(transactionsByMonth) as key}
      <ListItem id={key}>
        <TransactionMonthHeader
          dateString={key}
          transactions={transactionsByMonth[key]}
          positiveSum={transactionsByMonth[key].positiveSum}
          negativeSum={transactionsByMonth[key].negativeSum} />
      </ListItem>
      <div class="list">
        {#each transactionsByMonth[key].transactionList as t}
          <ListItem secondary>
            <TransactionListItem transaction={t} account={data.account} />
          </ListItem>
        {/each}
      </div>
    {/each}
  </div>
</div>

<ParentAccountPopup account={data.account}/>
<AccountPopup account={data.account}/>
<ArchiveAccountPopup accountId={data.account.id} isParent={data.isParent} />

<style>
  .date {
    font-size: small;
    margin: 0;
    padding: 0 10px;
    color: var(--theme-text);
  }
  .container {
      display: flex;
      align-items: center;
      flex-direction: column;
  }
  .listContainer {
      width: 80%;

      flex-grow: 1;
  }
  .list {
    margin: 0 5px;
    padding: 10px 0 0 0;
    background-color: var(--theme-tertiary);
  }
</style>
