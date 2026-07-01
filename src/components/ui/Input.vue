<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

defineProps<{ type?: string; placeholder?: string }>()

const model = defineModel<string>()
const attrs = useAttrs()
</script>

<template>
  <input
    v-bind="{ ...attrs, class: undefined }"
    :type="type ?? 'text'"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        attrs.class as string,
      )
    "
    :value="model"
    @input="model = ($event.target as HTMLInputElement).value"
  />
</template>
