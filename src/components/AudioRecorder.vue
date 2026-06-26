<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Mic, Square, Trash2, FileSignature, Sparkles, Check } from 'lucide-vue-next'
import { cn, formatTime } from '@/lib/utils'
import AppButton from '@/components/ui/Button.vue'

const OCCURRENCE_PROTOCOL = 'PRT-2026-0099421'

type RecState = 'idle' | 'recording' | 'recorded'

const recState = ref<RecState>('idle')
const recSeconds = ref(0)
const audioUrl = ref<string | null>(null)
const audioProtocolado = ref(false)

const recorderRef = ref<MediaRecorder | null>(null)
const chunksRef = ref<Blob[]>([])
const tickRef = ref<number | null>(null)

const emit = defineEmits<{ autoFill: [] }>()

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mime = ['audio/webm', 'audio/mp4'].find((t) => MediaRecorder.isTypeSupported(t))
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
    chunksRef.value = []
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.value.push(e.data)
    }
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop())
      const blob = new Blob(chunksRef.value, { type: rec.mimeType })
      audioUrl.value = URL.createObjectURL(blob)
      recState.value = 'recorded'
    }
    recorderRef.value = rec
    rec.start()
    recSeconds.value = 0
    audioProtocolado.value = false
    audioUrl.value = null
    recState.value = 'recording'
    tickRef.value = window.setInterval(() => recSeconds.value++, 1000)
  } catch {
    recState.value = 'recording'
    recSeconds.value = 0
    audioProtocolado.value = false
    audioUrl.value = null
    tickRef.value = window.setInterval(() => recSeconds.value++, 1000)
  }
}

function stopRecording() {
  if (tickRef.value) {
    window.clearInterval(tickRef.value)
    tickRef.value = null
  }
  const rec = recorderRef.value
  if (rec && rec.state !== 'inactive') {
    rec.stop()
  } else {
    recState.value = 'recorded'
  }
}

function discardRecording() {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
  audioUrl.value = null
  audioProtocolado.value = false
  recState.value = 'idle'
  recSeconds.value = 0
}

onUnmounted(() => {
  if (tickRef.value) window.clearInterval(tickRef.value)
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
})
</script>

<template>
  <div class="rounded-xl border bg-card p-5 shadow-card">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div
          :class="
            cn(
              'grid h-11 w-11 place-items-center rounded-lg',
              recState === 'recording'
                ? 'animate-pulse bg-recording text-white'
                : 'bg-muted text-muted-foreground',
            )
          "
        >
          <Mic class="h-5 w-5" />
        </div>
        <div>
          <h3 class="text-sm font-semibold">Gravação do atendimento</h3>
          <p class="text-xs text-muted-foreground">
            <template v-if="recState === 'idle'">
              Grave o relato em áudio para protocolar e auto-preencher a ocorrência.
            </template>
            <template v-else-if="recState === 'recording'">
              Gravando…
              <span class="font-mono font-semibold text-recording">{{
                formatTime(recSeconds)
              }}</span>
            </template>
            <template v-else>
              Áudio capturado ({{ formatTime(recSeconds) }}) — pronto para protocolar.
            </template>
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <AppButton v-if="recState === 'idle'" @click="startRecording">
          <Mic class="h-4 w-4" /> Iniciar gravação
        </AppButton>
        <AppButton
          v-if="recState === 'recording'"
          @click="stopRecording"
          class="bg-recording text-white hover:bg-recording/90"
        >
          <Square class="h-4 w-4" /> Encerrar
        </AppButton>
        <template v-if="recState === 'recorded'">
          <AppButton variant="ghost" size="sm" @click="discardRecording">
            <Trash2 class="h-4 w-4" /> Descartar
          </AppButton>
          <AppButton
            variant="outline"
            size="sm"
            @click="audioProtocolado = true"
            :disabled="audioProtocolado"
          >
            <FileSignature class="h-4 w-4" />
            {{ audioProtocolado ? 'Áudio protocolado' : 'Protocolar áudio' }}
          </AppButton>
          <AppButton size="sm" @click="emit('autoFill')">
            <Sparkles class="h-4 w-4" /> Auto-preencher ocorrência
          </AppButton>
        </template>
      </div>
    </div>

    <audio v-if="audioUrl" :src="audioUrl" controls class="mt-4 w-full" />

    <p
      v-if="audioProtocolado"
      class="mt-3 inline-flex items-center gap-2 rounded-md bg-complete-soft px-3 py-1.5 text-xs font-medium text-complete"
    >
      <Check class="h-3.5 w-3.5" :stroke-width="3" />
      Áudio anexado ao protocolo {{ OCCURRENCE_PROTOCOL }}
    </p>
  </div>
</template>
