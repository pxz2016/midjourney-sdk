<template>
  <form class="flex flex-col gap-4 p-2">
    <div class="flex-1">111</div>
    <canvas
      ref="canvas"
      :width="canvasInfo.width"
      :height="canvasInfo.height"
      @mousedown="startDrawing"
      @mouseup="stopDrawing"
      @touchstart="startDrawing"
      @touchend="stopDrawing"
    ></canvas>
    <div class="flex items-center gap-2 w-full">
      <textarea
        ref="textarea"
        class="resize-none overflow-hidden flex-1"
        placeholder="send a prompt"
      ></textarea>
      <button>Submit</button>
    </div>
    <!-- <button class="border" @click="toDataURL">toDataURL</button>
    <textarea v-model="base64" rows="10"></textarea> -->
  </form>
</template>

<script setup lang="ts">
const mj = useMjStore()
const canvas = ref<HTMLCanvasElement>()
const canvasInfo = reactive({ width: 0, height: 0 })
const { input, textarea } = useTextareaAutosize({ input: '' })
const ctx = computed(() => canvas.value?.getContext('2d'))
let baseImage = new Image()
let maskImage = new Image()
// baseImage.src = mj.varyRegionInfo.varyRegionImgBase64
baseImage.src = './0_0.webp'
maskImage.src = './checkerboard.png'
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
  const ctx = canvas.value?.getContext('2d')
  baseImage.onload = function () {
    scaleInfo.scaleFactor = Math.min(
      canvas.value!.width / baseImage.width,
      canvas.value!.height / baseImage.height
    )
    let ratio = 960 / baseImage.width
    scaleInfo.scaledWidth = baseImage.width * scaleInfo.scaleFactor
    scaleInfo.scaledHeight = baseImage.height * scaleInfo.scaleFactor
    // canvasInfo.width = 960
    // canvasInfo.height = ratio * baseImage.height
    if (canvas.value) {
      canvas.value.width = 960
      canvas.value.height = ratio * baseImage.height
    }
    console.log(canvasInfo)
    ctx?.drawImage(baseImage, 0, 0, canvasInfo.width, canvasInfo.height)
  }
}

const startDrawing = (e: MouseEvent | TouchEvent) => {
  isDrawing.value = true
  position.startX =
    ((e as TouchEvent).touches
      ? (e as TouchEvent).touches[0].clientX
      : (e as MouseEvent).clientX) - canvas.value!.offsetLeft
  position.startY =
    ((e as TouchEvent).touches
      ? (e as TouchEvent).touches[0].clientY
      : (e as MouseEvent).clientY) - canvas.value!.offsetTop
}

const stopDrawing = (e: MouseEvent | TouchEvent) => {
  const ctx = canvas.value?.getContext('2d')
  if (isDrawing.value && ctx) {
    position.endX =
      ((e as TouchEvent).changedTouches
        ? (e as TouchEvent).changedTouches[0].clientX
        : (e as MouseEvent).clientX) - canvas.value!.offsetLeft
    position.endY =
      ((e as TouchEvent).changedTouches
        ? (e as TouchEvent).changedTouches[0].clientY
        : (e as MouseEvent).clientY) - canvas.value!.offsetTop
    const { startX, startY, endX, endY } = position
    let regionWidth = endX - startX,
      regionHeight = endY - startY,
      absoluteWidth = Math.abs(regionWidth),
      absoluteHeight = Math.abs(regionHeight)

    console.log(regionWidth, regionHeight)

    let sourceMaskWidth = absoluteWidth / scaleInfo.scaleFactor
    let sourceMaskHeight = absoluteHeight / scaleInfo.scaleFactor
    console.log(sourceMaskWidth, sourceMaskHeight)

    // ctx.globalAlpha = 0.5
    ctx.drawImage(
      maskImage,
      0,
      0,
      absoluteWidth,
      absoluteHeight,
      regionWidth > 0 ? startX : endX,
      regionHeight > 0 ? startY : endY,
      absoluteWidth,
      absoluteHeight
    )
    // ctx.globalAlpha = 1.0
    selectedRegions.push({ startX, startY, endX, endY })
  }
  isDrawing.value = false
}

const toDataURL = () => {
  console.log(ctx)

  // if (ctx.value && canvas.value) {
  //   ctx.value.fillStyle = 'black'
  //   ctx.value.fillRect(0, 0, scaleInfo.scaledWidth, scaleInfo.scaledHeight)

  //   // Fill white for selected regions
  //   ctx.value.fillStyle = 'white'
  //   for (let region of selectedRegions) {
  //     ctx.value.fillRect(
  //       region.startX,
  //       region.startY,
  //       region.endX - region.startX,
  //       region.endY - region.startY
  //     )
  //   }
  //   base64.value = canvas.value.toDataURL('image/png')
  //   mj.ins?.api.varyRegion(
  //     mj.varyRegionInfo.varyRegionCustomId,
  //     'orange',
  //     base64.value,
  //     mj.handleMsg
  //   )
  // }
}

onMounted(initImage)
</script>

<style scoped></style>
