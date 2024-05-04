<script>
  import MaterialSymbolsWarningOutline from '~icons/material-symbols/warning-outline';
</script>

<div class="alertBox">
    <MaterialSymbolsWarningOutline />
    <slot/>
</div>

<style>
    .alertBox {
        padding: 10px;
        border-color: var(--theme-alert);
        border-style: solid;
        border-width: 2px;
        border-radius: 10px;
        background-color: color-mix(in srgb, var(--theme-alert) 20%, transparent);
        color: var(--theme-alert);
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        width: 80%;
    }
</style>