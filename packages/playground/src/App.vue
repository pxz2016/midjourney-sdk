<template>
  <div
    class="pb-[10vh] pt-5 bg-gray-950/80 text-white h-full w-full relative overflow-auto"
  >
    <Welcome />
    <MjForm v-if="!mj.ins?.initialize" />
    <template v-else>
      <div class="flex flex-col gap-4">
        <MsgItem v-for="(v, k) in mj.mapping" :key="k" :item="v"></MsgItem>
      </div>
      <Footer />
    </template>

    <MjModal v-model:show="mj.openVaryRegion" title="Vary（Region）" fullscreen>
      <InpaintingEditor @submit="handleSubmit" />
    </MjModal>
  </div>
</template>

<script setup lang="ts">
const mj = useMjStore()
const handleSubmit = (mask: string, prompt: string) => {
  if (mj.ins && mj.varyRegionInfo.varyRegionCustomId && mask && prompt) {
    mj.ins.api.varyRegion(
      mj.varyRegionInfo.varyRegionCustomId,
      prompt,
      mask,
      mj.handleMsg
    )
    mj.openVaryRegion = false
  }
}
</script>
