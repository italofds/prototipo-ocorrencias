<script setup lang="ts">
import { computed } from 'vue'
import { Plus, X, FileText } from 'lucide-vue-next'
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
  {
    value: 'criminal',
    label: 'Criminal',
    description: 'Fatos que configuram crime ou contravenção penal, sujeitos a apuração criminal.',
  },
  {
    value: 'administrativa',
    label: 'Administrativo',
    description: 'Registros de natureza administrativa, sem caracterização de ilícito penal.',
  },
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

const COUNTRIES = ['Brasil', 'Argentina', 'Bolívia', 'Paraguai', 'Uruguai', 'Outro']

const DF_CITIES = [
  'Plano Piloto', 'Águas Claras', 'Brazlândia', 'Candangolândia', 'Ceilândia',
  'Cruzeiro', 'Gama', 'Guará', 'Itapoã', 'Jardim Botânico', 'Lago Norte', 'Lago Sul',
  'Núcleo Bandeirante', 'Paranoá', 'Park Way', 'Planaltina', 'Recanto das Emas',
  'Riacho Fundo', 'Riacho Fundo II', 'Samambaia', 'Santa Maria', 'São Sebastião',
  'Sobradinho', 'Sobradinho II', 'Sudoeste/Octogonal', 'Taguatinga', 'Varjão', 'Vicente Pires',
]

const BLOCKS = [
  'QNM 12', 'QNL 6', 'QNN 20', 'QI 5', 'QI 28', 'SQN 108', 'SQS 308',
  'SQNW 105', 'SQSW 305', 'EQN 102/103', 'Conjunto A', 'Conjunto B', 'Não se aplica',
]

const STREETS = [
  'Eixo Monumental', 'Eixo Rodoviário (Eixão)', 'W3 Norte', 'W3 Sul',
  'L2 Norte', 'L2 Sul', 'EPTG', 'EPIA', 'EPNB', 'DF-001 (EPCT)', 'DF-002 (EPIG)',
]

const ROUTES = [
  'Via L2', 'Via L4', 'Via S1', 'Via N1', 'Via EPTG', 'Via EPIA', 'BR-020', 'BR-070', 'Não se aplica',
]

const MOBILE_UNIT_AGENCIES = ['PMDF', 'PCDF', 'CBMDF', 'DPRF', 'DETRAN-DF', 'Outros']

const NATURES = [
  'Furto', 'Furto Qualificado', 'Roubo', 'Roubo Majorado', 'Latrocínio (Roubo Seguido de Morte)',
  'Homicídio Simples', 'Homicídio Qualificado', 'Lesão Corporal Dolosa', 'Lesão Corporal Culposa',
  'Ameaça', 'Violência Doméstica e Familiar contra a Mulher', 'Estupro', 'Estupro de Vulnerável',
  'Tráfico de Entorpecentes e Drogas Afins', 'Porte Ilegal de Arma de Fogo',
  'Associação Criminosa para o Tráfico de Drogas', 'Estelionato', 'Receptação',
  'Dano ao Patrimônio Público ou Privado', 'Extorsão', 'Extorsão Mediante Sequestro',
  'Sequestro e Cárcere Privado', 'Injúria', 'Difamação', 'Calúnia', 'Outros',
]

const ISSUING_AGENCIES = [
  'Disque-Denúncia (181)', 'PCDF', 'PMDF', 'Ministério Público', 'Corregedoria', 'Outros',
]

function blockNonIntegerKey(e: KeyboardEvent) {
  if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
}

const mapQuery = computed(() => {
  if (basics.value.coordinates) return basics.value.coordinates
  const parts = [
    basics.value.street,
    basics.value.block,
    basics.value.cityDistrict,
    basics.value.state,
    basics.value.country,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'Brasília, DF, Brasil'
})

const mapEmbedUrl = computed(
  () => `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&z=15&output=embed`,
)

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
    <section class="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
      <div class="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
        <FileText class="h-5 w-5" />
      </div>
      <p class="text-sm font-medium">
        Tipo de Ocorrência <span class="text-destructive">*</span>
      </p>
      <p class="max-w-md text-xs text-muted-foreground">
        Selecione o tipo de ocorrência para continuar o preenchimento do formulário.
      </p>

      <AppRadioGroup
        v-model="basics.occurrenceType"
        name="occurrenceType"
        :options="OCCURRENCE_TYPE_OPTIONS"
        full-width
        class="w-full max-w-xl pt-2 text-left"
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

          <div v-if="basics.occurrenceType === 'criminal'" class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Motivação <span class="text-destructive">*</span></AppLabel>
            <AppSelect v-model="basics.motivation" placeholder="Selecione">
              <option v-for="m in MOTIVATIONS" :key="m" :value="m">{{ m }}</option>
            </AppSelect>
          </div>

          <div v-if="basics.occurrenceType === 'criminal'" class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">&nbsp;</AppLabel>
            <AppCheckbox v-model="basics.policeOperation" class="w-full">Relacionado a Operação Policial?</AppCheckbox>
          </div>

          <div v-if="basics.occurrenceType === 'criminal' && basics.policeOperation" class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Nome da Operação</AppLabel>
            <AppInput v-model="basics.operationName" placeholder="Informe o nome da operação" />
          </div>

          <div v-if="basics.occurrenceType === 'criminal'" class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">&nbsp;</AppLabel>
            <AppCheckbox v-model="basics.event" class="w-full">Relacionado a Evento?</AppCheckbox>
          </div>

          <div v-if="basics.occurrenceType === 'criminal' && basics.event" class="space-y-1.5">
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

          <div class="grid grid-cols-1 gap-4 pr-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Nome da Natureza</AppLabel>
              <AppSelect v-model="nature.name" placeholder="Selecione">
                <option v-for="n in NATURES" :key="n" :value="n">{{ n }}</option>
              </AppSelect>
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">&nbsp;</AppLabel>
              <AppCheckbox v-model="nature.attempted">Tentada</AppCheckbox>
            </div>
          </div>
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Flagrante? <span class="text-destructive">*</span></AppLabel>
          <AppRadioGroup v-model="basics.inFlagrante" name="inFlagrante" :options="IN_FLAGRANTE_OPTIONS" />
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
            <AppSelect v-model="basics.country" placeholder="Selecione">
              <option v-for="c in COUNTRIES" :key="c" :value="c">{{ c }}</option>
            </AppSelect>
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Estado</AppLabel>
            <AppSelect v-model="basics.state" placeholder="UF">
              <option v-for="uf in BRAZIL_STATES" :key="uf" :value="uf">{{ uf }}</option>
            </AppSelect>
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Cidade / RA</AppLabel>
            <AppSelect v-model="basics.cityDistrict" placeholder="Selecione">
              <option v-for="c in DF_CITIES" :key="c" :value="c">{{ c }}</option>
            </AppSelect>
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Quadra</AppLabel>
            <AppSelect v-model="basics.block" placeholder="Selecione">
              <option v-for="b in BLOCKS" :key="b" :value="b">{{ b }}</option>
            </AppSelect>
          </div>

          <div class="space-y-1.5 sm:col-span-2">
            <AppLabel class="text-xs text-muted-foreground">Logradouro <span class="text-destructive">*</span></AppLabel>
            <AppSelect v-model="basics.street" placeholder="Selecione">
              <option v-for="s in STREETS" :key="s" :value="s">{{ s }}</option>
            </AppSelect>
          </div>

          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Via</AppLabel>
            <AppSelect v-model="basics.streetNumber" placeholder="Selecione">
              <option v-for="r in ROUTES" :key="r" :value="r">{{ r }}</option>
            </AppSelect>
          </div>

          <div class="space-y-1.5 sm:col-span-2">
            <AppLabel class="text-xs text-muted-foreground">Complemento</AppLabel>
            <AppInput v-model="basics.complement" placeholder="Apartamento, bloco, ponto de referência..." />
          </div>

          <div class="space-y-1.5 sm:col-span-3">
            <AppLabel class="text-xs text-muted-foreground">Localização no Mapa</AppLabel>
            <div class="overflow-hidden rounded-md border border-input">
              <iframe
                :src="mapEmbedUrl"
                title="Mapa do local do fato"
                class="h-64 w-full sm:h-80"
                style="border: 0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div class="space-y-1.5 sm:col-span-3">
            <AppLabel class="text-xs text-muted-foreground">Coordenadas</AppLabel>
            <AppInput v-model="basics.coordinates" disabled />
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
              <AppSelect v-model="unit.agency" placeholder="Selecione">
                <option v-for="a in MOBILE_UNIT_AGENCIES" :key="a" :value="a">{{ a }}</option>
              </AppSelect>
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
              <AppInput
                type="number"
                min="0"
                step="1"
                v-model="report.number"
                placeholder="Nº da denúncia"
                @keydown="blockNonIntegerKey"
              />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Ano</AppLabel>
              <AppInput
                type="number"
                min="1900"
                max="2100"
                step="1"
                v-model="report.year"
                placeholder="Ex: 2026"
                @keydown="blockNonIntegerKey"
              />
            </div>
            <div class="space-y-1.5">
              <AppLabel class="text-xs text-muted-foreground">Órgão Gerador</AppLabel>
              <AppSelect v-model="report.issuingAgency" placeholder="Selecione">
                <option v-for="a in ISSUING_AGENCIES" :key="a" :value="a">{{ a }}</option>
              </AppSelect>
            </div>
          </div>
        </div>
      </section>
    </template>

  </div>
</template>
