<script>
  export let data
</script>

<nav>
    {#if data.authToken}
        <form method="POST" action="/logout">
            <button>log out</button>
        </form>
    {/if}
</nav>

<slot />

<style>
    :root {
        --theme-background: #161c91;
        --theme-primary: #4a4de7;
        --theme-secondary: #7ea6f4;
        --theme-highlight: #a0e4f1;
        --theme-text: #f1fafb;
        background-color: var(--theme-background);
        color: var(--theme-highlight);
    }
    button {
        background-color: var(--theme-highlight);
    }
</style>
