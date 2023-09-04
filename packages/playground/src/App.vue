<template>
  <div
    class="pb-[10vh] pt-5 bg-gray-950/80 text-white h-full w-full relative overflow-auto"
  >
    <img src="/mj.png" class="w-16 h-16 rounded-full m-auto mb-5" />
    <h1 class="text-center text-2xl font-bold">Midjourney-SDK Example</h1>
    <a
      href="https://github.com/LaiBaoYuan/midjourney-sdk"
      class="text-center underline m-auto block mb-5"
      target="_blank"
      >It's useful for you, please give me open source power and support star in
      my `midjourney-sdk` repo.</a
    >
    <button class="btn" @click="mj.ins?.api.settings(handleMsg)">
      settings
    </button>
    <button class="btn" @click="mj.ins?.api.info(handleMsg)">info</button>
    <form
      v-if="!mj.initialized"
      @submit.prevent="mj.init(form)"
      class="flex flex-col p-5 gap-2"
    >
      <div class="flex flex-col gap-2">
        <div>Guild's id</div>
        <input
          type="text"
          class="flex-1 bg-transparent rounded"
          placeholder="guild_id"
          v-model="form.guild_id"
        />
      </div>
      <div class="flex flex-col gap-2">
        <div>Channel's id</div>
        <input
          type="text"
          class="flex-1 bg-transparent rounded"
          placeholder="channel_id"
          v-model="form.channel_id"
        />
      </div>
      <div class="flex flex-col gap-2">
        <div>User Token</div>
        <input
          type="text"
          class="flex-1 bg-transparent rounded"
          placeholder="token"
          v-model="form.token"
        />
      </div>
      <button class="rounded border border-[#6b7280] mt-2 p-2">Start</button>
    </form>
    <template v-else>
      <div class="flex flex-col gap-4">
        <div
          v-for="(v, k) in mj.mapping"
          :key="k"
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
                dayjs(v.timestamp).format('YYYY-MM-DD hh:mm')
              }}</span>
            </div>
            <div
              class="text-sm"
              v-if="v.content"
              v-html="marked.parse(v.content)"
            ></div>
          </div>
          <div
            v-if="v.embed"
            class="rounded bg-neutral-800 p-4 border-l-4 flex flex-col gap-2"
            :class="[
              v.embed.color === 16711680 && 'border-red-600',
              v.embed.color === 0 && 'border-black'
            ]"
          >
            <div>{{ v.embed.title }}</div>
            <div
              class="text-xs"
              v-html="marked.marked(v.embed.description, { breaks: true })"
            ></div>
          </div>
          <img v-if="v.url" class="w-full md:w-96 rounded-md" :src="v.url" />
          <div
            v-if="v.components?.length"
            class="flex flex-col self-start justify-self-start"
          >
            <div
              class="flex items-center flex-wrap"
              v-for="(cv, ci) in v.components"
              :key="ci"
            >
              <button
                v-for="(ccv, cci) in cv.components"
                :key="cci"
                class="btn"
                :data-style="ccv.style"
                @click="handleAction(v.id, ccv.custom_id, v.flags!)"
              >
                <span class="mr-1">{{ ccv.emoji?.name }}</span>
                <span>{{ ccv.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="fixed bottom-0 inset-x-0 p-2 bg-transparent">
        <form
          class="flex items-center p-2 rounded-lg bg-gray-600 -top-3 relative"
          @submit.prevent="handleSubmit"
        >
          <textarea
            v-model="input"
            ref="textarea"
            class="flex-1 p-1 resize-none bg-transparent outline-none overflow-hidden border-none focus:ring-0"
            placeholder="send an image prompt"
          ></textarea>
          <button class="border-l border-gray-500 text-sm h-6 px-2">
            Submit
          </button>
        </form>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from './utils/dayjs'
import { MidJourneyOptions, MessageCallBack } from 'midjourney-sdk'
import * as marked from 'marked'
const { input, textarea } = useTextareaAutosize({ input: '' })
const mj = useMjStore()
const form = reactive<MidJourneyOptions>({
  token: import.meta.env.VITE_TOKEN,
  guild_id: import.meta.env.VITE_GUILD_ID,
  channel_id: import.meta.env.VITE_CHANNEL_ID
})

const handleMsg: MessageCallBack = (type, msg) => {
  console.log(type, msg)
  if (
    msg.parentId &&
    mj.mapping[msg.parentId]?.progress !== 100 &&
    msg.progress === 100
  ) {
    delete mj.mapping[msg.parentId]
  }
  mj.mapping[msg.id] = msg
}

const handleSubmit = () => {
  input.value && mj.ins?.api.imagine(input.value, handleMsg)
  input.value = ''
}

const handleAction = (id: string, customId: string, flags: number) => {
  mj.ins?.api.action(id, customId, flags, handleMsg)
}
</script>

<style scoped>
.btn {
  @apply my-1 mr-2 py-[2px] px-4 rounded text-sm disabled:cursor-not-allowed bg-gray-600 hover:bg-gray-400 transition-all h-8 min-h-[32px] w-auto min-w-[60px] data-[style='3']:bg-green-600 data-[style='3']:hover:bg-green-700 data-[style='1']:bg-blue-600 data-[style='1']:hover:bg-blue-700 data-[style='4']:bg-red-600 data-[style='4']:hover:bg-red-700;
}
</style>
