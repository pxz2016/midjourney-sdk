<template>
  <div
    v-show="visible"
    class="pointer-events-none fixed inset-0 z-[60] mx-auto my-2 flex max-w-[560px] flex-col items-stretch justify-start md:pb-5"
  >
    <div class="w-full p-1 text-center md:w-auto md:text-justify">
      <div
        :class="[
          'px-3 py-2 rounded-md text-white inline-flex flex-row border pointer-events-auto gap-2',
          toastTypes[type].class
        ]"
      >
        <div class="mt-1 flex-shrink-0 flex-grow-0">
          <SvgIcon
            :icon-class="toastTypes[type].icon"
            class="w-4 h-4"
          ></SvgIcon>
        </div>
        <div class="flex-1 justify-center gap-2">
          <div class="whitespace-pre-wrap text-left">{{ msg }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IToastProps, toastTypes } from '.'
const props = defineProps<IToastProps>()
const visible = ref(true)
defineOptions({
  name: 'MjToast'
})

function start() {
  if (props.duration === 0) return
  useTimeoutFn(() => {
    visible.value = false
  }, props.duration)
}

onMounted(() => {
  start()
  visible.value = true
})
</script>

<style scoped></style>
