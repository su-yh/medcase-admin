import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  CASE_STATUS_OPTIONS,
  filterCaseRecords,
  paginateCaseRecords
} from './mock.js'

const caseReviewViewSource = readFileSync(
  fileURLToPath(new URL('./index.vue', import.meta.url)),
  'utf8'
)

test('exposes the complete case lifecycle status vocabulary', () => {
  assert.deepEqual(
    CASE_STATUS_OPTIONS.map(item => item.value),
    ['draft', 'pending_review', 'review_failed', 'approved_pending_settlement', 'settled']
  )
})

test('filters case records by case name and status', () => {
  const result = filterCaseRecords(
    [
      { id: 1, caseName: '胸痛病例讨论', status: 'pending_review' },
      { id: 2, caseName: '术后复诊记录', status: 'settled' }
    ],
    { caseName: '胸痛', status: 'pending_review' }
  )

  assert.deepEqual(result.map(item => item.id), [1])
})

test('paginates filtered case records with one-based pages', () => {
  const result = paginateCaseRecords(
    [{ id: 1 }, { id: 2 }, { id: 3 }],
    { pageNum: 2, pageSize: 2 }
  )

  assert.deepEqual(result, { list: [{ id: 3 }], total: 3 })
})

test('empty case filters return all records and status filters are exact', () => {
  const records = [
    { id: 1, caseName: '草稿病例', status: 'draft' },
    { id: 2, caseName: '待审病例', status: 'pending_review' }
  ]

  assert.equal(filterCaseRecords(records, {}).length, 2)
  assert.deepEqual(
    filterCaseRecords(records, { status: 'draft' }).map(item => item.id),
    [1]
  )
})

test('case review actions require independent button permissions', () => {
  assert.match(caseReviewViewSource, /v-hasPermi="\['case:review:query'\]"/)
  assert.match(caseReviewViewSource, /v-hasPermi="\['case:review:review'\]"/)
  assert.match(caseReviewViewSource, /v-hasPermi="\['case:review:settle'\]"/)
})
