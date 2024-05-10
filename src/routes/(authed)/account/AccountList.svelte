<script lang="ts">
    import List from "$lib/components/List.svelte"
    import type { Account } from "./types";
    import AccountHeader from "./AccountHeader.svelte";
    import type { AccountTotals } from "../transactions/types";

    export let accounts: Account[]
    export let totals: AccountTotals[]
    export let onSelect: (isParent: boolean, id: string) => void
</script>

<List selectable secondary onSelected={(id) => onSelect(false, id)}
      list={accounts.map(a => {
          return {
              id: a.id,
              header: AccountHeader,
              headerProps: {
                  name: a.name,
                  id: a.id,
                  type: a.type,
                  value: totals[a.id]
              }
          }
      })} />
