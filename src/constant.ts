export const WsEventTypes = [
  'READY',
  'READY_SUPPLEMENTAL',
  'MESSAGE_CREATE',
  'MESSAGE_UPDATE',
  'MESSAGE_DELETE',
  'MESSAGE_ACK',
  'INTERACTION_SUCCESS',
  'INTERACTION_CREATE'
] as const

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

export const WS_URL =
  'wss://gateway.discord.gg?v=9&encoding=json&compress=gzip-stream'
