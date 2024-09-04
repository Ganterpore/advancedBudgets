<script>
  export let selected
</script>

<nav>
  <a class="{selected==='spending' ? 'selected' : ''}" href="/"><p>Spending</p></a>
  <a class="{selected==='budget' ? 'selected' : ''}" href="budget"><p>Budget</p></a>
  <a class="{selected==='retirement' ? 'selected' : ''}" href="retirement"><p>Retirement</p></a>
</nav>

<style>
  nav {
    background-color: var(--theme-plain);
    height: 50px;
    bottom: 0;
    right: 0;
    left: 0;
    position: fixed;
    width: 100%;
    z-index: 20;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 0;
  }

  a {
    color: var(--theme-text);
    background-color: var(--theme-plain);
    flex-grow: 1;
    text-align: center;
    height: 100%;
    text-decoration: none;
    font-size: larger;
    border-color: var(--theme-background);
    border-width: 3px;
    border-style: solid;
    margin: 0;
    padding: 0;
  }
  .selected {
    background-color: var(--theme-secondary);
    color: var(--theme-secondary-text);
  }
  a:hover {
    background-color: var(--theme-highlight);
    color: var(--theme-secondary-text);
  }
</style>