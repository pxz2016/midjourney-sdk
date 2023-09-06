<template>
  <div class="flex flex-col gap-4">
    <canvas
      ref="editor"
      :width="1000"
      :height="800"
      class="p-0 m-0 w-full max-w-[960px] select-none touch-none"
      @mousedown="startDrawing"
      @mouseup="stopDrawing"
      @touchstart="startDrawing"
      @touchend="stopDrawing"
    ></canvas>
    <button class="border" @click="toDataURL">toDataURL</button>
    <textarea v-model="base64" rows="10"></textarea>
  </div>
</template>

<script setup lang="ts">
const editor = ref<HTMLCanvasElement>()
const ctx = computed(() => editor.value?.getContext('2d'))
let baseImage = new Image()
let maskImage = new Image()
baseImage.src = './0_0.webp'
maskImage.src = './checkerboard.png'
const factor = ref(0)
const isDrawing = ref(false)
const base64 = ref('')
const position = reactive({
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0
})
const selectedRegions = reactive<(typeof position)[]>([])
let scaleInfo = reactive({
  scaleFactor: 0,
  scaledWidth: 0,
  scaledHeight: 0
})

const initImage = () => {
  const ctx = editor.value?.getContext('2d')
  baseImage.onload = function () {
    scaleInfo.scaleFactor = Math.min(
      editor.value!.width / baseImage.width,
      editor.value!.height / baseImage.height
    )
    scaleInfo.scaledWidth = baseImage.width * scaleInfo.scaleFactor
    scaleInfo.scaledHeight = baseImage.height * scaleInfo.scaleFactor
    ctx?.drawImage(
      baseImage,
      0,
      0,
      scaleInfo.scaledWidth,
      scaleInfo.scaledHeight
    )
  }
}

const startDrawing = (e: MouseEvent | TouchEvent) => {
  isDrawing.value = true
  position.startX =
    ((e as TouchEvent).touches
      ? (e as TouchEvent).touches[0].clientX
      : (e as MouseEvent).clientX) - editor.value!.offsetLeft
  position.startY =
    ((e as TouchEvent).touches
      ? (e as TouchEvent).touches[0].clientY
      : (e as MouseEvent).clientY) - editor.value!.offsetTop
}

const stopDrawing = (e: MouseEvent | TouchEvent) => {
  const ctx = editor.value?.getContext('2d')
  if (isDrawing.value && ctx) {
    position.endX =
      ((e as TouchEvent).changedTouches
        ? (e as TouchEvent).changedTouches[0].clientX
        : (e as MouseEvent).clientX) - editor.value!.offsetLeft
    position.endY =
      ((e as TouchEvent).changedTouches
        ? (e as TouchEvent).changedTouches[0].clientY
        : (e as MouseEvent).clientY) - editor.value!.offsetTop
    const { startX, startY, endX, endY } = position
    let regionWidth = endX - startX,
      regionHeight = endY - startY
    let sourceMaskWidth = regionWidth / scaleInfo.scaleFactor
    let sourceMaskHeight = regionHeight / scaleInfo.scaleFactor
    // ctx.globalAlpha = 0.5
    ctx.drawImage(
      maskImage,
      0,
      0,
      sourceMaskWidth,
      sourceMaskHeight,
      startX,
      startY,
      regionWidth,
      regionHeight
    )
    // ctx.globalAlpha = 1.0
    selectedRegions.push({ startX, startY, endX, endY })
  }
  isDrawing.value = false
}

const toDataURL = () => {
  if (ctx.value && editor.value) {
    ctx.value.fillStyle = 'black'
    ctx.value.fillRect(0, 0, scaleInfo.scaledWidth, scaleInfo.scaledHeight)

    // Fill white for selected regions
    ctx.value.fillStyle = 'white'
    for (let region of selectedRegions) {
      ctx.value.fillRect(
        region.startX,
        region.startY,
        region.endX - region.startX,
        region.endY - region.startY
      )
    }
    base64.value = editor.value.toDataURL('image/png')
  }
}

onMounted(initImage)
</script>

<style scoped></style>
