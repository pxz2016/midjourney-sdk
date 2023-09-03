<template>
  <div class="p-5">
    <h1 class="text-center text-2xl font-bold mb-2">Midjourney-SDK Example</h1>
    <form
      v-if="!mj.initialized"
      @submit.prevent="mj.init(form)"
      class="flex flex-col gap-2"
    >
      <div class="border flex items-center gap-4 p-2 rounded">
        <div class="w-24 text-right">guild_id:</div>
        <input
          type="text"
          class="flex-1"
          placeholder="guild_id"
          v-model="form.guild_id"
        />
      </div>
      <div class="border flex items-center gap-4 p-2 rounded">
        <div class="w-24 text-right">channel_id:</div>
        <input
          type="text"
          class="flex-1"
          placeholder="channel_id"
          v-model="form.channel_id"
        />
      </div>
      <div class="border flex items-center gap-4 p-2 rounded">
        <div class="w-24 text-right">token:</div>
        <input
          type="text"
          class="flex-1"
          placeholder="token"
          v-model="form.token"
        />
      </div>
      <button class="p-1 border rounded">Start</button>
    </form>
    <div v-else class="flex items-center justify-center gap-2">
      <div>current username: {{ mj.user?.username }}</div>
      <div>remix mode: {{ mj.remix }}</div>
      <button class="border" @click="mj.ins?.api.info(handleMsg)">/info</button>
      <button class="border" @click="mj.ins?.api.settings(handleMsg)">
        /settings
      </button>
    </div>
    <div v-for="(v, k) in mj.mapping" :key="k" class="flex flex-col gap-2">
      <div v-if="v.content" v-html="marked.parse(v.content)"></div>
      <img :src="v.url" />
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="(cv, ci) in v.components"
          :key="ci"
          class="flex items-center justify-center border rounded gap-2"
          @click="handleAction(v.id, cv.custom_id, v.flags!)"
        >
          <span>{{ cv.label }}</span>
          <span>{{ cv.emoji?.name }}</span>
        </button>
      </div>
    </div>
    <form
      class="flex items-center gap-2 fixed bottom-0 inset-x-0 m-2 p-2 rounded-lg border"
      @submit.prevent="handleSubmit"
    >
      <textarea
        v-model="input"
        ref="textarea"
        class="flex-1 border p-1 resize-none"
        placeholder="send an image prompt"
      ></textarea>
      <button>Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { MidJourneyOptions, MessageCallBack } from 'midjourney-sdk'
import * as marked from 'marked'

const { input, textarea } = useTextareaAutosize({ input: '' })
const mj = useMjStore()
const form = reactive<MidJourneyOptions>({
  token: import.meta.env.VITE_TOKEN,
  guild_id: import.meta.env.VITE_GUILD_ID,
  channel_id: import.meta.env.VITE_CHANNEL_ID
})

const handleMsg: MessageCallBack = (msg) => {
  console.log(msg)
  if (msg.originId) {
    delete mj.mapping[msg.originId]
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

<style scoped></style>
