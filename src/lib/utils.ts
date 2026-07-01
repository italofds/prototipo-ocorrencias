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

export function nowDateTimeLocal(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function stepProgress(id: StepId, data: FormState): number {
  if (id === 'basics') {
    const b = data.basics
    const required = [
      b.occurrenceType, b.classification, b.investigationUnit,
      b.inFlagrante, b.periodStart, b.periodEnd, b.street,
    ]
    if (b.occurrenceType === 'criminal') required.push(b.motivation)
    const filled = required.filter((v) => v.trim().length > 0).length
    const natureOk = b.natures.length > 0 && b.natures.every((n) => n.name.trim().length > 0) ? 1 : 0
    return (filled + natureOk) / (required.length + 1)
  }
  if (id === 'people') {
    if (data.people.length === 0) return 0
    const total = data.people.length * 3
    const filled = data.people.reduce(
      (acc, p) => acc + [p.name, p.type, p.document].filter((v) => v.trim().length > 0).length,
      0,
    )
    return filled / total
  }
  if (id === 'items') {
    if (data.items.length === 0) return 0
    const total = data.items.length * 2
    const filled = data.items.reduce(
      (acc, o) => acc + [o.category, o.description].filter((v) => v.trim().length > 0).length,
      0,
    )
    return filled / total
  }
  if (id === 'history') {
    return data.history.trim().length >= 30 ? 1 : data.history.trim().length > 0 ? 0.5 : 0
  }
  return data.attachments.length > 0 ? 1 : 0
}

export function statusFromProgress(p: number): Status {
  if (p === 0) return 'pending'
  if (p >= 1) return 'complete'
  return 'partial'
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(-2)
    .map((n) => n[0])
    .join('')
}
