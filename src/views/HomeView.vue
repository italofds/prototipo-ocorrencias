<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import {
  ShieldCheck,
  Hash,
  Calendar,
  ClipboardList,
  Users,
  Car,
  ScrollText,
  Paperclip,
  Check,
  ChevronRight,
  ChevronLeft,
  Save,
  Printer,
  Moon,
  Sun,
  CircleDashed,
  CircleDot,
  UserCheck,
  Menu,
} from 'lucide-vue-next'
import { cn, stepProgress, statusFromProgress, initials, uid, nowDateTimeLocal } from '@/lib/utils'
import type { FormState, StepDef, Participante } from '@/types'
import AppButton from '@/components/ui/Button.vue'
import AppProgress from '@/components/ui/Progress.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import AudioRecorder from '@/components/AudioRecorder.vue'
import StepBasicos from '@/components/steps/StepBasicos.vue'
import StepPessoas from '@/components/steps/StepPessoas.vue'
import StepObjetos from '@/components/steps/StepObjetos.vue'
import StepHistorico from '@/components/steps/StepHistorico.vue'
import StepAnexos from '@/components/steps/StepAnexos.vue'
import PCDFLogo from '@/img/PCDF.svg'

const STEPS: StepDef[] = [
  { id: 'basicos', title: 'Dados Básicos', description: 'Natureza, data, hora, local da ocorrência e outros' },
  { id: 'pessoas', title: 'Pessoas Envolvidas', description: 'Vítimas, autores, testemunhas e comunicantes' },
  { id: 'objetos', title: 'Objetos / Veículos', description: 'Bens, armas e veículos relacionados' },
  { id: 'historico', title: 'Histórico', description: 'Narrativa detalhada dos fatos' },
  { id: 'anexos', title: 'Anexos', description: 'Documentos, fotos e laudos' },
]

const STEP_ICONS = [ClipboardList, Users, Car, ScrollText, Paperclip]

const OCCURRENCE_INFO = {
  numero: '123456/2026',
  protocolo: '12346789/2026',
  abertura: '22/06/2026 14:32',
}

const STATUS_LABEL = { pending: 'Pendente', partial: 'Parcial', complete: 'Completo' }

const PARTICIPANTES_INICIAIS: Participante[] = [
  { id: 'p1', nome: 'Inv. Carla Mendes', papel: 'Atendente — abertura', em: '14:32' },
  { id: 'p2', nome: 'Esc. Rafael Lima', papel: 'Edição — Dados básicos', em: '14:41' },
  { id: 'p3', nome: 'Inv. Carla Mendes', papel: 'Edição — Histórico', em: '15:02' },
]

// ── State ──────────────────────────────────────────────────────────────────────
const data = reactive<FormState>({
  basicos: {
    tipoOcorrencia: '', classificacao: 'comum', unidadeRegistro: 'DGI', unidadeApuracao: '',
    flagrante: '', origemComunicacao: '', dataComunicacao: nowDateTimeLocal(), periodoInicio: '', periodoFim: '',
    motivacao: '', operacaoPolicial: '', nomeOperacao: '', evento: '', nomeEvento: '',
    pais: 'Brasil', estado: '', cidadeRA: '', quadra: '', logradouro: '', via: '', complemento: '',
    coordenadas: '', naturezas: [], unidadesMoveis: [], denuncias: [],
  },
  pessoas: [],
  objetos: [],
  historico: '',
  anexos: [],
})

const activeIdx = ref(0)
const homologada = ref(false)
const homologadoPor = ref<{ nome: string; em: string } | null>(null)
const theme = ref<'light' | 'dark'>('light')
const participantes = ref<Participante[]>(PARTICIPANTES_INICIAIS)
const sidebarOpen = ref(window.innerWidth >= 1024)

watch(
  theme,
  (t) => document.documentElement.classList.toggle('dark', t === 'dark'),
  { immediate: true },
)

// ── Computed ───────────────────────────────────────────────────────────────────
const progresses = computed(() => STEPS.map((s) => stepProgress(s.id, data)))
const statuses = computed(() => progresses.value.map(statusFromProgress))
const overall = computed(() =>
  Math.round((progresses.value.reduce((a, b) => a + b, 0) / STEPS.length) * 100),
)
const active = computed(() => STEPS[activeIdx.value])
const canHomologate = computed(() => statuses.value.every((s) => s === 'complete') && !homologada.value)

// ── Actions ────────────────────────────────────────────────────────────────────
function homologar() {
  homologada.value = true
  homologadoPor.value = {
    nome: 'Del. Marcos Pereira',
    em: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function handleAutoFill() {
  if (!data.basicos.tipoOcorrencia) data.basicos.tipoOcorrencia = 'criminal'
  if (!data.basicos.classificacao) data.basicos.classificacao = 'comum'
  if (!data.basicos.unidadeApuracao) data.basicos.unidadeApuracao = 'DGI'
  if (!data.basicos.flagrante) data.basicos.flagrante = 'nao'
  if (!data.basicos.origemComunicacao) data.basicos.origemComunicacao = 'telefone190'
  if (!data.basicos.periodoInicio) data.basicos.periodoInicio = '2026-06-22T13:50'
  if (!data.basicos.periodoFim) data.basicos.periodoFim = '2026-06-22T14:30'
  if (data.basicos.tipoOcorrencia === 'administrativa' && !data.basicos.motivacao)
    data.basicos.motivacao = 'Patrimonial'
  if (data.basicos.naturezas.length === 0)
    data.basicos.naturezas.push({ id: uid(), nome: 'Furto', tentada: false })
  if (!data.basicos.logradouro) data.basicos.logradouro = 'Av. Paulista, 1.500'
  if (!data.basicos.complemento) data.basicos.complemento = 'Próximo ao MASP'
  if (!data.basicos.cidadeRA) data.basicos.cidadeRA = 'São Paulo'
  if (!data.basicos.estado) data.basicos.estado = 'SP'
  if (!data.historico)
    data.historico =
      'Transcrição automática do áudio: a vítima relatou que, por volta das 13h50, ao caminhar pela Av. Paulista, teve seu aparelho celular subtraído por indivíduo em motocicleta, que evadiu-se sentido Consolação. Não houve agressão física. Foram acionadas viaturas para diligências na região.'
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-background lg:flex">
    <!-- Espaçador de layout (desktop): empurra o conteúdo em sincronia com a animação do sidebar -->
    <div
      class="hidden shrink-0 lg:block lg:transition-[width] lg:duration-300 lg:ease-in-out"
      :class="sidebarOpen ? 'lg:w-64' : 'lg:w-0'"
      aria-hidden="true"
    />
    <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="min-w-0 flex-1">
      <!-- Header -->
      <header class="sticky top-0 z-30 bg-header text-header-foreground">
        <div class="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4">
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="toggleSidebar"
              aria-label="Alternar menu lateral"
              class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white/10 text-header-foreground transition-colors hover:bg-white/20"
            >
              <Menu class="h-5 w-5" />
            </button>
            <div
              class="grid h-12 w-12 place-items-center rounded-lg text-header-foreground"
            >
              <img :src="PCDFLogo" alt="PCDF" class="h-12 w-12 object-contain" />
            </div>
            <div>
              <h1 class="text-base font-semibold leading-tight">Ocorrências Policiais</h1>
              <p class="text-xs text-header-muted">Polícia Civil do Distrito Federal</p>
            </div>
          </div>
          <button
            type="button"
            @click="toggleTheme"
            :aria-label="theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
            class="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-header-foreground transition-colors hover:bg-white/20"
          >
            <Sun v-if="theme === 'dark'" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </button>
        </div>
      </header>

      <!-- Actions bar -->
      <div class="border-b bg-card">
        <div
          class="mx-auto flex max-w-[1400px] items-center justify-end gap-2 px-6 py-2.5"
        >
          <AppButton variant="outline" size="sm" @click="">
            <Printer class="h-4 w-4" /> Imprimir
          </AppButton>
          <AppButton
            size="sm"
            :disabled="!canHomologate"
            @click="homologar"
            :class="cn(homologada && 'bg-complete hover:bg-complete/90')"
          >
            <ShieldCheck class="h-4 w-4" />
            {{ homologada ? 'Ocorrência homologada' : 'Homologar' }}
          </AppButton>
        </div>
      </div>

      <!-- Info bar -->
      <div class="border-b bg-muted/40 lg:sticky lg:top-20 lg:z-20 lg:bg-card">
        <div
          class="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-3 px-6 py-4 sm:grid-cols-4"
        >
          <div class="flex items-start gap-2">
            <Hash class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground">Nº Ocorrência</p>
              <p class="truncate text-sm font-semibold">{{ OCCURRENCE_INFO.numero }}</p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <ClipboardList class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground">Protocolo</p>
              <p class="truncate text-sm font-semibold">{{ OCCURRENCE_INFO.protocolo }}</p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground">Unidade de Registro</p>
              <p class="truncate text-sm font-semibold">{{ data.basicos.unidadeRegistro }}</p>
            </div>
          </div>          
          <div class="flex items-start gap-2">
            <Calendar class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div class="min-w-0">
              <p class="text-[11px] uppercase tracking-wide text-muted-foreground">Abertura</p>
              <p class="truncate text-sm font-semibold">{{ OCCURRENCE_INFO.abertura }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main -->
      <main
        class="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[340px_minmax(0,1fr)]"
      >
        <!-- Sidebar steps -->
        <aside class="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div class="rounded-xl border bg-card p-5 shadow-card">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-sm font-semibold">Progresso da ocorrência</h2>
              <span class="text-sm font-semibold text-primary">{{ overall }}%</span>
            </div>
            <AppProgress :value="overall" class="h-2" />

            <ol class="mt-6 space-y-1">
              <li v-for="(step, i) in STEPS" :key="step.id">
                <button
                  type="button"
                  @click="activeIdx = i"
                  :class="
                    cn(
                      'group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-transparent p-3 text-left transition-colors',
                      i === activeIdx ? 'border-border bg-accent/40' : 'hover:bg-accent/30',
                    )
                  "
                >
                  <span
                    :class="
                      cn(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1',
                        statuses[i] === 'complete' &&
                          'bg-complete text-complete-foreground ring-complete/30',
                        statuses[i] === 'partial' &&
                          'bg-partial-soft text-partial-foreground ring-partial/40',
                        statuses[i] === 'pending' && 'bg-pending-soft text-muted-foreground ring-border',
                      )
                    "
                  >
                    <Check v-if="statuses[i] === 'complete'" class="h-4 w-4" :stroke-width="3" />
                    <component v-else :is="STEP_ICONS[i]" class="h-4 w-4" />
                  </span>
                  <span class="min-w-0">
                    <span class="flex items-center gap-2">
                      <span class="text-xs font-medium text-muted-foreground">Etapa {{ i + 1 }}</span>
                      <span
                        :class="
                          cn(
                            'h-1.5 w-1.5 rounded-full',
                            statuses[i] === 'complete' && 'bg-complete',
                            statuses[i] === 'partial' && 'bg-partial',
                            statuses[i] === 'pending' && 'bg-border',
                          )
                        "
                      />
                    </span>
                    <span class="block truncate text-sm font-semibold">{{ step.title }}</span>
                    <span class="block truncate text-xs text-muted-foreground">{{
                      STATUS_LABEL[statuses[i]]
                    }}</span>
                  </span>
                  <ChevronRight
                    :class="
                      cn(
                        'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                        i === activeIdx && 'translate-x-0.5 text-foreground',
                      )
                    "
                  />
                </button>
              </li>
            </ol>

            <div
              :class="
                cn(
                  'mt-5 rounded-lg border p-3 text-xs',
                  homologada
                    ? 'border-complete/40 bg-complete-soft text-complete'
                    : 'border-dashed text-muted-foreground',
                )
              "
            >
              <div class="flex items-center gap-2 font-medium">
                <ShieldCheck class="h-4 w-4" />
                {{ homologada ? 'Ocorrência homologada' : 'Aguardando homologação' }}
              </div>
              <p class="mt-1 leading-relaxed">
                <template v-if="homologada && homologadoPor">
                  Homologada por {{ homologadoPor.nome }} às {{ homologadoPor.em }}.
                </template>
                <template v-else>
                  Conclua todas as etapas para liberar a homologação.
                </template>
              </p>
            </div>
          </div>

          <!-- Participantes -->
          <div class="rounded-xl border bg-card p-5 shadow-card">
            <div class="mb-3 flex items-center gap-2">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <h2 class="text-sm font-semibold">Participantes do registro</h2>
            </div>
            <ul class="space-y-2.5">
              <li v-for="p in participantes" :key="p.id" class="flex items-start gap-3">
                <div
                  class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
                >
                  {{ initials(p.nome) }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium">{{ p.nome }}</p>
                  <p class="truncate text-xs text-muted-foreground">{{ p.papel }}</p>
                </div>
                <span class="text-xs text-muted-foreground">{{ p.em }}</span>
              </li>

              <li
                v-if="homologada && homologadoPor"
                class="flex items-start gap-3 rounded-md border border-complete/30 bg-complete-soft/60 p-2"
              >
                <div
                  class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-complete text-xs font-semibold text-complete-foreground"
                >
                  <ShieldCheck class="h-4 w-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium">{{ homologadoPor.nome }}</p>
                  <p class="truncate text-xs text-complete">Homologação</p>
                </div>
                <span class="text-xs text-complete">{{ homologadoPor.em }}</span>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Form panel -->
        <section class="space-y-6">
          <AudioRecorder @auto-fill="handleAutoFill" />

          <div class="rounded-xl border bg-card shadow-elevated">
            <div class="flex items-start justify-between gap-6 border-b p-6">
              <div class="min-w-0">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Etapa {{ activeIdx + 1 }} de {{ STEPS.length }}
                </p>
                <h2 class="mt-1 text-2xl font-semibold">{{ active.title }}</h2>
                <p class="mt-1 text-sm text-muted-foreground">{{ active.description }}</p>
              </div>
              <StatusBadge :status="statuses[activeIdx]" />
            </div>

            <div class="p-6">
              <StepBasicos v-if="active.id === 'basicos'" v-model="data.basicos" />
              <StepPessoas v-else-if="active.id === 'pessoas'" v-model="data.pessoas" />
              <StepObjetos v-else-if="active.id === 'objetos'" v-model="data.objetos" />
              <StepHistorico v-else-if="active.id === 'historico'" v-model="data.historico" />
              <StepAnexos v-else-if="active.id === 'anexos'" v-model="data.anexos" />
            </div>

            <div
              class="flex items-center justify-between gap-3 border-t bg-muted/30 px-6 py-4"
            >
              <AppButton
                variant="ghost"
                @click="activeIdx = Math.max(0, activeIdx - 1)"
                :disabled="activeIdx === 0"
              >
                <ChevronLeft class="h-4 w-4" /> Voltar
              </AppButton>
              <div class="flex items-center gap-2">
                <AppButton variant="outline">
                  <Save class="h-4 w-4" /> Salvar
                </AppButton>
                <AppButton
                  v-if="activeIdx < STEPS.length - 1"
                  @click="activeIdx = Math.min(STEPS.length - 1, activeIdx + 1)"
                >
                  Próxima etapa <ChevronRight class="h-4 w-4" />
                </AppButton>
                <AppButton v-else :disabled="!canHomologate" @click="homologar">
                  <ShieldCheck class="h-4 w-4" /> Homologar
                </AppButton>
              </div>
            </div>
          </div>

          <!-- Mobile progress strip -->
          <div class="flex items-center gap-1.5 lg:hidden">
            <div
              v-for="(s, i) in STEPS"
              :key="s.id"
              :class="
                cn(
                  'h-1.5 flex-1 rounded-full',
                  statuses[i] === 'complete' && 'bg-complete',
                  statuses[i] === 'partial' && 'bg-partial',
                  statuses[i] === 'pending' && 'bg-border',
                  i === activeIdx && 'ring-2 ring-ring/40',
                )
              "
            />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
