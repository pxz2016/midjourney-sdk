export interface MidJourneyOptions {
  /**
   * discord user token
   */
  token: string
  /**
   * discord server id
   */
  guild_id: string
  session_id: string
  channel_id: string
  /**
   * discord api version
   * @default '9'
   */
  version?: 10 | 9
  /**
   * midjourney imagine command version
   * @default '1118961510123847772'
   */
  imagine_version?: string
}
