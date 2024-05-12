<script lang="ts">
  import { tweened } from "svelte/motion";

  export let savingsGoal
  export let currentValue
  export let multiplier = 100
  export let backgroundColor = '#3e66b4'

  const currentPercentTweened = tweened(0, { duration: 500 })
  $: currentPercentTweened.set(Math.min((currentValue * 100 ?? 0) / (savingsGoal ?? 1), 100))

  $: completed = $currentPercentTweened >= 100
  let highlightColour = '#a0e4f1'
  $: if (multiplier >= 200) highlightColour = 'aqua'
  $: if (multiplier >= 300) highlightColour = 'gold'
  $: if (multiplier <= 50) highlightColour = 'gray'
  $: if (multiplier <= 25) highlightColour = 'maroon'
  $: if (completed) highlightColour = 'greenyellow'
</script>

<div class="progress-container" style="--progress-background:{backgroundColor}; --progress-highlight:{highlightColour}">
  <div class="progress-bar">
    <div class="progress-fill" style="width: {$currentPercentTweened}%">
      <div class="progress-glow {completed ? 'completed' : ''}"></div>
    </div>
  </div>
</div>

<style>
    <!--  Credit https://codepen.io/brundolf  -->
    .progress-container {
        height: 20px;
        margin: 0 20px;
    }
    .progress-bar {
        height: 6px;
        width: 100%;
        position: relative;
        z-index: 10;

        background-color: var(--progress-background);
    }
    .progress-fill {
        position:relative;
        height:100%;
        background-color: var(--progress-highlight);
        transition:width 0.5s ease-out;
        border-radius: 0px 2px 2px 0px;
    }
    .progress-glow {
        width:100%;
        height:100%;
        float:right;
    }
    .progress-glow::before, .progress-glow::after {
        content:'';
        display:block;
        position:relative;
        border-radius:0px 2px 2px 0px;
    }
    .progress-glow::before {
        background:transparent;
        height:100%;
        box-shadow:0px 0px 10px var(--progress-highlight), 0px 0px 0px var(--progress-highlight);
        z-index:-5;
    }
    .progress-glow::after {
        background:linear-gradient(to right, var(--progress-background) 0%, transparent 50%);
        height:calc(100% + 20px);
        width:calc(100% + 10px);
        top:-15px;
        left:-10px;
        z-index:-3;
        border-radius:0px 2px 2px 0px;
    }
    .progress-glow.completed::after {
        background: transparent;
    }
</style>