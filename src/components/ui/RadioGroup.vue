<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  options: { value: string; label: string }[]
  name: string
  fullWidth?: boolean
}>()

const model = defineModel<string>()
</script>

<template>
  <div class="flex flex-wrap gap-2.5">
    <label
      v-for="opt in options"
      :key="opt.value"
      :class="
        cn(
          'flex min-w-[8.5rem] cursor-pointer select-none items-center gap-2.5 rounded-lg border-2 px-4 py-3 text-sm transition-colors',
          fullWidth ? 'flex-1 basis-0' : 'flex-1 sm:flex-none',
          model === opt.value
            ? 'border-primary bg-primary/10 font-medium text-foreground'
            : 'border-input text-muted-foreground hover:border-primary/40 hover:bg-accent/30',
        )
      "
    >
      <input
        type="radio"
        :name="name"
        :value="opt.value"
        v-model="model"
        class="h-5 w-5 shrink-0 accent-primary"
      />
      {{ opt.label }}
    </label>
  </div>
</template>
