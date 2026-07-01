<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const model = defineModel<boolean>({ required: true })
const attrs = useAttrs()
</script>

<template>
  <label
    v-bind="{ ...attrs, class: undefined }"
    :class="
      cn(
        'flex min-h-11 w-fit cursor-pointer select-none items-center gap-2.5 rounded-md border px-4 py-2.5 text-sm transition-colors',
        model
          ? 'border-primary bg-primary/10 font-medium text-foreground'
          : 'border-transparent bg-muted text-foreground hover:bg-accent hover:text-accent-foreground',
        attrs.class as string,
      )
    "
  >
    <input type="checkbox" class="h-5 w-5 shrink-0 rounded border-input accent-primary" v-model="model" />
    <slot />
  </label>
</template>
