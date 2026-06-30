<script setup lang="ts">
import { ref } from 'vue'
import { FilePlus2, Search, Zap, FileEdit, XCircle, X, LogOut } from 'lucide-vue-next'
import { cn, initials } from '@/lib/utils'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const activeMenu = ref('registrar')

const menuItems = [
  { id: 'pesquisar', label: 'Pesquisar', icon: Search },
  { id: 'abrir-rapido', label: 'Abrir Rápido', icon: Zap },
  { id: 'registrar', label: 'Registrar', icon: FilePlus2 },
  { id: 'aditamento', label: 'Aditar', icon: FileEdit },
  { id: 'excluir', label: 'Excluir', icon: XCircle },
]

const userInfo = {
  nome: 'Agt. Ítalo Santos',
  matricula: 'Matrícula 230.730-8',
  unidade: 'DGI',
}
</script>

<template>
  <!-- Backdrop (mobile only) -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="emit('close')"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="cn(
      'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
      'transition-transform duration-300 ease-in-out',
      'lg:w-64',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    )"
  >
    <div class="flex h-full flex-col">
      <div class="border-b border-sidebar-border/60 px-4 py-5">
        <div class="flex items-center gap-3">
          <div
            class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground"
          >
            {{ initials(userInfo.nome) }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ userInfo.nome }}</p>
            <p class="truncate text-xs text-sidebar-foreground/70">{{ userInfo.matricula }}</p>
            <p class="truncate text-xs text-sidebar-foreground/70">{{ userInfo.unidade }}</p>
          </div>
          <!-- Close button (mobile only) -->
          <button
            type="button"
            @click="emit('close')"
            class="grid h-8 w-8 shrink-0 place-items-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground lg:hidden"
            aria-label="Fechar menu"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto p-3">
        <p
          class="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60"
        >
          Ocorrências
        </p>
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.id">
            <button
              type="button"
              @click="activeMenu = item.id"
              :class="
                cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  activeMenu === item.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                )
              "
            >
              <component :is="item.icon" class="h-4 w-4 shrink-0" />
              <span class="truncate">{{ item.label }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <div class="border-t border-sidebar-border/60 p-3">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut class="h-4 w-4 shrink-0" />
          <span class="truncate">Sair</span>
        </button>
      </div>
    </div>
  </aside>
</template>
