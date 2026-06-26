<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

defineProps<{ placeholder?: string }>()

const model = defineModel<string>()
const attrs = useAttrs()
</script>

<template>
  <select
    v-bind="{ ...attrs, class: undefined }"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        attrs.class as string,
      )
    "
    :value="model"
    @change="model = ($event.target as HTMLSelectElement).value"
  >
    <option v-if="placeholder" value="" disabled :selected="!model">{{ placeholder }}</option>
    <slot />
  </select>
</template>
