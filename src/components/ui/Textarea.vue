<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

defineProps<{ rows?: number; placeholder?: string }>()

const model = defineModel<string>()
const attrs = useAttrs()
</script>

<template>
  <textarea
    v-bind="{ ...attrs, class: undefined }"
    :class="
      cn(
        'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        attrs.class as string,
      )
    "
    :value="model"
    @input="model = ($event.target as HTMLTextAreaElement).value"
  />
</template>
