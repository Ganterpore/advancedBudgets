export function getHighlightColour (completed: boolean, multiplier: number | undefined): string {
  if (completed) return  'greenyellow'
  else if (!multiplier) return '#a0e4f1'
  else if (multiplier >= 300) return 'gold'
  else if (multiplier >= 200) return  'aqua'
  else if (multiplier <= 50) return  'maroon'
  else if (multiplier <= 75) return  'gray'
  return '#a0e4f1'
}