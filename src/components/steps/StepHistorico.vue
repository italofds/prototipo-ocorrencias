<script setup lang="ts">
import AppTextarea from '@/components/ui/Textarea.vue'
import AppLabel from '@/components/ui/Label.vue'

const historico = defineModel<string>({ required: true })
</script>

<template>
  <div class="space-y-3">
    <div class="space-y-2">
      <AppLabel class="text-xs font-medium text-muted-foreground">Narrativa dos fatos</AppLabel>
      <AppTextarea
        :rows="14"
        placeholder="Descreva detalhadamente o ocorrido: dinâmica do fato, local, horário, ações dos envolvidos, providências adotadas..."
        v-model="historico"
      />
    </div>
    <p class="text-xs text-muted-foreground">
      {{ historico.trim().length }} caracteres — mínimo recomendado: 30
    </p>
  </div>
</template>
