import { MjPaper } from '@/utils/paper'
import TextareaAutosize from 'react-textarea-autosize'
import Undo from '@/icons/undo.svg'
import Send from '@/icons/send.svg'
import Rect from '@/icons/rect.svg'
import Lasso from '@/icons/lasso.svg'
import { useEffect, useRef, useState } from 'react'
import { useMjStore } from '@/stores/mj'
import clsx from 'clsx'

export default function InpaintingEditor() {
  const [paper, setPaper] = useState<MjPaper | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ins, handleMsg, varyRegionInfo] = useMjStore((state) => [
    state.ins,
    state.handleMsg,
    state.varyRegionInfo
  ])
  const [selectedTool, setTool] = useState(0)
  const [input, setInput] = useState(varyRegionInfo.varyRegionPrompt)
  const btns = [
    { label: 'rect', value: 0, icon: Rect },
    { label: 'lasso', value: 0.5, icon: Lasso }
  ] as const
  const getImg = () =>
    new Promise<HTMLImageElement>((s) => {
      const img = new Image()
      img.src = './0_0.webp'
      img.onload = () => s(img)
    })
  const init = async () => {
    if (canvas.current) {
      const img = await getImg()
      setPaper(new MjPaper(canvas.current, img))
    }
  }
  const handleSubmit = () => {
    if (!input.trim()) {
      //   MjToast({
      //     msg: 'image prompt is required',
      //     type: 'error',
      //     duration: 3000
      //   })
      return
    }
    paper
      ?.submit()
      .then((mask) => {
        // emits('submit', mask, input.value)
      })
      .catch((errMsg) => {
        // MjToast({ msg: errMsg, type: 'error', duration: 3000 })
      })
  }
  useEffect(() => {
    init()
  }, [])
  useEffect(() => {
    console.log('selectedTool')
    // paper && setTool(paper.selectedTool)
  }, [paper?.selectedTool])
  return (
    <>
      <div className="flex-1 flex items-center justify-center absolute inset-0 h-full">
        <canvas
          ref={canvas}
          //@ts-ignore
          hidpi="on"
          width="1024"
          height="1024"
          resize="true"
          style={{
            padding: '0px',
            margin: '0px',
            width: '100%',
            maxWidth: '960px'
          }}
        ></canvas>
      </div>
      <div className="fixed top-20 left-3 flex justify-center items-center">
        <button className="editor-btn border" onClick={() => paper?.undo()}>
          <Undo className="w-5 h-5" />
        </button>
      </div>
      <div
        id="appbody"
        className="flex fixed inset-x-0 bottom-0 w-full items-end justify-between p-3 border gap-4"
      >
        <div className="flex gap-2">
          {btns.map((v, i) => (
            <button
              key={i}
              className={clsx(
                'editor-btn',
                selectedTool === v.value && '!bg-gray-400'
              )}
              onClick={() => {
                paper && (paper.selectedTool = v.value)
              }}
            >
              <v.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
        <div className="flex items-end flex-1 gap-4">
          <TextareaAutosize
            value={input}
            rows={1}
            className="resize-none overflow-hidden flex-1 !border-gray-200 rounded"
            placeholder="send a prompt"
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="editor-btn flex-shrink-0" onClick={handleSubmit}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  )
}
