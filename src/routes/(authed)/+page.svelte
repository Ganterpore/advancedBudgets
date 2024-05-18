<script lang="ts">
  import AccountPopup from './account/AccountPopup.svelte'
  import TransactionPopup from './transactions/TransacionPopup.svelte'
  import ParentAccountList from "./parentAccount/ParentAccountList.svelte";
  import { goto } from "$app/navigation";
  export let data

  function onSelected (isParent: boolean, id: string) {
    const url = `/transactions/${isParent ? 'parentAccount/' : 'account/'}${id}`
    throw goto(url)
  }
</script>

<ParentAccountList totals={data.totals} accounts={data.accounts} onSelect={onSelected} />
<AccountPopup/>
<TransactionPopup accounts={data.accounts} />
