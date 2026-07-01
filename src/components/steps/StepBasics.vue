<script setup lang="ts">
import { Plus, X, MapPin } from 'lucide-vue-next'
import type { FormState, Nature, MobileUnit, LinkedReport } from '@/types'
import { uid } from '@/lib/utils'
import AppInput from '@/components/ui/Input.vue'
import AppSelect from '@/components/ui/Select.vue'
import AppLabel from '@/components/ui/Label.vue'
import AppButton from '@/components/ui/Button.vue'
import AppRadioGroup from '@/components/ui/RadioGroup.vue'
import AppCheckbox from '@/components/ui/Checkbox.vue'

const basics = defineModel<FormState['basics']>({ required: true })

const BRAZIL_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO',
  'MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

const OCCURRENCE_TYPE_OPTIONS = [
  { value: 'criminal', label: 'Criminal' },
  { value: 'administrativa', label: 'Administrativa' },
]

const CLASSIFICATION_OPTIONS = [
  { value: 'comum', label: 'Comum' },
  { value: 'destaque', label: 'Destaque' },
  { value: 'reservada', label: 'Reservada' },
]

const IN_FLAGRANTE_OPTIONS = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
]

const INVESTIGATION_UNITS = [
  'DGI', 'DCA', 'DCCP', 'DEAM', 'DECCAFE', 'DHPP', 'DPCA', 'DRACO', 'DRF', 'DRFV',
]

const MOTIVATIONS = [
  'Patrimonial', 'Passional', 'Vingança', 'Disputa por território / tráfico',
  'Violência doméstica', 'Embriaguez / uso de drogas', 'Não identificada', 'Outros',
]

function viewOnMap() {
  if (!basics.value.coordinates) return
  window.open(`https://www.google.com/maps?q=${encodeURIComponent(basics.value.coordinates)}`, '_blank')
}

function addNature() {
  basics.value.natures.push({ id: uid(), name: '', attempted: false })
}
function removeNature(id: string) {
  basics.value.natures = basics.value.natures.filter((n) => n.id !== id)
}

function addMobileUnit() {
  basics.value.mobileUnits.push({
    id: uid(), agency: '', unit: '', vehiclePrefix: '', badgeNumber: '', name: '', occurrenceNumber: '',
  })
}
function removeMobileUnit(id: string) {
  basics.value.mobileUnits = basics.value.mobileUnits.filter((u) => u.id !== id)
}

function addLinkedReport() {
  basics.value.linkedReports.push({ id: uid(), number: '', year: '', issuingAgency: '' })
}
function removeLinkedReport(id: string) {
  basics.value.linkedReports = basics.value.linkedReports.filter((d) => d.id !== id)
}
</script>

<template>
  <div class="space-y-8">

    <!-- ── TIPO DE OCORRÊNCIA ──────────────────────────────────── -->
    <section class="space-y-3 rounded-lg border-2 border-primary/40 bg-primary/5 p-4">
      <div class="space-y-1">
        <AppLabel class="text-sm font-semibold text-foreground">
          Tipo de Ocorrência <span class="text-destructive">*</span>
        </AppLabel>
        <p class="text-xs text-muted-foreground">
          Selecione o tipo de ocorrência para continuar o preenchimento do formulário.
        </p>
      </div>
      <AppRadioGroup
        v-model="basics.occurrenceType"
        name="occurrenceType"
        :options="OCCURRENCE_TYPE_OPTIONS"
        full-width
      />
    </section>

    <template v-if="basics.occurrenceType">
      <!-- ── DADOS DA OCORRÊNCIA ───────────────────────────────── -->
      <section class="space-y-4">
        <p class="border-b border-border pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Dados da Ocorrência
        </p>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="space-y-1.5 sm:col-span-2">
            <AppLabel class="text-xs text-muted-foreground">Classificação <span class="text-destructive">*</span></AppLabel>
            <AppRadioGroup v-model="basics.classification" name="classification" :options="CLASSIFICATION_OPTIONS" />
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Unidade de Apuração <span class="text-destructive">*</span></AppLabel>
            <AppSelect v-model="basics.investigationUnit" placeholder="Selecione">
              <option v-for="u in INVESTIGATION_UNITS" :key="u" :value="u">{{ u }}</option>
            </AppSelect>
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Origem da Comunicação</AppLabel>
            <AppSelect v-model="basics.reportSource" placeholder="Selecione">
              <option value="telefone190">Telefone (190)</option>
              <option value="presencial">Presencial</option>
              <option value="internet">Internet / SINESP Cidadão</option>
              <option value="radio">Rádio / Patrulhamento</option>
              <option value="demais_orgaos">Demais órgãos</option>
              <option value="outros">Outros</option>
            </AppSelect>
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Data da Comunicação</AppLabel>
            <AppInput type="datetime-local" v-model="basics.reportDate" />
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Período do Fato — Início <span class="text-destructive">*</span></AppLabel>
            <AppInput type="datetime-local" v-model="basics.periodStart" />
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Período do Fato — Fim <span class="text-destructive">*</span></AppLabel>
            <AppInput type="datetime-local" v-model="basics.periodEnd" />
          </div>

          <div v-if="basics.occurrenceType === 'administrativa'" class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Motivação <span class="text-destructive">*</span></AppLabel>
            <AppSelect v-model="basics.motivation" placeholder="Selecione">
              <option v-for="m in MOTIVATIONS" :key="m" :value="m">{{ m }}</option>
            </AppSelect>
          </div>

          <div v-if="basics.occurrenceType === 'administrativa'" class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Relacionado a Operação Policial?</AppLabel>
            <AppSelect v-model="basics.policeOperation" placeholder="Selecione">
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </AppSelect>
          </div>

          <div v-if="basics.occurrenceType === 'administrativa' && basics.policeOperation === 'sim'" class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Nome da Operação</AppLabel>
            <AppInput v-model="basics.operationName" placeholder="Informe o nome da operação" />
          </div>

          <div v-if="basics.occurrenceType === 'administrativa'" class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Relacionado a Evento?</AppLabel>
            <AppSelect v-model="basics.event" placeholder="Selecione">
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </AppSelect>
          </div>

          <div v-if="basics.occurrenceType === 'administrativa' && basics.event === 'sim'" class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Nome do Evento</AppLabel>
            <AppInput v-model="basics.eventName" placeholder="Informe o nome do evento" />
          </div>
        </div>
      </section>

      <!-- ── NATUREZA ──────────────────────────────────────────── -->
      <section class="space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-2">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Natureza <span class="text-destructive">*</span>
          </p>
          <AppButton type="button" variant="outline" size="sm" @click="addNature">
            <Plus class="h-3.5 w-3.5" /> Adicionar
          </AppButton>
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Flagrante? <span class="text-destructive">*</span></AppLabel>
          <AppRadioGroup v-model="basics.inFlagrante" name="inFlagrante" :options="IN_FLAGRANTE_OPTIONS" />
        </div>

        <p v-if="basics.natures.length === 0" class="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          Nenhuma natureza informada. Ao menos uma é obrigatória.
        </p>

        <div v-for="nature in basics.natures" :key="nature.id" class="relative rounded-lg border bg-muted/20 p-4">
          <button
            type="button"
            @click="removeNature(nature.id)"
            class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remover"
          >
            <X class="h-3.5 w-3.5" />
          </button>

          <div class="grid grid-cols-1 gap-4 pr-8 sm:grid-cols-2">
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Nome da Natureza</AppLabel>
              <AppInput v-model="nature.name" placeholder="Ex: Furto, Roubo, Lesão Corporal..." />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">&nbsp;</AppLabel>
              <AppCheckbox v-model="nature.attempted">Tentada</AppCheckbox>
            </div>
          </div>
        </div>
      </section>

      <!-- ── ENDEREÇO DO LOCAL DO FATO ─────────────────────────── -->
      <section class="space-y-4">
        <p class="border-b border-border pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Endereço do Local do Fato
        </p>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">País</AppLabel>
            <AppInput v-model="basics.country" placeholder="Brasil" />
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Estado</AppLabel>
            <AppSelect v-model="basics.state" placeholder="UF">
              <option v-for="uf in BRAZIL_STATES" :key="uf" :value="uf">{{ uf }}</option>
            </AppSelect>
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Cidade / RA</AppLabel>
            <AppInput v-model="basics.cityDistrict" placeholder="Cidade ou Região Administrativa" />
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Quadra</AppLabel>
            <AppInput v-model="basics.block" placeholder="Ex: Quadra 3, Bloco A" />
          </div>

          <div class="space-y-1.5 sm:col-span-2">
            <AppLabel class="text-xs text-muted-foreground">Logradouro <span class="text-destructive">*</span></AppLabel>
            <AppInput v-model="basics.street" placeholder="Rua, Avenida, SQN..." />
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Via</AppLabel>
            <AppInput v-model="basics.streetNumber" placeholder="Nº / KM / Via" />
          </div>

          <div class="space-y-1.5 sm:col-span-2">
            <AppLabel class="text-xs text-muted-foreground">Complemento</AppLabel>
            <AppInput v-model="basics.complement" placeholder="Apartamento, bloco, ponto de referência..." />
          </div>

          <div class="space-y-1.5 sm:col-span-3">
            <AppLabel class="text-xs text-muted-foreground">Coordenadas</AppLabel>
            <div class="flex gap-2">
              <AppInput
                v-model="basics.coordinates"
                placeholder="-15.7801, -47.9292"
                class="flex-1"
              />
              <AppButton
                type="button"
                variant="outline"
                size="default"
                :disabled="!basics.coordinates"
                @click="viewOnMap"
                class="shrink-0"
              >
                <MapPin class="h-4 w-4" /> Ver no mapa
              </AppButton>
            </div>
          </div>
        </div>
      </section>

      <!-- ── UNIDADE MÓVEL ─────────────────────────────────────── -->
      <section class="space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-2">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Unidade Móvel de Atendimento à Ocorrência
          </p>
          <AppButton type="button" variant="outline" size="sm" @click="addMobileUnit">
            <Plus class="h-3.5 w-3.5" /> Adicionar
          </AppButton>
        </div>

        <p v-if="basics.mobileUnits.length === 0" class="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          Nenhuma unidade móvel vinculada.
        </p>

        <div v-for="unit in basics.mobileUnits" :key="unit.id" class="relative rounded-lg border bg-muted/20 p-4">
          <button
            type="button"
            @click="removeMobileUnit(unit.id)"
            class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remover"
          >
            <X class="h-3.5 w-3.5" />
          </button>

          <div class="grid grid-cols-1 gap-4 pr-8 sm:grid-cols-2 md:grid-cols-3">
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Órgão</AppLabel>
              <AppInput v-model="unit.agency" placeholder="Ex: PMDF, PCDF" />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Unidade</AppLabel>
              <AppInput v-model="unit.unit" placeholder="Ex: 1ª CIPM" />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Prefixo / Viatura</AppLabel>
              <AppInput v-model="unit.vehiclePrefix" placeholder="Ex: Alfa-01" />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Matrícula</AppLabel>
              <AppInput v-model="unit.badgeNumber" placeholder="Matrícula do agente" />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Nome</AppLabel>
              <AppInput v-model="unit.name" placeholder="Nome do agente" />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Nº da Ocorrência</AppLabel>
              <AppInput v-model="unit.occurrenceNumber" placeholder="Nº da ocorrência do órgão" />
            </div>
          </div>
        </div>
      </section>

      <!-- ── DENÚNCIA VINCULADA ────────────────────────────────── -->
      <section class="space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-2">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Denúncia Vinculada
          </p>
          <AppButton type="button" variant="outline" size="sm" @click="addLinkedReport">
            <Plus class="h-3.5 w-3.5" /> Adicionar
          </AppButton>
        </div>

        <p v-if="basics.linkedReports.length === 0" class="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          Nenhuma denúncia vinculada.
        </p>

        <div v-for="report in basics.linkedReports" :key="report.id" class="relative rounded-lg border bg-muted/20 p-4">
          <button
            type="button"
            @click="removeLinkedReport(report.id)"
            class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remover"
          >
            <X class="h-3.5 w-3.5" />
          </button>

          <div class="grid grid-cols-1 gap-4 pr-8 sm:grid-cols-3">
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Número</AppLabel>
              <AppInput v-model="report.number" placeholder="Nº da denúncia" />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Ano</AppLabel>
              <AppInput v-model="report.year" placeholder="Ex: 2026" maxlength="4" />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Órgão Gerador</AppLabel>
              <AppInput v-model="report.issuingAgency" placeholder="Ex: Disque-Denúncia" />
            </div>
          </div>
        </div>
      </section>
    </template>

  </div>
</template>
