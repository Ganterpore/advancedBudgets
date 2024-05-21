<script>
    import { onMount } from 'svelte';
    import Button from "$lib/components/Button.svelte";
    import {createClient, login} from "./authClient";
    import {goto} from "$app/navigation";

    let auth0Client
    onMount(async () => {
        auth0Client = await createClient();
        let isAuthenticated = await auth0Client.isAuthenticated()

        // Handling auth0 redirect
        if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
            await auth0Client.handleRedirectCallback()
            await goto('/login')
            isAuthenticated = await auth0Client.isAuthenticated()
        }
        if (isAuthenticated) {
            const authToken = await auth0Client.getTokenSilently({ authorizationParams: { audience: 'budget-backend' } })
            const user = await auth0Client.getUser()
            const authId = user.sub
            const username = user.username ?? user.given_name

            const res = await fetch('/login', {
                method: 'POST',
                body: JSON.stringify({ authToken, authId, username }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (res.redirected) {
                goto(res.url)
            }
        }
    });

    const handleLogin = () => login(auth0Client);
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