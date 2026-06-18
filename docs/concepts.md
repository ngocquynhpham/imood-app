# 📚 Concepts — Những khái niệm cần nắm

> File này ghi lại những khái niệm mình chưa rõ trong quá trình làm dự án.
> Mỗi khi học được cái mới → thêm vào đây để đọc lại.

---

## Mục lục

- [1. State Management](#1-state-management)
- [2. Folder Structure: Feature-based vs Type-based](#2-folder-structure-feature-based-vs-type-based)
- [3. Zustand vs Context API](#3-zustand-vs-context-api)
- [4. npx vs npm](#4-npx-vs-npm)
- [5. dependencies vs devDependencies](#5-dependencies-vs-devdependencies)
- [6. Vulnerabilities (lỗ hổng bảo mật)](#6-vulnerabilities-lỗ-hổng-bảo-mật)
- [7. export và các cách viết](#7-export-và-các-cách-viết)
- [8. as const](#8-as-const)
- [9. UPPER_SNAKE_CASE](#9-upper_snake_case)
- [10. Record\<K, V\> và Mapped Type](#10-recordk-v-và-mapped-type)
- [11. TypeScript Utility Types](#11-typescript-utility-types)
- [12. type vs interface](#12-type-vs-interface)

---

## 1. State Management

**Học ngày**: 2026-05-24

### Khái niệm đơn giản

> State management = "Dữ liệu của app lưu ở đâu, và ai được đọc/ghi?"

Mỗi app đều có dữ liệu cần quản lý: user đang chọn mood gì, danh sách mood đã log, modal có đang mở không... Câu hỏi là: **lưu chúng ở đâu?**

### 4 tầng lưu trữ trong React

```
useState / useReducer
  └─ Dữ liệu chỉ 1 component tự dùng
  └─ Ví dụ: input đang gõ, dropdown có mở không
  └─ Khi component unmount → state mất

Custom Hook
  └─ Logic tái sử dụng, nhưng mỗi component vẫn có state riêng
  └─ Ví dụ: useMoodData() dùng ở cả MoodPicker lẫn HistoryList

Context API / Zustand (Global State)
  └─ Dữ liệu nhiều component cần dùng chung
  └─ Ví dụ: danh sách mood entries, theme dark/light
  └─ Component ở bất kỳ đâu trong app đều đọc được

localStorage / sessionStorage
  └─ Lưu vào trình duyệt, tồn tại khi tắt tab/reload
  └─ Ví dụ: mood entries của user, đã xem onboarding chưa
  └─ Thường kết hợp với Zustand để vừa global vừa persistent
```

### Analogy dễ nhớ

Hãy nghĩ như một căn nhà:
- `useState` = ngăn kéo trong phòng riêng (chỉ mình biết)
- `Context/Zustand` = tủ lạnh trong bếp (cả nhà dùng chung)
- `localStorage` = két sắt (lưu lâu dài, không mất khi tắt điện)

### Khi nào dùng cái gì (trong imood.app)

| Dữ liệu | Dùng gì | Lý do |
|---|---|---|
| Input đang gõ note | `useState` | Chỉ MoodPicker cần |
| Modal onboarding mở | `useState` | Chỉ 1 component điều khiển |
| Danh sách mood entries | `Zustand + localStorage` | Nhiều nơi cần + cần lưu lâu |
| Filter tuần/tháng/năm | `useState` hoặc URL | Chỉ pixel-grid cần |
| Onboarding đã xem chưa | `localStorage` trực tiếp | One-time flag đơn giản |

### Common Mistakes

- ❌ Đưa tất cả lên global state → app phức tạp không cần thiết
- ❌ Chỉ dùng useState nhưng không lift state lên → prop drilling
- ❌ Quên sync Zustand với localStorage → data mất khi reload

---

## 2. Folder Structure: Feature-based vs Type-based

**Học ngày**: 2026-05-24

### Type-based — Tổ chức theo "loại file"

```
src/
├── components/
│   ├── Button.tsx
│   ├── MoodPicker.tsx
│   └── PixelGrid.tsx
├── hooks/
│   ├── useMoodData.ts
│   └── usePixelGrid.ts
├── utils/
│   ├── moodHelpers.ts
│   └── dateHelpers.ts
└── types/
    └── index.ts
```

**Khi nào dùng**: App nhỏ, ít tính năng, team mới làm quen React.

✅ Đơn giản, dễ bắt đầu
❌ Khi app lớn: tìm file liên quan phải nhảy qua nhiều folder

---

### Feature-based — Tổ chức theo "tính năng"

```
src/
├── features/
│   ├── mood/
│   │   ├── components/MoodPicker.tsx
│   │   ├── hooks/useMoodData.ts
│   │   ├── store/moodStore.ts
│   │   └── types/index.ts
│   └── pixel-grid/
│       ├── components/PixelGrid.tsx
│       ├── hooks/useGridData.ts
│       └── utils/gridHelpers.ts
└── components/          # Shared components dùng ở nhiều feature
    └── ui/
```

**Khi nào dùng**: App có nhiều tính năng riêng biệt, team lớn, dự án dài hạn.

✅ Mọi thứ liên quan đến 1 feature nằm cùng chỗ → dễ tìm, dễ xóa
✅ Mỗi feature như 1 "module" độc lập
❌ Cần suy nghĩ: cái này là shared hay feature-specific?

---

### Analogy dễ nhớ

Hãy nghĩ như sắp xếp quần áo:

- **Type-based** = Tủ chia ngăn theo loại: ngăn áo, ngăn quần, ngăn phụ kiện
- **Feature-based** = Chia theo outfit: bộ đi làm, bộ đi chơi, bộ ở nhà — mỗi bộ có đủ áo + quần + phụ kiện

→ imood.app dùng **feature-based** vì dễ mở rộng thêm tính năng mới.

---

## 3. Zustand vs Context API

**Học ngày**: 2026-05-24

### Cả 2 đều làm gì?

Cả 2 đều giải quyết bài toán: **chia sẻ state giữa nhiều component** mà không cần truyền props qua từng tầng (prop drilling).

### Context API — Built-in React

```tsx
// Tạo context
const MoodContext = createContext(null)

// Provider bọc ngoài
function App() {
  const [entries, setEntries] = useState([])
  return (
    <MoodContext.Provider value={{ entries, setEntries }}>
      <Dashboard />
    </MoodContext.Provider>
  )
}

// Component con dùng
function MoodPicker() {
  const { entries } = useContext(MoodContext)
}
```

**Vấn đề lớn**: Khi `entries` thay đổi → **tất cả** component dùng Context đó đều re-render, dù chúng không dùng `entries`.

---

### Zustand — External Library

```tsx
// Tạo store
const useMoodStore = create((set) => ({
  entries: [],
  addEntry: (entry) => set((state) => ({
    entries: [...state.entries, entry]
  }))
}))

// Component dùng — chỉ subscribe vào cái mình cần
function MoodPicker() {
  // Chỉ re-render khi entries thay đổi
  const entries = useMoodStore((state) => state.entries)
}

function AddButton() {
  // Chỉ re-render khi addEntry thay đổi (gần như không bao giờ)
  const addEntry = useMoodStore((state) => state.addEntry)
}
```

**Ưu điểm**: Chỉ re-render component đang dùng **đúng phần state** thay đổi.

---

### So sánh trực tiếp

| Tiêu chí | Context API | Zustand |
|---|---|---|
| Cài đặt | Built-in, không cần cài | `npm install zustand` |
| Boilerplate | Nhiều (Provider, createContext) | Ít, gọn hơn |
| Re-render | Toàn bộ subscribers | Chỉ component cần |
| DevTools | Không có sẵn | Có (zustand/middleware) |
| Persist localStorage | Tự làm | Middleware sẵn có |
| Async actions | Tự handle | Đơn giản hơn |

### Khi nào dùng cái nào

**Dùng Context API khi**:
- State ít thay đổi (theme, ngôn ngữ, user info sau khi login)
- Muốn không thêm dependency
- App nhỏ, đơn giản

**Dùng Zustand khi**:
- State thay đổi thường xuyên (mood entries, filter, UI state phức tạp)
- Cần performance tốt
- Cần persist localStorage dễ dàng
- Cần DevTools debug

→ **imood.app dùng Zustand** cho mood data vì thay đổi thường xuyên và cần persist.

### Analogy dễ nhớ

- **Context API** = Loa phát thanh trong xóm: mỗi khi có thông báo → cả xóm đều nghe dù chỉ 1 người cần.
- **Zustand** = Tin nhắn nhóm có filter: chỉ người được tag mới nhận notification.

---

## 4. npx vs npm

**Học ngày**: 2026-05-24
**Nguồn**: Tự học qua project imood.app

### Khái niệm đơn giản

- **npm** = Node Package Manager → dùng để **cài đặt** package
- **npx** = Node Package Execute → dùng để **chạy** package mà không cần cài vào máy

### Chi tiết / Ví dụ

```bash
# npm: cài package vào project (nằm trong node_modules)
npm install zustand
npm install -g create-next-app   # cài global vào máy

# npx: tải về, chạy 1 lần, xong xóa — không để lại gì
npx create-next-app@latest imood-app
npx shadcn-ui@latest init
```

Khi chạy `npx create-next-app@latest`:
1. npx kiểm tra máy có `create-next-app` chưa
2. Nếu chưa → tải version mới nhất về
3. Chạy lệnh khởi tạo project
4. Xong → không giữ lại trên máy

### Analogy dễ nhớ

- `npm install` = **mua** cái máy về để ở nhà, dùng mãi
- `npx` = **thuê** máy xài 1 lần xong trả lại

### Khi nào dùng cái nào

**Dùng npm khi**:
- Cài package vào project để dùng trong code (`zustand`, `echarts`, ...)
- Cài tool dùng thường xuyên trong project (`eslint`, `typescript`, ...)

**Dùng npx khi**:
- Chạy tool khởi tạo 1 lần (`create-next-app`, `shadcn`, ...)
- Muốn luôn dùng version mới nhất mà không cần update thủ công
- Không muốn "rác" trên máy

### Common Mistakes

- ❌ `npm install -g create-next-app` → cài global, sau này bị outdated, quên update
- ✅ `npx create-next-app@latest` → luôn dùng version mới nhất, không rác máy

---

## 5. dependencies vs devDependencies

**Học ngày**: 2026-06-16
**Nguồn**: Tự học qua project imood-app

### Khái niệm đơn giản

Khi cài package, npm chia làm 2 loại:

- **dependencies** → package app **cần khi chạy thật** (production)
- **devDependencies** → package **chỉ cần khi đang làm** (development)

### Chi tiết / Ví dụ

```json
// package.json
{
  "dependencies": {
    "next": "^14.0.0",      // app cần next để chạy
    "react": "^18.0.0",     // app cần react để chạy
    "zustand": "^4.0.0"     // app cần zustand để chạy
  },
  "devDependencies": {
    "prettier": "^3.0.0",           // chỉ dùng lúc dev để format code
    "eslint": "^8.0.0",             // chỉ dùng lúc dev để lint code
    "typescript": "^5.0.0"          // chỉ dùng lúc dev để check types
  }
}
```

Cách cài:
```bash
npm install zustand          # vào dependencies
npm install -D prettier      # vào devDependencies (-D = --save-dev)
```

### Analogy dễ nhớ

Hình dung như xây nhà:
- `dependencies` = gạch, xi măng, sơn — cần để ngôi nhà tồn tại
- `devDependencies` = máy trộn bê tông, giàn giáo — chỉ cần lúc xây, xong thì bỏ

### Khi nào dùng cái nào

**Dùng dependencies khi**: package được import trong code chạy thật (component, hook, util)

**Dùng devDependencies (-D) khi**:
- Tool format/lint code: prettier, eslint
- Type checking: typescript, @types/...
- Testing: jest, vitest
- Build tools: không cần thiết ở production

### Common Mistakes

- ❌ Cài tất cả vào `dependencies` → bundle to hơn cần thiết khi deploy
- ❌ Cài package runtime vào `devDependencies` → app lỗi trên production

---

## 6. Vulnerabilities (lỗ hổng bảo mật)

**Học ngày**: 2026-06-16
**Nguồn**: Tự học qua project imood-app

### Khái niệm đơn giản

**Vulnerability** = lỗ hổng bảo mật trong một package — có thể bị hacker lợi dụng.

### Chi tiết / Ví dụ

Khi chạy `npm install`, npm tự động scan và báo cáo:

```
2 moderate severity vulnerabilities
```

Có 4 mức độ:

| Mức | Ý nghĩa | Cần làm gì? |
|---|---|---|
| `low` | Ít nguy hiểm | Bỏ qua được |
| `moderate` | Trung bình | Xem xét, không urgent |
| `high` | Nguy hiểm | Nên fix sớm |
| `critical` | Rất nguy hiểm | Fix ngay lập tức |

### Khi nào cần lo, khi nào không?

**Không cần lo** khi:
- Mức `low` hoặc `moderate`
- Nằm trong `devDependencies` (chỉ chạy lúc dev, không lên production)
- Ví dụ: lỗ hổng trong `prettier` → user không bao giờ đụng vào prettier

**Cần lo** khi:
- Mức `high` hoặc `critical`
- Nằm trong `dependencies` (chạy thật trên production)
- Ví dụ: lỗ hổng trong `next` hoặc `react`

### Cách xử lý đúng

```bash
# Xem chi tiết lỗ hổng
npm audit

# Fix tự động (an toàn, không breaking changes)
npm audit fix

# KHÔNG dùng cái này trừ khi biết mình đang làm gì
npm audit fix --force   # ← có thể break project vì force update major version
```

### Common Mistakes

- ❌ Chạy `npm audit fix --force` ngay khi thấy warning → có thể break project
- ❌ Lo lắng quá với `moderate` trong `devDependencies` → không cần thiết
- ✅ Chỉ cần lo khi `high`/`critical` trong `dependencies`

---

## 7. export và các cách viết

**Học ngày**: 2026-06-17
**Nguồn**: Tự học qua project imood-app

### Khái niệm đơn giản

Mặc định mọi file TypeScript đóng kín — file khác không đọc được. `export` = mở cửa cho file khác vào lấy.

### Chi tiết / Ví dụ

```ts
// Cách 1: export khi khai báo (phổ biến nhất)
export const MOOD_LEVELS = [...]
export type MoodLevel = 1 | 2 | 3 | 4 | 5

// Cách 2: export ở cuối file
const MOOD_LEVELS = [...]
export { MOOD_LEVELS }

// Cách 3: export default (chỉ 1 lần per file, không cần đặt tên khi import)
export default MOOD_LEVELS

// Cách 4: export nhiều thứ cuối file
export { MOOD_LEVELS, MOOD_COLORS }
```

Import tương ứng:
```ts
// Từ named export (cách 1, 2, 4)
import { MOOD_LEVELS, MOOD_COLORS } from '@/lib/constants'

// Từ default export (cách 3)
import MOOD_LEVELS from '@/lib/constants'  // tên tự đặt tùy ý
```

### Khi nào dùng cái nào

- **Named export** (cách 1): dùng cho constants, utils, types — import được từng cái
- **Default export** (cách 3): dùng cho React components — mỗi file 1 component chính

### Common Mistakes

- ❌ Quên `export` → file khác import báo lỗi ngay
- ❌ Dùng default export cho constants → khó tìm tên khi import

---

## 8. as const

**Học ngày**: 2026-06-17
**Nguồn**: Tự học qua project imood-app

### Khái niệm đơn giản

`as const` = "đóng băng" giá trị — TypeScript hiểu chính xác giá trị thật thay vì kiểu chung chung.

### Chi tiết / Ví dụ

```ts
// Không có as const → TypeScript hiểu kiểu chung
const MOOD_LEVELS = [{ level: 1, label: 'Rất tệ' }]
// level: number (bất kỳ số nào)
// label: string (bất kỳ string nào)

// Có as const → TypeScript hiểu chính xác
const MOOD_LEVELS = [{ level: 1, label: 'Rất tệ' }] as const
// level: 1 (chỉ đúng số 1)
// label: 'Rất tệ' (chỉ đúng string này)
```

### Analogy dễ nhớ

Như khóa tủ sau khi xếp đồ xong — không ai thêm/bớt/sửa được nữa.

### Khi nào dùng

- Array/object là config cố định không bao giờ thay đổi
- Muốn TypeScript bảo vệ chặt hơn, không cho sửa nhầm

---

## 9. UPPER_SNAKE_CASE

**Học ngày**: 2026-06-17
**Nguồn**: Tự học qua project imood-app

### Khái niệm đơn giản

Quy ước đặt tên để nhìn vào **biết ngay loại biến** — không phải bắt buộc nhưng cả thế giới dev đều làm vậy.

### Chi tiết / Ví dụ

```ts
UPPER_SNAKE_CASE  → constant (giá trị không đổi)
camelCase         → biến thường, function, hook
PascalCase        → component React, interface, type
kebab-case        → tên file, tên folder, CSS class
```

```ts
// Nhìn vào tên → biết ngay vai trò
const MOOD_COLORS = { ... }      // constant
const moodLevel = 3              // biến thường
function useMoodData() { ... }   // hook
interface MoodEntry { ... }      // type/interface
```

---

## 10. Record\<K, V\> và Mapped Type

**Học ngày**: 2026-06-17
**Nguồn**: Tự học qua project imood-app

### Khái niệm đơn giản

`Record<K, V>` = tạo một object mà **key** phải là kiểu K, **value** phải là kiểu V.

### Chi tiết / Ví dụ

```ts
// Record<MoodLevel, string> nghĩa là:
// - key phải là 1 | 2 | 3 | 4 | 5
// - value phải là string
// - phải có đủ tất cả các key

const MOOD_COLORS: Record<MoodLevel, string> = {
  1: '#FF6B6B',
  2: '#FFB347',
  3: '#FFD700',
  4: '#90EE90',
  5: '#4CAF50',
}

// Thiếu key 5 → TypeScript báo lỗi ngay
// Key là 6 → TypeScript báo lỗi ngay
// Value là number → TypeScript báo lỗi ngay
```

### 3 cách viết tương đương

```ts
// Cách 1: Record (ngắn gọn, phổ biến)
const MOOD_COLORS: Record<MoodLevel, string> = { ... }

// Cách 2: Mapped Type (Record là shorthand của cái này)
const MOOD_COLORS: { [key in MoodLevel]: string } = { ... }

// Cách 3: Index Signature (kém an toàn hơn)
const MOOD_COLORS: { [key: number]: string } = { ... }
// ← không ép buộc phải có đủ key 1-5
```

| Cách | An toàn | Ngắn gọn | Phổ biến |
|---|---|---|---|
| `Record<K, V>` | ✅ | ✅ | ✅ |
| `{ [key in K]: V }` | ✅ | ❌ | thỉnh thoảng |
| `{ [key: number]: V }` | ❌ | ✅ | ít dùng |

### Analogy dễ nhớ

`Record` như **checklist bắt buộc** — TypeScript điểm danh từng key, thiếu 1 là nhắc liền.

### Common Mistakes

- ❌ Dùng `{ [key: number]: string }` khi muốn ép buộc đủ key → dễ bị miss
- ✅ Dùng `Record<MoodLevel, string>` để TypeScript tự check cho mình

---

## 11. TypeScript Utility Types

**Học ngày**: 2026-06-17
**Nguồn**: Tự học qua project imood-app

### Khái niệm đơn giản

Utility Types = các kiểu type **có sẵn trong TypeScript**, giúp biến đổi type có sẵn thành type mới — không cần viết lại từ đầu.

TypeScript có 20+ utility types, nhưng chỉ cần nhớ 7 cái hay dùng nhất.

### Chi tiết / Ví dụ

```ts
// Type gốc dùng làm ví dụ
type User = {
  id: string
  name: string
  email: string
  age?: number
}
```

**`Partial<T>`** — tất cả fields thành optional
```ts
type UpdateUser = Partial<User>
// { id?: string, name?: string, email?: string, age?: number }
// Dùng khi: form update — không cần điền hết
```

**`Required<T>`** — tất cả fields thành bắt buộc
```ts
type StrictUser = Required<User>
// { id: string, name: string, email: string, age: number }
// Dùng khi: đảm bảo không field nào bị thiếu
```

**`Pick<T, K>`** — chỉ lấy một số fields
```ts
type UserPreview = Pick<User, 'id' | 'name'>
// { id: string, name: string }
// Dùng khi: hiển thị card — chỉ cần id và name
```

**`Omit<T, K>`** — bỏ một số fields
```ts
type NewUser = Omit<User, 'id'>
// { name: string, email: string, age?: number }
// Dùng khi: tạo mới — id do server tự gen
```

**`Record<K, V>`** — tạo object với key/value định sẵn
```ts
type MoodColors = Record<MoodLevel, string>
// { 1: string, 2: string, 3: string, 4: string, 5: string }
// Dùng khi: mapping, lookup table
```

**`Readonly<T>`** — không cho sửa sau khi tạo
```ts
type FrozenUser = Readonly<User>
// frozenUser.name = 'abc' → lỗi TypeScript
// Dùng khi: config, constants không muốn ai sửa nhầm
```

**`ReturnType<T>`** — lấy type từ giá trị return của function
```ts
function getMood() { return { level: 1, label: 'Tốt' } }
type Mood = ReturnType<typeof getMood>
// { level: number, label: string }
// Dùng khi: không muốn khai báo type riêng, lấy thẳng từ function
```

### Cách nhớ nhanh

| Muốn làm gì | Dùng cái gì |
|---|---|
| Bớt bắt buộc | `Partial` |
| Thêm bắt buộc | `Required` |
| Lấy một số field | `Pick` |
| Bỏ một số field | `Omit` |
| Mapping key→value | `Record` |
| Khóa không cho sửa | `Readonly` |
| Lấy type từ function | `ReturnType` |

### Điểm mạnh chính

Khi type gốc thay đổi → type con **tự động cập nhật**, không cần sửa thủ công từng chỗ.

```ts
// User thêm field mới
type User = { id: string, name: string, phone: string }

// Partial<User> tự động có phone? luôn — không cần sửa
type UpdateUser = Partial<User>
```

### Common Mistakes

- ❌ Khai báo lại type thủ công thay vì dùng utility type → khi type gốc đổi phải sửa nhiều chỗ
- ❌ Nhầm `Pick` và `Omit` → Pick = lấy cái muốn giữ, Omit = bỏ cái không cần

---

## 12. type vs interface

**Học ngày**: 2026-06-17
**Nguồn**: Tự học qua project imood-app

### Khái niệm đơn giản

Cả 2 đều dùng để định nghĩa kiểu dữ liệu trong TypeScript — nhưng mỗi cái có thế mạnh riêng.

### Quy tắc nhớ nhanh

```
type      → union, primitive, computed
interface → object shape
```

### Chi tiết / Ví dụ

```ts
// ✅ Dùng type cho:
type MoodLevel = 1 | 2 | 3 | 4 | 5           // union
type ID = string                               // primitive alias
type MoodColors = Record<MoodLevel, string>    // computed

// ✅ Dùng interface cho:
interface MoodEntry {                          // object shape
  id: string
  date: string
  level: MoodLevel
  note?: string
  createdAt: number
}
```

### Khác nhau quan trọng

**interface có thể extends (kế thừa):**
```ts
interface Animal { name: string }
interface Dog extends Animal { breed: string }
// Dog = { name: string, breed: string }
```

**interface có thể merge (declaration merging):**
```ts
interface User { id: string }
interface User { name: string }
// Tự ghép lại: User = { id: string, name: string }
```

**type KHÔNG làm được 2 thứ trên:**
```ts
type User = { id: string }
type User = { name: string } // ❌ lỗi: duplicate identifier
```

### Trong imood-app áp dụng thế nào

```ts
// type → vì là union
type MoodLevel = 1 | 2 | 3 | 4 | 5

// interface → vì là object shape
interface MoodEntry { id: string, date: string, ... }
interface MoodLevelConfig { level: MoodLevel, label: string, ... }
```

### Common Mistakes

- ❌ Dùng `interface` cho union: `interface X = 1 | 2 | 3` → lỗi cú pháp
- ❌ Khai báo `type` 2 lần cùng tên → lỗi duplicate
- ✅ Object shape → `interface`, còn lại → `type`

---

## Template thêm khái niệm mới

Khi học được khái niệm mới, copy template này và điền vào:

```
## [số thứ tự]. [Tên khái niệm]

**Học ngày**: YYYY-MM-DD
**Nguồn**: (link bài đọc, video, hoặc ghi "tự học qua project")

### Khái niệm đơn giản
[1-2 câu mô tả bằng ngôn ngữ đơn giản nhất]

### Chi tiết / Ví dụ
[Code example hoặc giải thích sâu hơn]

### Analogy dễ nhớ
[So sánh với thứ gì đó quen thuộc trong cuộc sống]

### Khi nào dùng / không dùng
[Practical guidance]

### Common Mistakes
[Những lỗi hay gặp]
```
