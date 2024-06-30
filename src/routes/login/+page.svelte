<script>
    import {goto} from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import {writable} from "svelte/store";
    import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

    const isLoading = writable(false)
    const handleLogin = () => {
        isLoading.set(true)
        goto('/login/auth0')
    }
</script>

<div class="login-flex">
    {#if $isLoading}
        <h1>Loading<LoadingSpinner/></h1>
    {:else}
        <Button on:click={handleLogin}>Log In</Button>
    {/if}
</div>

<style>
    .login-flex {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        flex-direction: column;
    }
</style>