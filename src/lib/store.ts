import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

export const openPopup = writable()
export const selectedParentAccount: Writable<number> = writable()
export const selectedAccount: Writable<number> = writable()