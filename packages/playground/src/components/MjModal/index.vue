<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog :open="show" @close="show = false" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-600/60" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          :class="[
            'flex min-h-full justify-center',
            fullscreen ? 'h-full items-stretch' : 'p-4 items-center'
          ]"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="[
                'bg-white p-6 shadow-xl transition-all w-full',
                !fullscreen && 'rounded-md',
                panelClass
              ]"
            >
              <DialogTitle
                class="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
              >
                <span>{{ title }}</span>
                <XMarkIcon class="w-5 h-5" @click="show = false" />
              </DialogTitle>
              <slot v-if="$slots.default" />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'
defineProps<{ title: string; panelClass?: string; fullscreen?: boolean }>()
const show = defineModel<boolean>('show', { required: true })
</script>
