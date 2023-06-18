import { MidJourney } from '../src'

describe('request', async () => {
  it('new Instance widthout token', () => {
    expect(
      () =>
        // @ts-ignore
        new MidJourney({ session_id: 'xxxxx', guild_id: 'xxxxx' })
    ).toThrowError('token is required')
  })

  it('new Instance widthout session_id', () => {
    expect(
      () =>
        // @ts-ignore
        new MidJourney({ token: 'xxxxx', guild_id: 'xxxxx' })
    ).toThrowError('session_id is required')
  })

  it('new Instance widthout guild_id', () => {
    expect(
      () =>
        // @ts-ignore
        new MidJourney({ session_id: 'xxxxx', token: 'xxxxx' })
    ).toThrowError('guild_id is required')
  })
})
