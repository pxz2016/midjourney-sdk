import DiscordRequest from './http'
import { MidJourneyOptions } from './types'

export const commands = [
  'ask',
  'blend',
  'describe',
  'fast',
  'help',
  'imagine',
  'info',
  'prefer',
  'private',
  'public',
  'relax',
  'settings',
  'show',
  'stealth',
  'shorten',
  'subscribe'
] as const

export type commandType = (typeof commands)[number]

export interface ApplicationCommond {
  version: string
  id: string
  name: string
  type: number
  options: { type: number; name: string; [key: string]: any }[]
  [key: string]: any
}

export default class MidjourneyCommand {
  protected request: DiscordRequest
  protected channel_id: string
  private caches: Partial<Record<commandType, ApplicationCommond>> = {}

  constructor({
    token,
    version,
    channel_id
  }: Pick<MidJourneyOptions, 'token' | 'version' | 'channel_id'>) {
    if (!channel_id) throw new Error('channel_id is required')
    this.channel_id = channel_id
    this.request = new DiscordRequest(token, version)
  }

  commands(command: commandType) {
    if (!this.caches[command]) {
      const searchParams = new URLSearchParams({
        type: '1',
        query: command,
        limit: '1',
        include_applications: 'false'
      })
      return this.request
        .get<{
          application_commands: ApplicationCommond[]
        }>(
          `/channels/${this.channel_id}/application-commands/search?${searchParams}`
        )
        .then(({ application_commands }) => {
          if (application_commands.length) {
            this.caches[command] = application_commands[0]
            return this.caches[command]
          } else {
            return Promise.reject('command not found')
          }
        })
    }
    return Promise.resolve(this.caches[command])
  }
}
