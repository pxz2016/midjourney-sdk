<template>
  <div
    class="pb-[10vh] pt-5 bg-gray-950/80 text-white h-full w-full relative overflow-auto"
  >
    <button
      type="button"
      @click="isOpen = true"
      class="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      Open dialog
    </button>
    <Welcome />
    <MjForm v-if="!mj.ins?.initialize" />
    <template v-else>
      <div class="flex flex-col gap-4">
        <MsgItem v-for="(v, k) in mj.mapping" :key="k" :item="v"></MsgItem>
      </div>
      <Footer />
    </template>

    <MjModal v-model:show="isOpen" title="Vary（Region）" fullscreen>
      <InpaintingEditor />
    </MjModal>
  </div>
</template>

<script setup lang="ts">
const mj = useMjStore()
const isOpen = ref(true)
</script>
