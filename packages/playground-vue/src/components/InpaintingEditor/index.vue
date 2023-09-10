<template>
  <div class="flex-1 flex items-center justify-center absolute inset-0 h-full">
    <canvas
      ref="canvas"
      hidpi="on"
      width="1024"
      height="1024"
      resize
      style="padding: 0px; margin: 0px; width: 100%; max-width: 960px"
    ></canvas>
  </div>
  <div class="fixed top-20 left-3 flex justify-center items-center">
    <button class="btn border" @click="paper?.undo">
      <SvgIcon icon-class="undo" class="w-5 h-5"></SvgIcon>
    </button>
  </div>
  <div
    id="appbody"
    class="flex fixed inset-x-0 bottom-0 w-full items-end justify-between p-3 border gap-4"
  >
    <div class="flex gap-2">
      <button
        v-for="(v, i) in btns"
        :key="i"
        :class="['btn', selectedTool === v.value && '!bg-gray-400']"
        @click="paper && (paper.selectedTool = v.value)"
      >
        <SvgIcon :icon-class="v.label" class="w-5 h-5"></SvgIcon>
      </button>
    </div>
    <div class="flex items-end flex-1 gap-4">
      <textarea
        v-model="input"
        ref="textarea"
        class="resize-none overflow-hidden flex-1 !border-gray-200 rounded"
        placeholder="send a prompt"
      ></textarea>
      <button class="btn flex-shrink-0" @click="handleSubmit">
        <SvgIcon icon-class="send" class="w-5 h-5"></SvgIcon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: 'submit', mask: string, prompt: string): void
}>()
import { MjPaper } from '@/utils/paper'
const mj = useMjStore()
const canvas = ref<HTMLCanvasElement>()
const { input, textarea } = useTextareaAutosize({
  input: mj.varyRegionInfo.varyRegionPrompt
})
const paper = ref<MjPaper>()
const btns = reactive([
  { label: 'rect', value: 0 },
  { label: 'lasso', value: 0.5 }
] as const)
const selectedTool = computed(() => paper.value?.selectedTool)
const getImg = () =>
  new Promise<HTMLImageElement>((s) => {
    const img = new Image()
    img.src = mj.varyRegionInfo.varyRegionImgBase64
    img.onload = () => s(img)
  })

const handleSubmit = () => {
  if (!input.value.trim()) {
    MjToast({ msg: 'image prompt is required', type: 'error', duration: 3000 })
    return
  }
  paper.value
    ?.submit()
    .then((mask) => {
      emits('submit', mask, input.value)
    })
    .catch((errMsg) => {
      MjToast({ msg: errMsg, type: 'error', duration: 3000 })
    })
}
onMounted(async () => {
  if (canvas.value) {
    const img = await getImg()
    paper.value = new MjPaper(canvas.value, img)
  }
})
</script>

<style scoped>
.btn {
  @apply p-2 rounded-full bg-gray-400/70 text-white;
}
</style>
