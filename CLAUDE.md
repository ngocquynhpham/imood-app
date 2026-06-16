# 📋 CLAUDE.md — imood.app

> File này hướng dẫn Cursor AI cách hỗ trợ development cho dự án imood.app.
> Đọc kỹ trước khi generate code, giải thích concept, hay suggest refactor.

---

## 🎯 Dự án là gì?

**imood.app** — Mood Pixel Tracker
- User log mood hàng ngày (5 cấp độ, 5 màu, 5 icon)
- Hiển thị pixel grid với filter: tuần / tháng / năm
- Chart phân tích xu hướng mood + mood insights
- Landing page đẹp + onboarding steps
- MVP: localStorage. Tương lai: Supabase (multi-user)

**Mục tiêu**: Deploy lên `imood.app` (Vercel) trong 1 tuần để apply job.
**Ưu tiên**: UI đẹp → code clean → developer hiểu được → ship được.

---

## 👩‍💻 Developer Context

**Background**: Frontend Engineer 4+ năm (React, TypeScript, SCSS, TanStack Query, Zustand, Context API).
**Đang học Next.js**: App Router, Server Components, SSR/ISR — coi như mới hoàn toàn.

**Mục tiêu học qua project này**:
- Next.js: App Router, Server vs Client Components, SSR/ISR, routing
- React: lifecycle, custom hooks, performance patterns
- State management: phân biệt rõ khi nào dùng Zustand / Context API / local state
- Git CLI: rebase, cherry-pick, stash (đang chuyển từ UI sang CLI)
- Testing: hiểu cách viết test, không chỉ copy

**Cách học tốt nhất**: giải thích concept trước → ví dụ cụ thể → tự thực hành.

---

## 🛠 Tech Stack

| Layer | Công nghệ | Ghi chú |
|---|---|---|
| Framework | Next.js 14 (App Router) | Không dùng Pages Router |
| Language | TypeScript (strict mode) | Không dùng `any` |
| UI Components | ShadCN/ui | Cài qua `npx shadcn-ui@latest add` |
| Styling | Tailwind CSS + SCSS modules | Kết hợp, không chọn 1 |
| State (global) | Zustand | Mood data, preferences |
| State (local) | React useState/useReducer | UI state, form state |
| Persistence | localStorage (MVP) → Supabase | Migrate sau khi ship |
| Charts | ECharts.js | Mood trend, weekly stats |
| Icons | Lucide React | Đã có sẵn với ShadCN |
| Deploy | Vercel + custom domain | imood.app |

---

## 📁 Folder Structure (Feature-based)

```
src/
├── app/                              # Next.js App Router (routing layer)
│   ├── (landing)/                    # Route group: landing page
│   │   └── page.tsx                  # imood.app/
│   ├── (app)/                        # Route group: main app
│   │   ├── dashboard/
│   │   │   └── page.tsx              # imood.app/dashboard
│   │   ├── history/
│   │   │   └── page.tsx
│   │   └── layout.tsx                # App shell layout
│   ├── layout.tsx                    # Root layout
│   └── globals.css
│
├── features/                         # ⭐ TRUNG TÂM của app
│   ├── mood/                         # Tính năng log mood
│   │   ├── components/
│   │   │   ├── MoodPicker.tsx        # Chọn mood hôm nay
│   │   │   ├── MoodCard.tsx          # Hiển thị 1 mood entry
│   │   │   └── TodayMoodBanner.tsx
│   │   ├── hooks/
│   │   │   ├── useMoodData.ts        # CRUD mood entries
│   │   │   └── useTodayMood.ts       # Mood hôm nay
│   │   ├── store/
│   │   │   └── moodStore.ts          # Zustand store
│   │   ├── types/
│   │   │   └── index.ts              # MoodEntry, MoodLevel, ...
│   │   └── utils/
│   │       └── moodHelpers.ts        # Format, calculate, ...
│   │
│   ├── pixel-grid/                   # Pixel grid visualization
│   │   ├── components/
│   │   │   ├── PixelGrid.tsx         # Grid chính
│   │   │   ├── PixelCell.tsx         # 1 ô pixel
│   │   │   └── GridFilter.tsx        # Filter tuần/tháng/năm
│   │   ├── hooks/
│   │   │   └── useGridData.ts        # Transform mood data → grid
│   │   └── utils/
│   │       └── gridHelpers.ts
│   │
│   ├── charts/                       # Chart & insights
│   │   ├── components/
│   │   │   ├── MoodTrendChart.tsx    # ECharts line chart
│   │   │   ├── WeeklyBarChart.tsx
│   │   │   └── MoodInsights.tsx      # Streak, phổ biến nhất, ...
│   │   └── hooks/
│   │       └── useChartData.ts
│   │
│   └── onboarding/                   # Onboarding flow
│       ├── components/
│       │   ├── OnboardingModal.tsx
│       │   └── OnboardingStep.tsx
│       └── steps/
│           ├── WelcomeStep.tsx
│           ├── MoodScaleStep.tsx
│           └── FirstMoodStep.tsx
│
├── components/                       # Shared UI (dùng ở nhiều feature)
│   ├── ui/                           # ShadCN components (auto-generated, không sửa)
│   └── layout/
│       ├── Header.tsx
│       └── AppShell.tsx
│
├── lib/                              # Utilities & configs
│   ├── storage.ts                    # localStorage wrapper có type-safe
│   ├── constants.ts                  # MOOD_LEVELS, COLORS, ...
│   └── utils.ts                      # cn(), formatDate(), ...
│
├── hooks/                            # Global custom hooks
│   └── useLocalStorage.ts
│
├── styles/                           # Global SCSS
│   ├── globals.scss
│   └── _variables.scss               # SCSS variables, mixins
│
└── types/                            # Global TypeScript types
    └── index.ts
```

---

## 🎨 Code Style

### TypeScript — Strict Mode

```typescript
// ✅ ĐÚNG: type rõ ràng
interface MoodEntry {
  id: string
  date: string          // format: YYYY-MM-DD
  level: MoodLevel
  note?: string
  createdAt: number     // timestamp
}

type MoodLevel = 1 | 2 | 3 | 4 | 5

// ✅ ĐÚNG: type props đầy đủ
interface MoodPickerProps {
  onSelect: (level: MoodLevel) => void
  selectedLevel?: MoodLevel
  disabled?: boolean
}

// ❌ SAI: dùng any
const entry: any = { ... }
function handleClick(e: any) { ... }
```

### CSS — Tailwind + SCSS kết hợp

```tsx
// ✅ ĐÚNG: Tailwind cho layout/spacing, SCSS cho animation/phức tạp
import styles from './MoodPicker.module.scss'
import { cn } from '@/lib/utils'

<div className={cn(
  'flex gap-2 p-4 rounded-lg',           // Tailwind: layout
  isActive && 'ring-2 ring-primary',      // Tailwind: conditional
  styles.moodContainer                    // SCSS: animation, complex
)}>

// SCSS module dùng cho:
// - Keyframe animations
// - Complex pseudo-selectors
// - Pixel-specific styles
// - Hover effects phức tạp
```

### Naming Convention

| Loại | Convention | Ví dụ |
|---|---|---|
| Component | PascalCase | `MoodPicker.tsx` |
| Hook | camelCase + `use` prefix | `useMoodData.ts` |
| Store | camelCase + `Store` suffix | `moodStore.ts` |
| Utils | camelCase | `formatDate.ts` |
| Constants | UPPER_SNAKE_CASE | `MOOD_LEVELS` |
| SCSS class | camelCase | `.moodContainer` |
| Type/Interface | PascalCase | `MoodEntry`, `MoodLevel` |

---

## 🧠 State Management — Khi nào dùng gì?

> Developer đang học state management. **Luôn giải thích lý do** khi chọn approach.

### Phân cấp rõ ràng:

```
useState / useReducer
  └─ State chỉ 1 component cần (modal open, input value, loading)

Custom Hook (useXxx)
  └─ Logic tái sử dụng giữa nhiều components (không cần share state)

Zustand Store
  └─ State cần share giữa nhiều features, thay đổi thường xuyên

Context API
  └─ Config ít thay đổi (theme, language) — KHÔNG dùng cho mood data

localStorage
  └─ Persistence qua session (sync với Zustand)
```

### Mapping cụ thể trong imood.app:

| State | Dùng gì | Lý do |
|---|---|---|
| Tất cả mood entries | Zustand + localStorage | Global + persistent |
| Mood hôm nay | Zustand (derive từ entries) | Nhiều component cần |
| Filter đang chọn | useState (hoặc URL params) | Chỉ pixel-grid cần |
| Modal onboarding mở | useState | Local UI state |
| Onboarding đã xem chưa | localStorage trực tiếp | One-time flag |
| Theme (dark/light) | next-themes (hoặc Zustand) | Global |

### Template Zustand Store:

```typescript
// features/mood/store/moodStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tại sao dùng `persist` middleware?
// → Tự động sync Zustand state với localStorage
// → Không cần tự viết load/save logic
interface MoodStore {
  entries: MoodEntry[]
  addEntry: (entry: Omit<MoodEntry, 'id' | 'createdAt'>) => void
  removeEntry: (id: string) => void
}

export const useMoodStore = create<MoodStore>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (data) => set((state) => ({
        entries: [...state.entries, {
          ...data,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        }]
      })),
      removeEntry: (id) => set((state) => ({
        entries: state.entries.filter(e => e.id !== id)
      })),
    }),
    { name: 'imood-entries' } // key trong localStorage
  )
)
```

---

## 🤖 Hướng dẫn Cursor — Cách làm việc

### LUÔN làm khi generate code:

1. **Comments bằng tiếng Việt** — mọi function, mọi đoạn logic quan trọng
2. **Giải thích WHY** — tại sao chọn approach này, không phải chỉ WHAT
3. **Inline comments** ở logic phức tạp, pattern lạ với developer
4. **Hiển thị trade-offs** khi có nhiều cách làm (xem format bên dưới)

### Format khi có nhiều cách làm:

```
Có 2 cách tiếp cận:

**Option A: [tên]**
→ Cách làm: [mô tả ngắn]
✅ Ưu điểm: ...
❌ Nhược điểm: ...

**Option B: [tên]**
→ Cách làm: [mô tả ngắn]
✅ Ưu điểm: ...
❌ Nhược điểm: ...

👉 Recommend: Option [X] vì [lý do cụ thể với context imood.app]
```

### Trước khi refactor lớn — BẮT BUỘC hỏi:

```
Mình đang muốn refactor [tên phần]:
- Thay đổi: [mô tả]
- Lý do: [tại sao cần]
- Impact: [file/component nào bị ảnh hưởng]
- Breaking changes: [có không]

Bạn muốn mình proceed không?
```

### Khi giải thích concept mới (Next.js, React pattern):

1. Giải thích concept bằng ngôn ngữ đơn giản
2. Dùng analogy nếu được
3. Ví dụ code cụ thể trong context imood.app
4. Chỉ ra điểm dễ nhầm / common mistakes
5. Đặt câu hỏi kiểm tra hiểu ("Bạn thử đoán xem kết quả là gì?")

### Comment style mẫu:

```typescript
/**
 * Hook quản lý toàn bộ mood data của user
 *
 * Tại sao dùng Zustand thay vì Context API?
 * → Context re-render toàn bộ component tree khi state thay đổi
 * → Zustand chỉ re-render component đang subscribe đúng slice cần thiết
 * → Với mood data thay đổi thường xuyên → Zustand performance tốt hơn
 */
export function useMoodData() {
  // Lấy state và actions từ Zustand store
  const { entries, addEntry, removeEntry } = useMoodStore()

  // Tính toán xem hôm nay đã log chưa
  // dùng useMemo để tránh tính lại mỗi lần render
  const todayEntry = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return entries.find(e => e.date === today)
  }, [entries])

  return { entries, todayEntry, addEntry, removeEntry }
}
```

---

## 🧪 Testing

> Developer đang học testing. **Giải thích TRƯỚC KHI viết test**.

### Nguyên tắc:
- Giải thích: test này test cái gì, tại sao cần test cái này
- Test **behavior** (kết quả), không test **implementation** (cách làm)
- Ưu tiên test: utils → custom hooks → components

### Template chuẩn:

```typescript
// ✅ ĐÚNG: Test behavior
describe('useMoodData', () => {
  it('nên thêm mood entry và lưu vào localStorage', () => {
    // Arrange: setup initial state
    const { result } = renderHook(() => useMoodData())

    // Act: thực hiện action
    act(() => {
      result.current.addEntry({ date: '2024-01-15', level: 4 })
    })

    // Assert: kiểm tra kết quả
    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].level).toBe(4)
  })
})

// ❌ SAI: Test implementation
it('nên gọi localStorage.setItem', () => { ... })
```

---

## 🌿 Git Workflow

> Developer đang học Git CLI. **Giải thích ngắn mỗi khi suggest command**.

### Branch naming:

```
feature/mood-picker
feature/pixel-grid
feature/onboarding-flow
fix/mood-date-timezone
chore/setup-shadcn
refactor/extract-mood-hooks
```

### Commit convention (Conventional Commits):

```
feat: thêm MoodPicker component
fix: sửa lỗi tính ngày sai timezone
refactor: tách useMoodData ra khỏi MoodPicker
style: cập nhật màu sắc mood palette
chore: cài đặt shadcn button component
docs: thêm JSDoc cho useMoodData
```

### Giải thích commands khi suggest:

```bash
# Ví dụ cách Cursor nên present Git commands:

git rebase main
# → Đặt lại "gốc" của branch lên commit mới nhất của main
# → Kết quả: history sạch hơn merge (không có merge commit thừa)
# → Dùng khi: muốn update branch với code mới nhất từ main

git stash
# → Tạm "cất" code đang làm dở vào ngăn kéo
# → Dùng khi: cần chuyển branch gấp nhưng chưa muốn commit

git cherry-pick <commit-hash>
# → Copy đúng 1 commit từ branch khác sang branch hiện tại
# → Dùng khi: chỉ muốn lấy 1 thay đổi cụ thể, không muốn merge cả branch
```

---

## 🎨 Mood Config — Constants

```typescript
// lib/constants.ts

export const MOOD_LEVELS = [
  { level: 1, label: 'Rất tệ',     color: '#FF6B6B', icon: '😞', bgClass: 'bg-red-400' },
  { level: 2, label: 'Không tốt',  color: '#FFB347', icon: '😕', bgClass: 'bg-orange-400' },
  { level: 3, label: 'Bình thường',color: '#FFD700', icon: '😐', bgClass: 'bg-yellow-400' },
  { level: 4, label: 'Tốt',        color: '#90EE90', icon: '🙂', bgClass: 'bg-green-300' },
  { level: 5, label: 'Tuyệt vời',  color: '#4CAF50', icon: '😄', bgClass: 'bg-green-500' },
] as const

export type MoodLevel = typeof MOOD_LEVELS[number]['level'] // 1 | 2 | 3 | 4 | 5

// Màu cho pixel grid (dựa trên mood level)
export const MOOD_COLORS: Record<MoodLevel, string> = {
  1: '#FF6B6B',
  2: '#FFB347',
  3: '#FFD700',
  4: '#90EE90',
  5: '#4CAF50',
}

// Màu khi chưa có data
export const EMPTY_PIXEL_COLOR = '#2A2A2A'
```

---

## 📋 Features MVP — Checklist

### Phase 1 (Tuần 1 — Apply Job)
- [ ] Setup Next.js 14 + ShadCN + Tailwind + SCSS
- [ ] Design tokens: màu sắc, typography (dark/minimalist theme)
- [ ] Landing page (hero, features, CTA)
- [ ] Onboarding flow (3 steps: welcome → mood scale → log first mood)
- [ ] Log mood hôm nay (1 lần/ngày, có thể update)
- [ ] Pixel grid với filter tuần/tháng/năm
- [ ] Mood history list
- [ ] Chart: mood trend theo tuần
- [ ] Mood insights: streak, mood phổ biến nhất
- [ ] Responsive (mobile-first)
- [ ] SEO + og:image
- [ ] Deploy: imood.app trên Vercel

### Phase 2 (Sau khi apply)
- [ ] Migrate sang Supabase (multi-user)
- [ ] Auth (email hoặc Google)
- [ ] Share mood grid (public URL)
- [ ] Export pixel grid thành ảnh
- [ ] Thêm note/journal cho mỗi mood entry

---

## ⚠️ Những điều KHÔNG làm

- ❌ Không dùng `any` trong TypeScript — hỏi nếu không biết type
- ❌ Không hard-code màu sắc inline — dùng `MOOD_COLORS` constants
- ❌ Không trộn tiếng Anh/Việt trong comments — dùng tiếng Việt
- ❌ Không refactor lớn mà không hỏi trước
- ❌ Không skip giải thích khi generate pattern mới với developer
- ❌ Không dùng `useEffect` để fetch data (dùng Server Components hoặc TanStack Query)
- ❌ Không để business logic trong component — tách ra hooks/utils

---

## 🔗 Links

- **Domain**: imood.app
- **Repo**: (sẽ cập nhật)
- **Design ref**: Dark/Minimalist, Pixel aesthetic
- **Inspiration**: GitHub contribution graph + mood tracking apps
