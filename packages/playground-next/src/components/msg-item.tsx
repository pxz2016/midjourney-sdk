import { MjMessage } from 'midjourney-sdk'
import { dayjs } from '../utils/dayjs'
import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'
import { useMjStore } from '@/stores/mj'

export default function MsgItem({ item }: { item: MjMessage }) {
  const [ins, handleMsg] = useMjStore((state) => [state.ins, state.handleMsg])
  return (
    <div className="flex flex-col gap-2 border-l-2 border-yellow-500 py-5 px-16 bg-yellow-500/10">
      <div className="flex flex-col relative">
        <img
          src="/mj.png"
          className="w-10 h-10 rounded-full absolute -left-8 top-0 -translate-x-1/2"
        />
        <div className="items-end">
          <span className="hover:underline">Midjourney Bot</span>
          <span className="text-xs text-gray-400 ml-2">
            {dayjs(item.timestamp).format('YYYY-MM-DD hh:mm')}
          </span>
        </div>
        {item.content && (
          <ReactMarkdown className="text-sm">{item.content}</ReactMarkdown>
        )}
      </div>
      {item.embed && (
        <div
          className={clsx(
            'rounded bg-neutral-800 p-4 border-l-4 flex flex-col gap-2',
            item.embed.color === 16711680 && 'border-red-600',
            item.embed.color === 0 && 'border-black'
          )}
        >
          <div>{item.embed.title}</div>
          <ReactMarkdown className="text-xs">
            {item.embed.description}
          </ReactMarkdown>
        </div>
      )}
      {item.url && <img className="w-full md:w-96 rounded-md" src={item.url} />}
      {!!item.components?.length && (
        <div className="flex flex-col self-start justify-self-start">
          {item.components.map((v, i) => (
            <div className="flex items-center flex-wrap" key={i}>
              {v.components.map((cv, ci) => (
                <button
                  className="mj-btn"
                  key={ci}
                  data-style={cv.style}
                  onClick={() => {
                    ins?.api.action(
                      item.id,
                      cv.custom_id,
                      item.flags!,
                      handleMsg
                    )
                  }}
                >
                  <span className="mr-1">{cv.emoji?.name}</span>
                  <span>{cv.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
