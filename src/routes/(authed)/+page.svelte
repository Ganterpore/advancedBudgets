<script lang="ts">
  import { goto } from "$app/navigation";
  import ParentAccountList from '$lib/components/accountComponents/ParentAccountList.svelte'
  import AccountPopup from '$lib/components/accountComponents/AccountPopup.svelte'
  import TransactionPopup from '$lib/components/transactionComponents/TransacionPopup.svelte'
  import AppBar from '$lib/components/sharedComponents/AppBar.svelte'
  import { openPopup } from '$lib/store'
  import ParentAccountPopup from '$lib/components/accountComponents/ParentAccountPopup.svelte'
  import BottomNavigation from '$lib/components/sharedComponents/BottomNavigation.svelte'
  import InvestmentList from '$lib/components/accountComponents/InvestmentList.svelte'
  export let data

  function onSelected (isParent: boolean, id: string) {
    const url = `/${isParent ? 'parentAccount/' : 'account/'}${id}`
    goto(url)
  }
  async function openAccountPopup () {
    $openPopup = 'newAccount'
  }
  function openSettings () {
    goto('/settings')
  }
</script>

<AppBar title="Welcome {data.user?.username ?? ''}"
        leftButton={{ name: 'Settings', action: openSettings }}
        rightButtons={[{ name: 'Add Account', action: openAccountPopup }]}/>

<div class="main">
  <ParentAccountList totals={data.totals} accounts={data.accounts} onSelect={onSelected} />
  <InvestmentList investments={data.investments.filter(i => !i.archived)} />
  <ParentAccountPopup/>
  <AccountPopup/>
  <TransactionPopup accounts={data.accounts} />
</div>
<BottomNavigation selected="spending"/>

<style>
  .main {
      padding-bottom: 50px;
  }
</style>
