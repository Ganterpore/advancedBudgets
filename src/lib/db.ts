import pg from 'pg'
import type { ClientConfig } from 'pg'
import { DATABASE_URL } from '$env/static/private'

const { Client } = pg
const clientDetails: ClientConfig = {
  connectionString: DATABASE_URL
}
const client = new Client(clientDetails)

let clientConnected = false

export async function connect () {
  if (!clientConnected) {
    clientConnected = true
    await client.connect()
  }
  return client
}

export async function disconnect () {
  clientConnected = false
  await client.end()
}