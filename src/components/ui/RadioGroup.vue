<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  options: { value: string; label: string; description?: string }[]
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
          'flex cursor-pointer select-none gap-2.5 rounded-md border px-4 py-2.5 text-sm transition-colors',
          opt.description ? 'flex-col items-start' : 'min-w-[8.5rem] items-center',
          fullWidth ? 'flex-1 basis-0' : 'flex-1 sm:flex-none',
          model === opt.value
            ? 'border-primary bg-primary/10 font-medium text-foreground'
            : 'border-transparent bg-muted text-foreground hover:bg-accent hover:text-accent-foreground',
        )
      "
    >
      <span class="flex items-center gap-2.5">
        <input
          type="radio"
          :name="name"
          :value="opt.value"
          v-model="model"
          class="h-5 w-5 shrink-0 accent-primary"
        />
        {{ opt.label }}
      </span>
      <p v-if="opt.description" class="pl-[1.875rem] text-xs font-normal text-muted-foreground">
        {{ opt.description }}
      </p>
    </label>
  </div>
</template>
