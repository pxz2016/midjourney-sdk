import { Snowyflake, Epoch } from 'snowyflake'
import chalk from 'chalk'
import { MjOriginMessage } from './types'

const snowflake = new Snowyflake({
  workerId: 0n,
  processId: 0n,
  epoch: Epoch.Discord
})

export function debug(...scopes: string[]) {
  return (...args: any) =>
    console.log(
      chalk.red(scopes.map((scope) => `[${scope}]`).join(' ')),
      ...args
    )
}

export const nextNonce = (): string => snowflake.nextId().toString()

export const formatComponents = (components: MjOriginMessage['components']) => {
  return components
    .flatMap((v) => v.components)
    .filter((v) => v.custom_id && v.type === 2)
}

export const getContentNonce = (content: string) =>
  content.match(/\*\*nonce:\s(\d+?),\s/)?.[1]
