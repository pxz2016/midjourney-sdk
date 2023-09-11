<template>
  <div
    class="flex flex-col gap-2 border-l-2 border-yellow-500 py-5 px-16 bg-yellow-500/10"
  >
    <div class="flex flex-col relative">
      <img
        src="/mj.png"
        class="w-10 h-10 rounded-full absolute -left-8 top-0 -translate-x-1/2"
      />
      <div class="items-end">
        <span class="hover:underline">Midjourney Bot</span>
        <span class="text-xs text-gray-400 ml-2">{{
          dayjs(item.timestamp).format('YYYY-MM-DD hh:mm')
        }}</span>
      </div>
      <div
        class="text-sm"
        v-if="item.content"
        v-html="marked.parse(item.content)"
      ></div>
    </div>
    <div
      v-if="item.embed"
      class="rounded bg-neutral-800 p-4 border-l-4 flex flex-col gap-2"
      :class="[
        item.embed.color === 16711680 && 'border-red-600',
        item.embed.color === 0 && 'border-black'
      ]"
    >
      <div>{{ item.embed.title }}</div>
      <div
        class="text-xs"
        v-html="marked.marked(item.embed.description, { breaks: true })"
      ></div>
    </div>
    <img v-if="item.url" class="w-full md:w-96 rounded-md" :src="item.url" />
    <div
      v-if="item.components?.length"
      class="flex flex-col self-start justify-self-start"
    >
      <div
        class="flex items-center flex-wrap"
        v-for="(cv, ci) in item.components"
        :key="ci"
      >
        <button
          v-for="(ccv, cci) in cv.components"
          :key="cci"
          class="btn"
          :data-style="ccv.style"
          @click="handleAction(item.id, ccv.custom_id, item.flags!)"
        >
          <span class="mr-1">{{ ccv.emoji?.name }}</span>
          <span>{{ ccv.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MjMessage } from 'midjourney-sdk'
import { dayjs } from '../../utils/dayjs'
import * as marked from 'marked'
defineProps<{ item: MjMessage }>()
const mj = useMjStore()

const handleAction = (id: string, customId: string, flags: number) => {
  mj.ins?.api.action(id, customId, flags, mj.handleMsg)
}
</script>

<style scoped>
.btn {
  @apply my-1 mr-2 py-[2px] px-4 rounded text-sm disabled:cursor-not-allowed bg-gray-600 hover:bg-gray-400 transition-all h-8 min-h-[32px] w-auto min-w-[60px] data-[style='3']:bg-green-600 data-[style='3']:hover:bg-green-700 data-[style='1']:bg-blue-600 data-[style='1']:hover:bg-blue-700 data-[style='4']:bg-red-600 data-[style='4']:hover:bg-red-700;
}
</style>
