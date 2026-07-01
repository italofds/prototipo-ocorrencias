<script setup lang="ts">
import type { Attachment } from '@/types'
import AppButton from '@/components/ui/Button.vue'
import { Upload, Paperclip, Trash2 } from 'lucide-vue-next'

const attachments = defineModel<Attachment[]>({ required: true })

const categories = [
  { type: 'Foto', label: 'Foto / imagem' },
  { type: 'Documento', label: 'Documento' },
  { type: 'Laudo', label: 'Laudo / perícia' },
]

function add(type: string) {
  attachments.value = [
    ...attachments.value,
    { id: crypto.randomUUID(), name: `arquivo-${attachments.value.length + 1}.pdf`, type },
  ]
}

function remove(id: string) {
  attachments.value = attachments.value.filter((a) => a.id !== id)
}
</script>

<template>
  <div class="space-y-5">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <button
        v-for="c in categories"
        :key="c.type"
        type="button"
        @click="add(c.type)"
        class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors hover:border-foreground/30 hover:bg-accent/30"
      >
        <div
          class="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground"
        >
          <Upload class="h-5 w-5" />
        </div>
        <p class="text-sm font-medium">{{ c.label }}</p>
        <p class="text-xs text-muted-foreground">Clique para anexar</p>
      </button>
    </div>

    <div v-if="attachments.length > 0" class="divide-y rounded-lg border">
      <div
        v-for="a in attachments"
        :key="a.id"
        class="flex items-center justify-between gap-4 p-3"
      >
        <div class="flex items-center gap-3">
          <div
            class="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground"
          >
            <Paperclip class="h-4 w-4" />
          </div>
          <div>
            <p class="text-sm font-medium">{{ a.name }}</p>
            <p class="text-xs text-muted-foreground">{{ a.type }}</p>
          </div>
        </div>
        <AppButton variant="ghost" size="sm" @click="remove(a.id)">
          <Trash2 class="h-4 w-4" /> Remover
        </AppButton>
      </div>
    </div>
  </div>
</template>
