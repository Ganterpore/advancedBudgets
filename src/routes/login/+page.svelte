<script>
    import {goto} from "$app/navigation";
    import {writable} from "svelte/store";
    import Button from "$lib/components/sharedComponents/Button.svelte";
    import LoadingSpinner from "$lib/components/sharedComponents/LoadingSpinner.svelte";

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