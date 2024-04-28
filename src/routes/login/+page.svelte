<script>
    export let form
</script>

<h1>log in</h1>

<form method="POST">
    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}
    <input name="username" />
    <button>log in</button>
</form>
