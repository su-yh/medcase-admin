# Management Modules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the management frontend pages for case review and doctor management with local mock query, status filtering, pagination, detail dialogs, and operation-column placeholders.

**Architecture:** Keep the existing dynamic-menu paths and reuse the RuoYi Vue conventions for query forms, `el-table`, `right-toolbar`, and `pagination`. Each page owns a small ES module containing its mock records and pure filter/pagination functions, so a future API integration can replace the data access without changing page layout. Case review uses the existing backend case status vocabulary but does not call the doctor-scoped API or add review mutations.

**Tech Stack:** Vue 3, Element Plus, Vite, JavaScript modules, Node.js built-in `node:test`.

---

### Task 1: Add pure case-review mock query behavior

**Files:**
- Create: `src/views/case/review/mock.js`
- Create: `src/views/case/review/mock.test.js`

- [ ] **Step 1: Write the failing tests**

Create tests for the case status vocabulary, title/status filtering, and page slicing:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CASE_STATUS_OPTIONS,
  filterCaseRecords,
  paginateCaseRecords
} from './mock.js'

test('exposes the complete case lifecycle status vocabulary', () => {
  assert.deepEqual(
    CASE_STATUS_OPTIONS.map(item => item.value),
    ['draft', 'pending_review', 'review_failed', 'approved_pending_settlement', 'settled']
  )
})

test('filters case records by title and status', () => {
  const result = filterCaseRecords(
    [
      { id: 1, title: '胸痛病例讨论', status: 'pending_review' },
      { id: 2, title: '术后复诊记录', status: 'settled' }
    ],
    { title: '胸痛', status: 'pending_review' }
  )

  assert.deepEqual(result.map(item => item.id), [1])
})

test('paginates filtered case records with one-based pages', () => {
  const result = paginateCaseRecords(
    [{ id: 1 }, { id: 2 }, { id: 3 }],
    { pageNum: 2, pageSize: 2 }
  )

  assert.deepEqual(result, { rows: [{ id: 3 }], total: 3 })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test src/views/case/review/mock.test.js
```

Expected: FAIL because `src/views/case/review/mock.js` does not exist.

- [ ] **Step 3: Implement the minimal mock query module**

Create `mock.js` with:

```js
export const CASE_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿', tagType: 'info' },
  { value: 'pending_review', label: '待审核', tagType: 'warning' },
  { value: 'review_failed', label: '审核失败', tagType: 'danger' },
  { value: 'approved_pending_settlement', label: '审核通过 / 待结算', tagType: 'success' },
  { value: 'settled', label: '已结算', tagType: 'success' }
]

export const CASE_RECORDS = [
  {
    id: 10001,
    title: '胸痛病例讨论',
    doctorName: '张医生',
    status: 'pending_review',
    createTime: '2026-08-23 09:12:00',
    remark: '需要重点关注既往用药记录。',
    reviewReason: '',
    attachments: ['胸痛病例讨论.docx']
  },
  {
    id: 10002,
    title: '术后复诊记录',
    doctorName: '李医生',
    status: 'settled',
    createTime: '2026-08-22 16:40:00',
    remark: '复诊资料已整理。',
    reviewReason: '',
    attachments: ['术后复诊记录.pdf']
  },
  {
    id: 10003,
    title: '慢病随访病例',
    doctorName: '王医生',
    status: 'draft',
    createTime: '2026-08-22 14:05:00',
    remark: '待补充实验室检查结果。',
    reviewReason: '',
    attachments: []
  },
  {
    id: 10004,
    title: '门诊初诊记录',
    doctorName: '赵医生',
    status: 'review_failed',
    createTime: '2026-08-21 11:28:00',
    remark: '初诊资料已提交。',
    reviewReason: '请补充完整的检查报告。',
    attachments: ['门诊初诊记录.jpg']
  },
  {
    id: 10005,
    title: '发热病例分析',
    doctorName: '陈医生',
    status: 'approved_pending_settlement',
    createTime: '2026-08-20 17:18:00',
    remark: '病例分析已完成。',
    reviewReason: '',
    attachments: ['发热病例分析.docx']
  },
  {
    id: 10006,
    title: '消化道症状病例',
    doctorName: '刘医生',
    status: 'pending_review',
    createTime: '2026-08-20 10:46:00',
    remark: '等待管理端审核。',
    reviewReason: '',
    attachments: []
  },
  {
    id: 10007,
    title: '高血压管理病例',
    doctorName: '周医生',
    status: 'settled',
    createTime: '2026-08-19 15:30:00',
    remark: '结算已完成。',
    reviewReason: '',
    attachments: ['高血压管理病例.pdf']
  },
  {
    id: 10008,
    title: '皮肤症状病例',
    doctorName: '吴医生',
    status: 'approved_pending_settlement',
    createTime: '2026-08-18 13:20:00',
    remark: '审核已通过。',
    reviewReason: '',
    attachments: []
  },
  {
    id: 10009,
    title: '呼吸道感染病例',
    doctorName: '孙医生',
    status: 'review_failed',
    createTime: '2026-08-17 09:50:00',
    remark: '资料需要重新整理。',
    reviewReason: '病例备注内容不完整。',
    attachments: ['呼吸道感染病例.pdf']
  },
  {
    id: 10010,
    title: '糖尿病复诊病例',
    doctorName: '郑医生',
    status: 'draft',
    createTime: '2026-08-16 16:12:00',
    remark: '草稿待医生补充。',
    reviewReason: '',
    attachments: []
  },
  {
    id: 10011,
    title: '骨科康复病例',
    doctorName: '何医生',
    status: 'pending_review',
    createTime: '2026-08-15 14:08:00',
    remark: '康复记录已上传。',
    reviewReason: '',
    attachments: ['骨科康复病例.docx']
  }
]

export function filterCaseRecords(records, filters = {}) {
  const title = filters.title?.trim().toLowerCase()
  return records.filter(record => {
    const titleMatches = !title || record.title.toLowerCase().includes(title)
    const statusMatches = !filters.status || record.status === filters.status
    return titleMatches && statusMatches
  })
}

export function paginateCaseRecords(records, { pageNum = 1, pageSize = 10 } = {}) {
  const start = Math.max(pageNum - 1, 0) * pageSize
  return {
    rows: records.slice(start, start + pageSize),
    total: records.length
  }
}
```

Use stable mock records with the fields rendered by the page: `id`, `title`, `doctorName`, `status`, `createTime`, `remark`, `reviewReason`, and `attachments`.

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
node --test src/views/case/review/mock.test.js
```

Expected: PASS with three passing tests.

- [ ] **Step 5: Commit the case mock module**

```bash
git add src/views/case/review/mock.js src/views/case/review/mock.test.js
git commit -m "test: define case review mock query behavior"
```

### Task 2: Build the case-review page

**Files:**
- Create: `src/views/case/review/index.vue`

- [ ] **Step 1: Write the page behavior checklist as a focused test fixture**

Add a second test block to `mock.test.js` that verifies a reset-like empty filter returns all records and a status-only filter returns only records in that enum state:

```js
test('empty case filters return all records and status filters are exact', () => {
  const records = [
    { id: 1, title: '草稿病例', status: 'draft' },
    { id: 2, title: '待审病例', status: 'pending_review' }
  ]

  assert.equal(filterCaseRecords(records, {}).length, 2)
  assert.deepEqual(
    filterCaseRecords(records, { status: 'draft' }).map(item => item.id),
    [1]
  )
})
```

- [ ] **Step 2: Run the test to verify the behavior is currently missing**

Run:

```bash
node --test src/views/case/review/mock.test.js
```

Expected: FAIL until the filter behavior is implemented exactly.

- [ ] **Step 3: Implement the case-review page**

Use `<script setup name="CaseReview">` and implement:

- `queryParams` with `pageNum`, `pageSize`, `id`, `title`, and `status`.
- `showSearch`, `loading`, `caseList`, `total`, `detailOpen`, and `currentCase` refs.
- `getList()` that calls:

```js
const filteredRecords = filterCaseRecords(CASE_RECORDS, queryParams.value)
const result = paginateCaseRecords(filteredRecords, queryParams.value)
caseList.value = result.rows
total.value = result.total
```
- `handleQuery()` and `resetQuery()` that reset `pageNum` to `1`.
- `handleView(row)` that opens a detail dialog.
- A query form using `el-input` for编号/标题 and `el-select` populated from `CASE_STATUS_OPTIONS`.
- An `el-table` with columns: 编号, 病例标题, 提交医生, 状态, 提交时间, 操作.
- Status tags using the enum label and tag type.
- An operation-column “查看” button only; no review mutation.
- The existing `<right-toolbar>` and `<pagination>` components.
- A detail dialog showing title, doctor, status, create time, remark, review reason, and attachment names when present.

Keep mock data local to this page directory and make all table actions deterministic.

- [ ] **Step 4: Run the pure tests and production build**

Run:

```bash
node --test src/views/case/review/mock.test.js
source ~/.nvm/nvm.sh && nvm use 22.23.2 && yarn build:prod
```

Expected: tests pass and Vite build exits with code 0.

- [ ] **Step 5: Commit the case-review page**

```bash
git add src/views/case/review/index.vue src/views/case/review/mock.test.js
git commit -m "feat: add admin case review page"
```

### Task 3: Add pure doctor-management mock query behavior

**Files:**
- Create: `src/views/biz/doctor/mock.js`
- Create: `src/views/biz/doctor/mock.test.js`

- [ ] **Step 1: Write the failing tests**

Create tests for doctor name/account/phone/status filtering and pagination:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { filterDoctorRecords, paginateDoctorRecords } from './mock.js'

test('filters doctors by name, account, phone, and status', () => {
  const records = [
    { id: 1, name: '张医生', username: 'zhang', phone: '13800000001', status: '0' },
    { id: 2, name: '李医生', username: 'li', phone: '13900000002', status: '1' }
  ]

  assert.deepEqual(
    filterDoctorRecords(records, { name: '张', status: '0' }).map(item => item.id),
    [1]
  )
  assert.deepEqual(
    filterDoctorRecords(records, { username: 'li' }).map(item => item.id),
    [2]
  )
})

test('paginates doctor records with total count', () => {
  const result = paginateDoctorRecords(
    [{ id: 1 }, { id: 2 }, { id: 3 }],
    { pageNum: 1, pageSize: 2 }
  )

  assert.deepEqual(result, { rows: [{ id: 1 }, { id: 2 }], total: 3 })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test src/views/biz/doctor/mock.test.js
```

Expected: FAIL because `src/views/biz/doctor/mock.js` does not exist.

- [ ] **Step 3: Implement the doctor mock query module**

Create `mock.js` with:

```js
export const DOCTOR_STATUS_OPTIONS = [
  { value: '0', label: '正常', tagType: 'success' },
  { value: '1', label: '停用', tagType: 'info' }
]

export const DOCTOR_RECORDS = [
  {
    id: 20001,
    name: '张医生',
    username: 'zhangsan',
    department: '心内科',
    title: '主治医师',
    phone: '13800000001',
    status: '0',
    createTime: '2026-08-10 09:30:00'
  },
  {
    id: 20002,
    name: '李医生',
    username: 'lisi',
    department: '骨科',
    title: '副主任医师',
    phone: '13900000002',
    status: '0',
    createTime: '2026-08-09 14:20:00'
  },
  {
    id: 20003,
    name: '王医生',
    username: 'wangwu',
    department: '内分泌科',
    title: '主治医师',
    phone: '13700000003',
    status: '1',
    createTime: '2026-08-08 11:05:00'
  },
  {
    id: 20004,
    name: '赵医生',
    username: 'zhaoliu',
    department: '全科医学科',
    title: '住院医师',
    phone: '13600000004',
    status: '0',
    createTime: '2026-08-07 16:45:00'
  },
  {
    id: 20005,
    name: '陈医生',
    username: 'chenqi',
    department: '呼吸内科',
    title: '副主任医师',
    phone: '13500000005',
    status: '0',
    createTime: '2026-08-06 10:10:00'
  },
  {
    id: 20006,
    name: '刘医生',
    username: 'liuba',
    department: '消化内科',
    title: '主治医师',
    phone: '13300000006',
    status: '1',
    createTime: '2026-08-05 13:25:00'
  },
  {
    id: 20007,
    name: '周医生',
    username: 'zhoujiu',
    department: '心内科',
    title: '住院医师',
    phone: '13200000007',
    status: '0',
    createTime: '2026-08-04 08:55:00'
  },
  {
    id: 20008,
    name: '吴医生',
    username: 'wushi',
    department: '皮肤科',
    title: '主治医师',
    phone: '13100000008',
    status: '0',
    createTime: '2026-08-03 15:40:00'
  },
  {
    id: 20009,
    name: '孙医生',
    username: 'sunshi',
    department: '感染科',
    title: '主治医师',
    phone: '13000000009',
    status: '1',
    createTime: '2026-08-02 12:15:00'
  },
  {
    id: 20010,
    name: '郑医生',
    username: 'zhengyi',
    department: '内分泌科',
    title: '主任医师',
    phone: '15800000010',
    status: '0',
    createTime: '2026-08-01 17:00:00'
  },
  {
    id: 20011,
    name: '何医生',
    username: 'heyi',
    department: '康复医学科',
    title: '住院医师',
    phone: '15900000011',
    status: '0',
    createTime: '2026-07-31 09:05:00'
  }
]

export function filterDoctorRecords(records, filters = {}) {
  const matches = (value, keyword) => !keyword || value.toLowerCase().includes(keyword.trim().toLowerCase())
  return records.filter(record =>
    matches(record.name, filters.name)
    && matches(record.username, filters.username)
    && matches(record.phone, filters.phone)
    && (!filters.status || record.status === filters.status)
  )
}

export function paginateDoctorRecords(records, { pageNum = 1, pageSize = 10 } = {}) {
  const start = Math.max(pageNum - 1, 0) * pageSize
  return {
    rows: records.slice(start, start + pageSize),
    total: records.length
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
node --test src/views/biz/doctor/mock.test.js
```

Expected: PASS with two passing tests.

- [ ] **Step 5: Commit the doctor mock module**

```bash
git add src/views/biz/doctor/mock.js src/views/biz/doctor/mock.test.js
git commit -m "test: define doctor management mock query behavior"
```

### Task 4: Build the doctor-management page

**Files:**
- Modify: `src/views/biz/doctor/index.vue`

- [ ] **Step 1: Extend the mock tests for reset behavior**

Add a test that confirms empty doctor filters return the full record set:

```js
test('empty doctor filters return all records', () => {
  const records = [
    { id: 1, name: '张医生', username: 'zhang', phone: '13800000001', status: '0' },
    { id: 2, name: '李医生', username: 'li', phone: '13900000002', status: '1' }
  ]

  assert.equal(filterDoctorRecords(records, {}).length, 2)
})
```

- [ ] **Step 2: Run the test to verify it passes after the module exists**

Run:

```bash
node --test src/views/biz/doctor/mock.test.js
```

Expected: PASS.

- [ ] **Step 3: Implement the doctor-management page**

Use `<script setup name="Doctor">` and implement:

- `queryParams` with `pageNum`, `pageSize`, `name`, `username`, `phone`, and `status`.
- `showSearch`, `loading`, `doctorList`, `total`, `detailOpen`, and `currentDoctor`.
- `getList()` using:

```js
const filteredRecords = filterDoctorRecords(DOCTOR_RECORDS, queryParams.value)
const result = paginateDoctorRecords(filteredRecords, queryParams.value)
doctorList.value = result.rows
total.value = result.total
```
- `handleQuery()` and `resetQuery()` with page reset.
- Search inputs for医生姓名、登录账号、手机号 and a status select.
- An `el-table` with columns: 医生编号、医生姓名、登录账号、所属科室、职称、手机号、状态、创建时间、操作.
- Status tags using `DOCTOR_STATUS_OPTIONS`.
- An operation column containing a “查看” action and a “更多” action that currently shows an informational message without mutating data.
- Existing `<right-toolbar>` and `<pagination>` components.
- A detail dialog showing the selected doctor’s available profile fields.

Do not add create/edit forms, status mutation, delete behavior, or API files.

- [ ] **Step 4: Run tests and production build**

Run:

```bash
node --test src/views/case/review/mock.test.js src/views/biz/doctor/mock.test.js
source ~/.nvm/nvm.sh && nvm use 22.23.2 && yarn build:prod
```

Expected: all Node tests pass and Vite build exits with code 0.

- [ ] **Step 5: Commit the doctor-management page**

```bash
git add src/views/biz/doctor/index.vue src/views/biz/doctor/mock.js src/views/biz/doctor/mock.test.js
git commit -m "feat: add admin doctor management page"
```

### Task 5: Cross-page verification

**Files:**
- Inspect only; modify only if a verification failure identifies a direct issue in the two modules.

- [ ] **Step 1: Run all local behavior tests**

Run:

```bash
node --test src/views/case/review/mock.test.js src/views/biz/doctor/mock.test.js
```

Expected: all tests pass.

- [ ] **Step 2: Run the production build under Node 22.23.2**

Run:

```bash
source ~/.nvm/nvm.sh && nvm use 22.23.2 && yarn build:prod
```

Expected: Vite completes without unresolved imports or Vue compile errors.

- [ ] **Step 3: Check the final diff**

Run:

```bash
git diff --check HEAD~3..HEAD
git status --short
```

Expected: no whitespace errors; only the intended admin page, mock, test, and documentation files are changed. Existing unrelated `docs/` and `.superpowers/` files remain untouched.

- [ ] **Step 4: Commit verification adjustments if needed**

```bash
git add src/views/case/review src/views/biz/doctor
git commit -m "test: verify admin management modules"
```
