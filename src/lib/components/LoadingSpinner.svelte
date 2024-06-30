<script>
  let count = 0
  setInterval(() => {
      count += 1
      if (count > 3) {
          count = 0
      }
  }, 500)
</script>

{'.'.repeat(count)}