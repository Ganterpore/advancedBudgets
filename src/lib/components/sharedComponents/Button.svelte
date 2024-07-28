<script>
    export let secondary = false
</script>

<button on:click class="{secondary ? 'secondary' : ''}">
    <slot />
</button>

<style>
    button {
        background-color: var(--theme-highlight);
        color: var(--theme-secondary-text);
        align-items: center;
        background-clip: padding-box;
        border: 1px solid transparent;
        border-radius: .25rem;
        box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-flex;
        font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
        font-size: 16px;
        font-weight: 600;
        justify-content: center;
        line-height: 1.25;
        margin: 0;
        min-height: 3rem;
        min-width: 50px;
        padding: 5px 10px;
        position: relative;
        text-decoration: none;
        transition: all 250ms;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        vertical-align: baseline;
        width: auto;
    }
    button:hover,
    button:hover {
        background-color: var(--theme-primary);
        box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    }
    button:active {
        background-color: var(--theme-secondary);
        box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;
        transform: translateY(0);
    }
    .secondary {
        background-color: transparent;
        border-color: var(--theme-highlight);
        color: var(--theme-highlight);
    }
</style>