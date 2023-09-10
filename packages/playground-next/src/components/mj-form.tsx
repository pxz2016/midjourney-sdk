import { MidJourneyOptions, defaultOpts } from 'midjourney-sdk'
import { useState } from 'react'
import { useMjStore } from '@/stores/mj'

export default function MjForm() {
  const init = useMjStore((state) => state.init)
  const [form, setForm] = useState<MidJourneyOptions>({
    token: process.env.NEXT_PUBLIC_TOKEN as string,
    guild_id: process.env.NEXT_PUBLIC_GUILD_ID as string,
    channel_id: process.env.NEXT_PUBLIC_CHANNEL_ID as string,
    apiBaseUrl:
      (process.env.NEXT_PUBLIC_API_BASE_URL as string) ||
      defaultOpts.apiBaseUrl,
    imgBaseUrl:
      (process.env.NEXT_PUBLIC_IMG_BASE_URL as string) ||
      defaultOpts.imgBaseUrl,
    wsBaseUrl:
      (process.env.NEXT_PUBLIC_WS_BASE_URL as string) || defaultOpts.wsBaseUrl
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        init(form)
      }}
      className="flex flex-col gap-4 p-4"
    >
      <div className="form-item">
        <label>Guild's id</label>
        <input
          value={form.guild_id}
          onChange={(e) =>
            setForm((state) => ({ ...state, guild_id: e.target.value }))
          }
          type="text"
          placeholder="please input your guild_id"
        />
      </div>
      <div className="form-item">
        <label>Channel's id</label>
        <input
          value={form.channel_id}
          onChange={(e) =>
            setForm((state) => ({ ...state, channel_id: e.target.value }))
          }
          type="text"
          placeholder="please input your channel_id"
        />
      </div>
      <div className="form-item">
        <label>User's Token</label>
        <input
          value={form.token}
          onChange={(e) =>
            setForm((state) => ({ ...state, token: e.target.value }))
          }
          type="text"
          placeholder="please input your token"
        />
      </div>
      <div className="form-item">
        <label>DiscordApi's BaseUrl</label>
        <input
          value={form.apiBaseUrl}
          onChange={(e) =>
            setForm((state) => ({ ...state, apiBaseUrl: e.target.value }))
          }
          type="text"
          placeholder="DiscordApi's BaseUrl"
        />
      </div>
      <div className="form-item">
        <label>DiscordWs's BaseUrl</label>
        <input
          value={form.wsBaseUrl}
          onChange={(e) =>
            setForm((state) => ({ ...state, wsBaseUrl: e.target.value }))
          }
          type="text"
          placeholder="DiscordWs's BaseUrl"
        />
      </div>
      <div className="form-item">
        <label>DiscordImage's BaseApi</label>
        <input
          value={form.imgBaseUrl}
          onChange={(e) =>
            setForm((state) => ({ ...state, imgBaseUrl: e.target.value }))
          }
          type="text"
          placeholder="DiscordImage's BaseApi"
        />
      </div>
      <button type="submit" className="border border-gray-500 rounded-md p-2">
        Submit
      </button>
    </form>
  )
}
