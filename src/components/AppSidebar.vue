<script setup lang="ts">
import { ref } from 'vue'
import { FilePlus2, Search, Zap, FileEdit, XCircle } from 'lucide-vue-next'
import { cn, initials } from '@/lib/utils'

const activeMenu = ref('registrar')

const menuItems = [
  { id: 'registrar', label: 'Registrar', icon: FilePlus2 },
  { id: 'pesquisar', label: 'Pesquisar', icon: Search },
  { id: 'abrir-rapido', label: 'Abrir Rápido', icon: Zap },
  { id: 'aditamento', label: 'Incluir Aditamento', icon: FileEdit },
  { id: 'excluir', label: 'Excluir', icon: XCircle },
]

const userInfo = {
  nome: 'Inv. Carla Mendes',
  matricula: 'Matrícula 24.815-7',
  unidade: '1ª DP — Centro',
}
</script>

<template>
  <aside
    class="border-b bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r"
  >
    <div class="flex h-full flex-col">
      <div class="border-b border-sidebar-border/60 px-4 py-5">
        <div class="flex items-center gap-3">
          <div
            class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground"
          >
            {{ initials(userInfo.nome) }}
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold">{{ userInfo.nome }}</p>
            <p class="truncate text-xs text-sidebar-foreground/70">{{ userInfo.matricula }}</p>
            <p class="truncate text-xs text-sidebar-foreground/70">{{ userInfo.unidade }}</p>
          </div>
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
    </div>
  </aside>
</template>
