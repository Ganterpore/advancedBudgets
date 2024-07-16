<script lang="ts">
  import { goto } from "$app/navigation";
  import ParentAccountList from '$lib/components/accountComponents/ParentAccountList.svelte'
  import AccountPopup from '$lib/components/accountComponents/AccountPopup.svelte'
  import TransactionPopup from '$lib/components/transactionComponents/TransacionPopup.svelte'
  export let data

  function onSelected (isParent: boolean, id: string) {
    const url = `/${isParent ? 'parentAccount/' : 'account/'}${id}`
    throw goto(url)
  }
</script>

<ParentAccountList totals={data.totals} accounts={data.accounts} onSelect={onSelected} />
<AccountPopup/>
<TransactionPopup accounts={data.accounts} />
