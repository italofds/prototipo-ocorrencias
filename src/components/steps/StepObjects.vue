<script setup lang="ts">
import type { Item } from '@/types'
import AppInput from '@/components/ui/Input.vue'
import AppSelect from '@/components/ui/Select.vue'
import AppLabel from '@/components/ui/Label.vue'
import AppTextarea from '@/components/ui/Textarea.vue'
import AppButton from '@/components/ui/Button.vue'
import { Car, Trash2, Plus } from 'lucide-vue-next'

const items = defineModel<Item[]>({ required: true })

function add() {
  items.value = [
    ...items.value,
    { id: crypto.randomUUID(), category: '', description: '', licensePlate: '' },
  ]
}

function updateField(id: string, k: keyof Item, v: string) {
  items.value = items.value.map((o) => (o.id === id ? { ...o, [k]: v } : o))
}

function remove(id: string) {
  items.value = items.value.filter((o) => o.id !== id)
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="items.length === 0"
      class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center"
    >
      <div class="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
        <Car class="h-5 w-5" />
      </div>
      <p class="text-sm font-medium">Nenhum objeto ou veículo</p>
      <p class="max-w-md text-xs text-muted-foreground">
        Cadastre bens subtraídos, recuperados, armas apreendidas ou veículos envolvidos.
      </p>
    </div>

    <div
      v-for="(o, i) in items"
      :key="o.id"
      class="rounded-lg border bg-muted/20 p-4"
    >
      <div class="mb-3 flex items-center justify-between">
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Item {{ i + 1 }}
        </p>
        <AppButton variant="ghost" size="sm" @click="remove(o.id)">
          <Trash2 class="h-4 w-4" /> Remover
        </AppButton>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="space-y-2">
          <AppLabel class="text-xs font-medium text-muted-foreground">Categoria</AppLabel>
          <AppSelect
            :model-value="o.category"
            @update:model-value="(v) => updateField(o.id, 'category', v ?? '')"
            placeholder="Selecione"
          >
            <option value="veiculo">Veículo</option>
            <option value="arma">Arma</option>
            <option value="eletronico">Eletrônico</option>
            <option value="documento">Documento</option>
            <option value="outro">Outro</option>
          </AppSelect>
        </div>

        <div class="space-y-2">
          <AppLabel class="text-xs font-medium text-muted-foreground">Placa (se veículo)</AppLabel>
          <AppInput
            placeholder="ABC-1D23"
            :model-value="o.licensePlate"
            @update:model-value="(v) => updateField(o.id, 'licensePlate', v ?? '')"
          />
        </div>

        <div class="space-y-2 md:col-span-3">
          <AppLabel class="text-xs font-medium text-muted-foreground">Descrição</AppLabel>
          <AppTextarea
            :rows="3"
            placeholder="Marca, modelo, cor, características, número de série..."
            :model-value="o.description"
            @update:model-value="(v) => updateField(o.id, 'description', v ?? '')"
          />
        </div>
      </div>
    </div>

    <AppButton variant="outline" @click="add" class="w-full">
      <Plus class="h-4 w-4" /> Adicionar objeto / veículo
    </AppButton>
  </div>
</template>
