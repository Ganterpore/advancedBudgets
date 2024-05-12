import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import type { TransactionType } from "../routes/(authed)/transactions/types";

export const openPopup = writable()
export const selectedParentAccount: Writable<number> = writable()
export const selectedTransactionAccount: Writable<number> = writable()
export const selectedTransactionType: Writable<TransactionType> = writable()