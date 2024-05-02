<script>
    import Button from '../../components/Button.svelte'
    import Input from '../../components/Input.svelte'
    export let form
</script>

<div class="login-flex">
    <h1 style="margin: 10px">Log In</h1>

    <form method="POST">
        {#if form?.error}
            <p class="error" style="text-align: center">{form.error}</p>
        {/if}
        <Input name="username"/>
        <Button>Log In</Button>
    </form>
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