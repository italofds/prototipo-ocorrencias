<script setup lang="ts">
import type { FormState } from '@/types'
import AppInput from '@/components/ui/Input.vue'
import AppSelect from '@/components/ui/Select.vue'
import AppLabel from '@/components/ui/Label.vue'

const basicos = defineModel<FormState['basicos']>({ required: true })
</script>

<template>
  <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
    <div class="space-y-2 md:col-span-3">
      <AppLabel class="text-xs font-medium text-muted-foreground">Natureza da ocorrência</AppLabel>
      <AppSelect v-model="basicos.natureza" placeholder="Selecione a natureza">
        <option value="furto">Furto</option>
        <option value="roubo">Roubo</option>
        <option value="lesao">Lesão corporal</option>
        <option value="ameaca">Ameaça</option>
        <option value="transito">Acidente de trânsito</option>
        <option value="desaparecimento">Desaparecimento</option>
      </AppSelect>
    </div>

    <div class="space-y-2">
      <AppLabel class="text-xs font-medium text-muted-foreground">Data do fato</AppLabel>
      <AppInput type="date" v-model="basicos.data" />
    </div>

    <div class="space-y-2">
      <AppLabel class="text-xs font-medium text-muted-foreground">Hora do fato</AppLabel>
      <AppInput type="time" v-model="basicos.hora" />
    </div>

    <div class="space-y-2">
      <AppLabel class="text-xs font-medium text-muted-foreground">UF</AppLabel>
      <AppSelect v-model="basicos.uf" placeholder="UF">
        <option v-for="u in ['SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'DF']" :key="u" :value="u">
          {{ u }}
        </option>
      </AppSelect>
    </div>

    <div class="space-y-2 md:col-span-2">
      <AppLabel class="text-xs font-medium text-muted-foreground">Endereço</AppLabel>
      <AppInput placeholder="Logradouro, número, complemento" v-model="basicos.endereco" />
    </div>

    <div class="space-y-2">
      <AppLabel class="text-xs font-medium text-muted-foreground">Bairro</AppLabel>
      <AppInput v-model="basicos.bairro" />
    </div>

    <div class="space-y-2 md:col-span-3">
      <AppLabel class="text-xs font-medium text-muted-foreground">Município</AppLabel>
      <AppInput v-model="basicos.municipio" />
    </div>
  </div>
</template>
