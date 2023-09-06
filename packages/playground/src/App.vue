<template>
  <div
    class="pb-[10vh] pt-5 bg-gray-950/80 text-white h-full w-full relative overflow-auto"
  >
    <Welcome />
    <el-form
      ref="formRef"
      v-if="!mj.initialized"
      label-position="top"
      class="flex flex-col p-5 gap-2"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="Guild's id" prop="guild_id">
        <el-input placeholder="guild_id" v-model="form.guild_id" />
      </el-form-item>
      <el-form-item label="Channel's id" prop="channel_id">
        <el-input placeholder="channel_id" v-model="form.channel_id" />
      </el-form-item>
      <el-form-item label="User Token" prop="token">
        <el-input placeholder="token" v-model="form.token" />
      </el-form-item>
      <el-form-item>
        <el-button class="w-full" @click="handleLogin">Login</el-button>
      </el-form-item>
    </el-form>
    <template v-else>
      <div class="flex flex-col gap-4">
        <MsgItem v-for="(v, k) in mj.mapping" :key="k" :item="v"></MsgItem>
      </div>
      <Footer />
    </template>
    <el-dialog v-model="mj.openIframe" fullscreen title="Tips" width="50%">
      <div class="flex items-center justify-center">
        <InpaintingEditor />
      </div>
      <!-- <div>{{ mj.iframeUrl }}</div>
      <iframe class="w-full h-[50vh]" :src="mj.iframeUrl"></iframe> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { FormRules, FormInstance } from 'element-plus'
import { MidJourneyOptions, nextNonce } from 'midjourney-sdk'
console.log(nextNonce())

const mj = useMjStore()
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  token: [
    { required: true, message: 'please input your token', trigger: 'blur' }
  ],
  guild_id: [
    {
      required: true,
      message: "please input the discord's guild_id",
      trigger: 'blur'
    }
  ],
  channel_id: [
    { required: true, message: 'please input your token', trigger: 'blur' }
  ]
})
const isOpenIframe = ref(true)
const form = reactive<MidJourneyOptions>({
  token: import.meta.env.VITE_TOKEN,
  guild_id: import.meta.env.VITE_GUILD_ID,
  channel_id: import.meta.env.VITE_CHANNEL_ID
})

const handleLogin = () => {
  formRef.value?.validate((res) => {
    if (res) {
      mj.init(form)
    }
  })
}

useEventListener('message', (e) => {
  if (e.origin === 'https://936929561302675456.discordsays.com') {
    const [op, { nonce }] = e.data as any[]
    console.log(e)
    if (op === 2 && nonce) {
      mj.iframeUrl = ''
      mj.ins?.api.varyRegion(nonce, mj.handleMsg)
    }
  }
})
</script>
