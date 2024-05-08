// TODO localisation
export const numberFormatter = Intl.NumberFormat('en-au', { style: 'currency', currency: 'AUD' })

// Credit: The Martin on stack overflow
export function getOrdinalNum (n: number): string {
    return (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '')
}

export function arrayToString (arr: string[]) {
    return arr.slice(0, -1).join(', ') + (arr.length > 1 ? ' and ' : '') + arr[arr.length - 1]
}