<script lang="ts">
  import { goto } from "$app/navigation";
  import ParentAccountList from '$lib/components/accountComponents/ParentAccountList.svelte'
  import AccountPopup from '$lib/components/accountComponents/AccountPopup.svelte'
  import TransactionPopup from '$lib/components/transactionComponents/TransacionPopup.svelte'
  import AppBar from '$lib/components/sharedComponents/AppBar.svelte'
  import { openPopup } from '$lib/store'
  import ParentAccountPopup from '$lib/components/accountComponents/ParentAccountPopup.svelte'
  export let data

  function onSelected (isParent: boolean, id: string) {
    const url = `/${isParent ? 'parentAccount/' : 'account/'}${id}`
    goto(url)
  }
  async function openAccountPopup () {
    $openPopup = 'newAccount'
  }
  const handleLogout = async () => goto('/logout')
</script>

<AppBar title="Welcome {data.user?.username ?? ''}"
        leftButton={{ name: 'Log Out', action: handleLogout }}
        rightButton={{ name: 'Add Account', action: openAccountPopup }}/>

<ParentAccountList totals={data.totals} accounts={data.accounts} onSelect={onSelected} />
<ParentAccountPopup/>
<AccountPopup/>
<TransactionPopup accounts={data.accounts} />
