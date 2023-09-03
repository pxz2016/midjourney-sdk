<template>
  <div>
    <h1 class="text-2xl font-bold text-center">Midjourney-SDK example</h1>
    <form
      class="flex items-center gap-2 fixed bottom-0 inset-x-0 m-2 p-2 rounded-lg border"
      @submit.prevent="
        (e) => {
          input && mj.ins.api.imagine(input)
          input = ''
        }
      "
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
const { input, textarea } = useTextareaAutosize({ input: '' })
const mj = useMjStore()
</script>

<style scoped></style>
