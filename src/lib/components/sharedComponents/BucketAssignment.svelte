<script lang="ts">
  import { currencyToString } from '$lib/utils'
  import Input from '$lib/components/sharedComponents/Input.svelte'
  import Button from '$lib/components/sharedComponents/Button.svelte'

  type Bucket = { id: string, name: string, plannedAmount: number, actualAmount: number }

  export let bucketsToAdd: Pick<Bucket, 'id' | 'name'>[]
  export let buckets: Bucket[]
  export let type: 'percent' | 'max' = 'percent'

  export let addBucketCallback: (id) => Promise<void>
  export let updateBucketCallback: (Bucket) => Promise<void>
  export let removeBucketCallback: (id) => Promise<void>

  let selectedBucket: Bucket

  $: totalProportion = buckets.reduce((total, acc) => total + Number(acc.plannedAmount), 0)

  let isEditing = false
  async function edit () {
    if (isEditing) {
      for (const bucket of buckets) {
        await updateBucketCallback(bucket)
      }
    }
    isEditing = !isEditing
  }
</script>

<div class="main">
  <div class="newAccount">
    {#if isEditing}
      <select bind:value={selectedBucket}>
        {#each bucketsToAdd as addBucket}
          <option id={addBucket.id} value={addBucket}>{addBucket.name}</option>
        {/each}
      </select>
      <Button on:click={() => addBucketCallback(selectedBucket.id)}>Add</Button>
    {/if}
    <div style="flex-grow: 1"></div>
    <Button on:click={edit}>{isEditing ? 'Save' : 'Edit'}</Button>
  </div>


  <div class="excessList">
    {#each buckets as bucket}
      <div class="excessListItem">
        <p>{bucket.name}</p>
        <div style="flex-grow: 1"></div>
        <div class="inner">
          {#if isEditing}
            {#if type==='max'}${/if}
            <Input style="width: 5ch" type="number" bind:value={bucket.plannedAmount} />
          {/if}
          {#if isEditing || bucket.actualAmount === 0}
            {#if type === 'percent'}
              {((bucket.plannedAmount / totalProportion) * 100).toFixed(2)}%
            {:else if !isEditing && type === 'max'}
              up to ${bucket.plannedAmount}
            {/if}
          {/if}
          {#if isEditing}
            <Button warning={true} on:click={() => removeBucketCallback(bucket.id)}>x</Button>
          {/if}
          {#if !isEditing && bucket.actualAmount !== 0}
            {currencyToString(bucket.actualAmount)}
          {/if}
        </div>
        <hr/>
      </div>
    {/each}
  </div>
</div>

<style>
  .newAccount {
    display: flex;
    flex-direction: row;
  }
  .excessList {
    width: 100%;
  }
  .excessList p {
    margin: 0;
    padding: 0;
  }
  .excessListItem {
    display: flex;
    gap: 5px;
    padding: 2px 5px;
    justify-content: end;
    align-items: center;
    background: var(--theme-plain);
    color: var(--theme-text);
    flex-wrap: wrap;
  }
  .inner {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  hr {
    border-radius: 5px;
    border-color: var(--theme-plain);
    width: 95%;
    padding: 0;
    margin: 0;
  }
</style>