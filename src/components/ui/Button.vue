<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

interface Props {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
})

const attrs = useAttrs()

const buttonClass = computed(() =>
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    props.variant === 'default' && 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
    props.variant === 'outline' &&
      'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
    props.variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
    props.variant === 'destructive' &&
      'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
    props.size === 'default' && 'h-9 px-4 py-2',
    props.size === 'sm' && 'h-8 rounded-md px-3 text-xs',
    props.size === 'lg' && 'h-10 rounded-md px-8',
    props.size === 'icon' && 'h-9 w-9',
    attrs.class as string,
  ),
)
</script>

<template>
  <button v-bind="{ ...attrs, class: undefined }" :class="buttonClass">
    <slot />
  </button>
</template>
