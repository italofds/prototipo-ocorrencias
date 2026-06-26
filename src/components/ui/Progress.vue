<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{ value?: number }>(), { value: 0 })
const attrs = useAttrs()
</script>

<template>
  <div
    v-bind="{ ...attrs, class: undefined }"
    :class="cn('relative w-full overflow-hidden rounded-full bg-secondary', attrs.class as string)"
  >
    <div
      class="h-full bg-primary transition-all"
      :style="{ width: `${Math.max(0, Math.min(100, props.value))}%` }"
    />
  </div>
</template>
