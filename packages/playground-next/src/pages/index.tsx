import MjForm from '@/components/mj-form'
import Welcome from '@/components/welcome'
import { useMjStore } from '@/stores/mj'
import Footer from '@/components/footer'
import MsgItem from '@/components/msg-item'
import MjModal from '@/components/mj-modal'
import InpaintingEditor from '@/components/inpainting-editor'

export default function Home() {
  const [
    ins,
    mapping,
    openVaryRegion,
    setOpenVaryRegion,
    varyRegionInfo,
    handleMsg
  ] = useMjStore((state) => [
    state.ins,
    state.mapping,
    state.openVaryRegion,
    state.setOpenVaryRegion,
    state.varyRegionInfo,
    state.handleMsg
  ])
  const handleSubmit = (mask: string, prompt: string) => {
    if (ins && varyRegionInfo.varyRegionCustomId && mask && prompt) {
      ins.api.varyRegion(
        varyRegionInfo.varyRegionCustomId,
        prompt,
        mask,
        handleMsg
      )
      setOpenVaryRegion(false)
    }
  }
  return (
    <div className="pb-[10vh] pt-5 bg-gray-950/80 text-white h-full w-full relative overflow-auto">
      <Welcome />
      {!ins?.initialize ? (
        <MjForm />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {Object.entries(mapping).map(([k, v]) => (
              <MsgItem key={k} item={v} />
            ))}
          </div>
          <Footer />
        </>
      )}
      <MjModal
        show={openVaryRegion}
        setOpen={setOpenVaryRegion}
        title="Vary（Region）"
        fullscreen
      >
        <InpaintingEditor submit={handleSubmit} />
      </MjModal>
    </div>
  )
}
