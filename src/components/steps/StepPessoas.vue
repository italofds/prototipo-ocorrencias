<script setup lang="ts">
import type { Pessoa } from '@/types'
import AppInput from '@/components/ui/Input.vue'
import AppSelect from '@/components/ui/Select.vue'
import AppLabel from '@/components/ui/Label.vue'
import AppButton from '@/components/ui/Button.vue'
import { Users, Trash2, Plus } from 'lucide-vue-next'

const pessoas = defineModel<Pessoa[]>({ required: true })

function add() {
  pessoas.value = [
    ...pessoas.value,
    { id: crypto.randomUUID(), nome: '', tipo: '', documento: '' },
  ]
}

function updateField(id: string, k: keyof Pessoa, v: string) {
  pessoas.value = pessoas.value.map((p) => (p.id === id ? { ...p, [k]: v } : p))
}

function remove(id: string) {
  pessoas.value = pessoas.value.filter((p) => p.id !== id)
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="pessoas.length === 0"
      class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center"
    >
      <div class="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
        <Users class="h-5 w-5" />
      </div>
      <p class="text-sm font-medium">Nenhuma pessoa adicionada</p>
      <p class="max-w-md text-xs text-muted-foreground">
        Inclua vítimas, autores, testemunhas ou comunicantes envolvidos na ocorrência.
      </p>
    </div>

    <div
      v-for="(p, i) in pessoas"
      :key="p.id"
      class="rounded-lg border bg-muted/20 p-4"
    >
      <div class="mb-3 flex items-center justify-between">
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pessoa {{ i + 1 }}
        </p>
        <AppButton variant="ghost" size="sm" @click="remove(p.id)">
          <Trash2 class="h-4 w-4" /> Remover
        </AppButton>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="space-y-2 md:col-span-2">
          <AppLabel class="text-xs font-medium text-muted-foreground">Nome completo</AppLabel>
          <AppInput
            :model-value="p.nome"
            @update:model-value="(v) => updateField(p.id, 'nome', v ?? '')"
          />
        </div>

        <div class="space-y-2">
          <AppLabel class="text-xs font-medium text-muted-foreground"
            >Tipo de envolvimento</AppLabel
          >
          <AppSelect
            :model-value="p.tipo"
            @update:model-value="(v) => updateField(p.id, 'tipo', v ?? '')"
            placeholder="Selecione"
          >
            <option value="vitima">Vítima</option>
            <option value="autor">Autor</option>
            <option value="testemunha">Testemunha</option>
            <option value="comunicante">Comunicante</option>
          </AppSelect>
        </div>

        <div class="space-y-2 md:col-span-3">
          <AppLabel class="text-xs font-medium text-muted-foreground">CPF / RG</AppLabel>
          <AppInput
            placeholder="000.000.000-00"
            :model-value="p.documento"
            @update:model-value="(v) => updateField(p.id, 'documento', v ?? '')"
          />
        </div>
      </div>
    </div>

    <AppButton variant="outline" @click="add" class="w-full">
      <Plus class="h-4 w-4" /> Adicionar pessoa
    </AppButton>
  </div>
</template>
