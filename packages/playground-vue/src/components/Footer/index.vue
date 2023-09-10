<template>
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
        <SvgIcon class="w-4 h-4" icon-class="send"></SvgIcon>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { input, textarea } = useTextareaAutosize({ input: 'apple' })
const mj = useMjStore()
const handleSubmit = () => {
  input.value && mj.ins?.api.imagine(input.value, mj.handleMsg)
  input.value = ''
}
</script>

<style scoped></style>
