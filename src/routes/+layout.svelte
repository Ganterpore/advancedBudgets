<script>
    export let data
</script>

<nav>
    <a href="/">home</a>
    <a href="/app">app</a>
    {#if data.authToken}
        <form method="POST" action="/logout">
            <button>log out</button>
        </form>
    {:else}
        <a href="/login">login</a>
    {/if}
</nav>

<slot />
