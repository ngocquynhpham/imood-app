'use client'

import {MOOD_LEVELS} from '@/lib/constants'
import { MoodLevel } from '@/features/mood/types'
import { cn } from '@/lib/utils'

interface MoodPickerProps {
    selectedLevel?: MoodLevel
    onSelect: (level: MoodLevel) => void        
}

export function MoodPicker({selectedLevel,onSelect}:MoodPickerProps) {
    return (
        <div className='flex gap-3'>
            {
                MOOD_LEVELS.map((mood) => ( 
                <button 
                    key={mood.level}
                    onClick={()=>{onSelect(mood.level)}}
                    className={cn(
                        'flex flex-col items-center gap-1 p-3 rounded-xl transition-all',
                        'border border-transparent hover:border-white/20',
                        selectedLevel === mood.level && 'border-white/40 scale-110'
                    )}
                >
                    <span className="text-3xl">{mood.icon}</span>
                    <span className="text-xs text-white/60">{mood.label}</span>
                </button>
            ))}
        </div>
    )
}