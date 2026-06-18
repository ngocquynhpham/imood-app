import type { MoodLevel } from '@/lib/constants'
export type { MoodLevel }

export interface MoodEntry {
    id: string
    date: string        // format: YYYY-MM-DD
    level: MoodLevel
    note?: string       // optional: ghi chú thêm
    createdAt: number   // timestamp để sort
}
export interface MoodLevelConfig {
    level: MoodLevel
    label: string
    color: string
    icon: string
  }