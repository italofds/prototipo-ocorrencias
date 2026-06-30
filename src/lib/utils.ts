import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { FormState, Status, StepId } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function stepProgress(id: StepId, data: FormState): number {
  if (id === 'basicos') {
    const b = data.basicos
    const required = [
      b.tipoOcorrencia, b.classificacao, b.unidadeApuracao,
      b.flagrante, b.periodoInicio, b.periodoFim, b.motivacao, b.logradouro,
    ]
    const filled = required.filter((v) => v.trim().length > 0).length
    const naturezaOk = b.naturezas.length > 0 && b.naturezas.every((n) => n.nome.trim().length > 0) ? 1 : 0
    return (filled + naturezaOk) / (required.length + 1)
  }
  if (id === 'pessoas') {
    if (data.pessoas.length === 0) return 0
    const total = data.pessoas.length * 3
    const filled = data.pessoas.reduce(
      (acc, p) => acc + [p.nome, p.tipo, p.documento].filter((v) => v.trim().length > 0).length,
      0,
    )
    return filled / total
  }
  if (id === 'objetos') {
    if (data.objetos.length === 0) return 0
    const total = data.objetos.length * 2
    const filled = data.objetos.reduce(
      (acc, o) => acc + [o.categoria, o.descricao].filter((v) => v.trim().length > 0).length,
      0,
    )
    return filled / total
  }
  if (id === 'historico') {
    return data.historico.trim().length >= 30 ? 1 : data.historico.trim().length > 0 ? 0.5 : 0
  }
  return data.anexos.length > 0 ? 1 : 0
}

export function statusFromProgress(p: number): Status {
  if (p === 0) return 'pending'
  if (p >= 1) return 'complete'
  return 'partial'
}

export function initials(nome: string): string {
  return nome
    .split(' ')
    .slice(-2)
    .map((n) => n[0])
    .join('')
}
