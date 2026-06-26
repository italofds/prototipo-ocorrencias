<script setup lang="ts">
import { computed } from 'vue'
import { Check, CircleDot, CircleDashed } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { Status } from '@/types'

const props = defineProps<{ status: Status }>()

const styles: Record<Status, string> = {
  pending: 'bg-pending-soft text-muted-foreground',
  partial: 'bg-partial-soft text-partial-foreground',
  complete: 'bg-complete-soft text-complete',
}

const labels: Record<Status, string> = {
  pending: 'Pendente',
  partial: 'Parcial',
  complete: 'Completo',
}

const icon = computed(() => {
  if (props.status === 'complete') return Check
  if (props.status === 'partial') return CircleDot
  return CircleDashed
})
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        styles[status],
      )
    "
  >
    <component :is="icon" class="h-3.5 w-3.5" :stroke-width="2.5" />
    {{ labels[status] }}
  </span>
</template>
