'use client'

import { MoodPicker } from '@/features/mood/components/MoodPicker'
import { MoodLevel } from '@/features/mood/types'
import { useState } from 'react'

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState<MoodLevel | undefined>(
    undefined
  )
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#141414]">
      <h1 className="text-2xl font-semibold text-white">
        How are you feeling today?
      </h1>
      <MoodPicker selectedLevel={selectedLevel} onSelect={setSelectedLevel} />
      {selectedLevel && (
        <p className="text-sm text-white/60">Bạn chọn level {selectedLevel}</p>
      )}
    </main>
  )
}