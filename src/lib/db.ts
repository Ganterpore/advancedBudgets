import pg from 'pg'
import type { ClientConfig } from 'pg'
import { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } from '$env/static/private'

const { Client } = pg
const clientDetails: ClientConfig = {
  user: PGUSER,
  database: PGDATABASE,
  port: Number(PGPORT),
  host: PGHOST,
  password: PGPASSWORD,
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