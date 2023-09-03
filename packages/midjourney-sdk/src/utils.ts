import { Snowyflake, Epoch } from 'snowyflake'
import chalk from 'chalk'

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

export const formatComponents = (components: { components: any[] }[]) => {
  return components.flatMap((v) => v.components).filter((v) => v.custom_id)
}
