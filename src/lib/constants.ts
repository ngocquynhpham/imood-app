export const MOOD_LEVELS = [
    { level: 1, label: 'Rất tệ',      color: '#FF6B6B', icon: '😞' },
    { level: 2, label: 'Không tốt',   color: '#FFB347', icon: '😕' },
    { level: 3, label: 'Bình thường', color: '#FFD700', icon: '😐' },
    { level: 4, label: 'Tốt',         color: '#90EE90', icon: '🙂' },
    { level: 5, label: 'Tuyệt vời',   color: '#4CAF50', icon: '😄' },
] as const

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

// Mapping mood level → color (dùng cho pixel grid)
export const MOOD_COLORS: Record<MoodLevel, string> = {
    1: '#FF6B6B',
    2: '#FFB347',
    3: '#FFD700',
    4: '#90EE90',
    5: '#4CAF50',
} as const

// Màu ô pixel chưa có data
export const EMPTY_PIXEL_COLOR = '#2A2A2A';