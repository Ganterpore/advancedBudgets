import * as jose from 'jose'
import { PUBLIC_AUTH0_DOMAIN } from '$env/static/public'

// TODO localisation
const numberFormatter = Intl.NumberFormat('en-au', { style: 'currency', currency: 'AUD' })
export function currencyToString (value: number): string {
    if (isNaN(value)) return ''
    return numberFormatter.format(value / 100)
}

// Credit: The Martin on stack overflow
export function getOrdinalNum (n: number): string {
    return (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '')
}

export function arrayToString (arr: string[]) {
    return arr.slice(0, -1).join(', ') + (arr.length > 1 ? ' and ' : '') + arr[arr.length - 1]
}

export async function validateToken (token: string) {
    const JWKS = jose.createRemoteJWKSet(new URL(`https://${PUBLIC_AUTH0_DOMAIN}/.well-known/jwks.json`))
    const {payload} = await jose.jwtVerify(token, JWKS, {
        issuer: `https://${PUBLIC_AUTH0_DOMAIN}/`,
        audience: 'budget-backend',
    })
    return payload
}