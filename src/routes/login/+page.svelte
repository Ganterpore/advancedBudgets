<script>
    import {goto} from "$app/navigation";
    import Button from "$lib/components/Button.svelte";

    const handleLogin = () => goto('/login/auth0')
</script>

<div class="login-flex">
    <Button on:click={handleLogin}>Log In</Button>
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