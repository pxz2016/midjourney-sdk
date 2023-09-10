<template>
  <form @submit.prevent="mj.init(form)" class="flex flex-col gap-4 p-4">
    <div class="form-item" required>
      <label>Guild's id</label>
      <input
        v-model="form.guild_id"
        type="text"
        placeholder="please input your guild_id"
      />
    </div>
    <div class="form-item" required>
      <label>Channel's id</label>
      <input
        v-model="form.channel_id"
        type="text"
        placeholder="please input your channel_id"
      />
    </div>
    <div class="form-item" required>
      <label>User's Token</label>
      <input
        v-model="form.token"
        type="text"
        placeholder="please input your token"
      />
    </div>
    <div class="form-item">
      <label>DiscordApi's BaseUrl</label>
      <input
        v-model="form.apiBaseUrl"
        type="text"
        placeholder="DiscordApi's BaseUrl"
      />
    </div>
    <div class="form-item">
      <label>DiscordWs's BaseUrl</label>
      <input
        v-model="form.wsBaseUrl"
        type="text"
        placeholder="DiscordWs's BaseUrl"
      />
    </div>
    <div class="form-item">
      <label>DiscordImage's BaseApi</label>
      <input
        v-model="form.imgBaseUrl"
        type="text"
        placeholder="DiscordImage's BaseApi"
      />
    </div>
    <button type="submit" class="border border-gray-500 rounded-md p-2">
      Submit
    </button>
  </form>
</template>

<script setup lang="ts">
import { MidJourneyOptions, defaultOpts } from 'midjourney-sdk'
const mj = useMjStore()
const form = reactive<MidJourneyOptions>({
  token: import.meta.env.VITE_TOKEN,
  guild_id: import.meta.env.VITE_GUILD_ID,
  channel_id: import.meta.env.VITE_CHANNEL_ID,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || defaultOpts.apiBaseUrl,
  imgBaseUrl: import.meta.env.VITE_IMG_BASE_URL || defaultOpts.imgBaseUrl,
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || defaultOpts.wsBaseUrl
})
</script>

<style scoped>
.form-item {
  @apply flex md:items-center flex-col md:flex-row gap-2;
}
.form-item[required] label {
  @apply before:content-['*'] before:text-red-500;
}
.form-item input {
  @apply flex-1 bg-transparent rounded-md;
}
.form-item label {
  @apply min-w-[100px];
}
</style>
