<script setup lang="ts">
import { Plus, X, MapPin } from 'lucide-vue-next'
import type { FormState, Natureza, UnidadeMovel, DenunciaVinculada } from '@/types'
import { uid } from '@/lib/utils'
import AppInput from '@/components/ui/Input.vue'
import AppSelect from '@/components/ui/Select.vue'
import AppLabel from '@/components/ui/Label.vue'
import AppButton from '@/components/ui/Button.vue'

const basicos = defineModel<FormState['basicos']>({ required: true })

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO',
  'MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

function verNoMapa() {
  if (!basicos.value.coordenadas) return
  window.open(`https://www.google.com/maps?q=${encodeURIComponent(basicos.value.coordenadas)}`, '_blank')
}

function addNatureza() {
  basicos.value.naturezas.push({ id: uid(), nome: '', tentadaConsumada: '' })
}
function removeNatureza(id: string) {
  basicos.value.naturezas = basicos.value.naturezas.filter((n) => n.id !== id)
}

function addUnidadeMovel() {
  basicos.value.unidadesMoveis.push({
    id: uid(), orgao: '', unidade: '', prefixoViatura: '', matricula: '', nome: '', numOcorrencia: '',
  })
}
function removeUnidadeMovel(id: string) {
  basicos.value.unidadesMoveis = basicos.value.unidadesMoveis.filter((u) => u.id !== id)
}

function addDenuncia() {
  basicos.value.denuncias.push({ id: uid(), numero: '', ano: '', orgaoGerador: '' })
}
function removeDenuncia(id: string) {
  basicos.value.denuncias = basicos.value.denuncias.filter((d) => d.id !== id)
}
</script>

<template>
  <div class="space-y-8">

    <!-- ── DADOS DA OCORRÊNCIA ─────────────────────────────────── -->
    <section class="space-y-4">
      <p class="border-b border-border pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Dados da Ocorrência
      </p>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Tipo de Ocorrência <span class="text-destructive">*</span></AppLabel>
          <AppSelect v-model="basicos.tipoOcorrencia" placeholder="Selecione">
            <option value="administrativa">Administrativa</option>
            <option value="criminal">Criminal</option>
          </AppSelect>
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Classificação <span class="text-destructive">*</span></AppLabel>
          <AppSelect v-model="basicos.classificacao" placeholder="Selecione">
            <option value="destaque">Destaque</option>
            <option value="reservada">Reservada</option>
            <option value="comum">Comum</option>
          </AppSelect>
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Unidade de Registro</AppLabel>
          <AppInput :value="basicos.unidadeRegistro" disabled class="cursor-not-allowed bg-muted/50" />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Unidade de Apuração <span class="text-destructive">*</span></AppLabel>
          <AppInput v-model="basicos.unidadeApuracao" placeholder="Informe a unidade" />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Flagrante? <span class="text-destructive">*</span></AppLabel>
          <AppSelect v-model="basicos.flagrante" placeholder="Selecione">
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </AppSelect>
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Origem da Comunicação</AppLabel>
          <AppSelect v-model="basicos.origemComunicacao" placeholder="Selecione">
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
          <AppInput type="date" v-model="basicos.dataComunicacao" />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Motivação <span class="text-destructive">*</span></AppLabel>
          <AppInput v-model="basicos.motivacao" placeholder="Ex: Patrimonial, Passional..." />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Período do Fato — Início <span class="text-destructive">*</span></AppLabel>
          <AppInput type="datetime-local" v-model="basicos.periodoInicio" />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Período do Fato — Fim <span class="text-destructive">*</span></AppLabel>
          <AppInput type="datetime-local" v-model="basicos.periodoFim" />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Relacionado a Operação Policial?</AppLabel>
          <AppSelect v-model="basicos.operacaoPolicial" placeholder="Selecione">
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </AppSelect>
        </div>

        <div v-if="basicos.operacaoPolicial === 'sim'" class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Nome da Operação</AppLabel>
          <AppInput v-model="basicos.nomeOperacao" placeholder="Informe o nome da operação" />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Relacionado a Evento?</AppLabel>
          <AppSelect v-model="basicos.evento" placeholder="Selecione">
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </AppSelect>
        </div>

        <div v-if="basicos.evento === 'sim'" class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Nome do Evento</AppLabel>
          <AppInput v-model="basicos.nomeEvento" placeholder="Informe o nome do evento" />
        </div>
      </div>
    </section>

    <!-- ── NATUREZA ────────────────────────────────────────────── -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border pb-2">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Natureza <span class="text-destructive">*</span>
        </p>
        <AppButton type="button" variant="outline" size="sm" @click="addNatureza">
          <Plus class="h-3.5 w-3.5" /> Adicionar
        </AppButton>
      </div>

      <p v-if="basicos.naturezas.length === 0" class="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
        Nenhuma natureza informada. Ao menos uma é obrigatória.
      </p>

      <div v-for="nat in basicos.naturezas" :key="nat.id" class="relative rounded-lg border bg-muted/20 p-4">
        <button
          type="button"
          @click="removeNatureza(nat.id)"
          class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Remover"
        >
          <X class="h-3.5 w-3.5" />
        </button>

        <div class="grid grid-cols-1 gap-4 pr-8 sm:grid-cols-2">
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Nome da Natureza</AppLabel>
            <AppInput v-model="nat.nome" placeholder="Ex: Furto, Roubo, Lesão Corporal..." />
          </div>
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Tentada / Consumada</AppLabel>
            <AppSelect v-model="nat.tentadaConsumada" placeholder="Selecione">
              <option value="tentada">Tentada</option>
              <option value="consumada">Consumada</option>
            </AppSelect>
          </div>
        </div>
      </div>
    </section>

    <!-- ── ENDEREÇO DO LOCAL DO FATO ───────────────────────────── -->
    <section class="space-y-4">
      <p class="border-b border-border pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Endereço do Local do Fato
      </p>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">País</AppLabel>
          <AppInput v-model="basicos.pais" placeholder="Brasil" />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Estado</AppLabel>
          <AppSelect v-model="basicos.estado" placeholder="UF">
            <option v-for="uf in ESTADOS_BR" :key="uf" :value="uf">{{ uf }}</option>
          </AppSelect>
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Cidade / RA</AppLabel>
          <AppInput v-model="basicos.cidadeRA" placeholder="Cidade ou Região Administrativa" />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Quadra</AppLabel>
          <AppInput v-model="basicos.quadra" placeholder="Ex: Quadra 3, Bloco A" />
        </div>

        <div class="space-y-1.5 sm:col-span-2">
          <AppLabel class="text-xs text-muted-foreground">Logradouro <span class="text-destructive">*</span></AppLabel>
          <AppInput v-model="basicos.logradouro" placeholder="Rua, Avenida, SQN..." />
        </div>

        <div class="space-y-1.5">
          <AppLabel class="text-xs text-muted-foreground">Via</AppLabel>
          <AppInput v-model="basicos.via" placeholder="Nº / KM / Via" />
        </div>

        <div class="space-y-1.5 sm:col-span-2">
          <AppLabel class="text-xs text-muted-foreground">Complemento</AppLabel>
          <AppInput v-model="basicos.complemento" placeholder="Apartamento, bloco, ponto de referência..." />
        </div>

        <div class="space-y-1.5 sm:col-span-3">
          <AppLabel class="text-xs text-muted-foreground">Coordenadas</AppLabel>
          <div class="flex gap-2">
            <AppInput
              v-model="basicos.coordenadas"
              placeholder="-15.7801, -47.9292"
              class="flex-1"
            />
            <AppButton
              type="button"
              variant="outline"
              size="default"
              :disabled="!basicos.coordenadas"
              @click="verNoMapa"
              class="shrink-0"
            >
              <MapPin class="h-4 w-4" /> Ver no mapa
            </AppButton>
          </div>
        </div>
      </div>
    </section>

    <!-- ── UNIDADE MÓVEL ──────────────────────────────────────── -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border pb-2">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Unidade Móvel de Atendimento à Ocorrência
        </p>
        <AppButton type="button" variant="outline" size="sm" @click="addUnidadeMovel">
          <Plus class="h-3.5 w-3.5" /> Adicionar
        </AppButton>
      </div>

      <p v-if="basicos.unidadesMoveis.length === 0" class="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
        Nenhuma unidade móvel vinculada.
      </p>

      <div v-for="um in basicos.unidadesMoveis" :key="um.id" class="relative rounded-lg border bg-muted/20 p-4">
        <button
          type="button"
          @click="removeUnidadeMovel(um.id)"
          class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Remover"
        >
          <X class="h-3.5 w-3.5" />
        </button>

        <div class="grid grid-cols-1 gap-4 pr-8 sm:grid-cols-2 md:grid-cols-3">
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Órgão</AppLabel>
            <AppInput v-model="um.orgao" placeholder="Ex: PMDF, PCDF" />
          </div>
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Unidade</AppLabel>
            <AppInput v-model="um.unidade" placeholder="Ex: 1ª CIPM" />
          </div>
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Prefixo / Viatura</AppLabel>
            <AppInput v-model="um.prefixoViatura" placeholder="Ex: Alfa-01" />
          </div>
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Matrícula</AppLabel>
            <AppInput v-model="um.matricula" placeholder="Matrícula do agente" />
          </div>
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Nome</AppLabel>
            <AppInput v-model="um.nome" placeholder="Nome do agente" />
          </div>
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Nº da Ocorrência</AppLabel>
            <AppInput v-model="um.numOcorrencia" placeholder="Nº da ocorrência do órgão" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── DENÚNCIA VINCULADA ──────────────────────────────────── -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-border pb-2">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Denúncia Vinculada
        </p>
        <AppButton type="button" variant="outline" size="sm" @click="addDenuncia">
          <Plus class="h-3.5 w-3.5" /> Adicionar
        </AppButton>
      </div>

      <p v-if="basicos.denuncias.length === 0" class="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
        Nenhuma denúncia vinculada.
      </p>

      <div v-for="den in basicos.denuncias" :key="den.id" class="relative rounded-lg border bg-muted/20 p-4">
        <button
          type="button"
          @click="removeDenuncia(den.id)"
          class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Remover"
        >
          <X class="h-3.5 w-3.5" />
        </button>

        <div class="grid grid-cols-1 gap-4 pr-8 sm:grid-cols-3">
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Número</AppLabel>
            <AppInput v-model="den.numero" placeholder="Nº da denúncia" />
          </div>
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Ano</AppLabel>
            <AppInput v-model="den.ano" placeholder="Ex: 2026" maxlength="4" />
          </div>
          <div class="space-y-1.5">
            <AppLabel class="text-xs text-muted-foreground">Órgão Gerador</AppLabel>
            <AppInput v-model="den.orgaoGerador" placeholder="Ex: Disque-Denúncia" />
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
