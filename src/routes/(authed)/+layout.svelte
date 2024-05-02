<script>
  export let data
  import Button from '../../components/Button.svelte'
  import Navigation from '../../components/Navigation.svelte'
</script>

<Navigation>
    <h1>Welcome to Advanced Budgets {data.user.username}</h1>
    <div style="flex-grow: 1"></div>
    <form method="POST" action="/account" style="align-content: center">
        <Button>Add</Button>
    </form>
    <form method="POST" action="/logout" style="align-content: center">
        <Button>log out</Button>
    </form>
</Navigation>

<slot/>