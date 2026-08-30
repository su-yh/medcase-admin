import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  DOCTOR_LIST_COLUMNS,
  filterDoctorRecords,
  paginateDoctorRecords
} from './mock.js'

const doctorViewSource = readFileSync(
  fileURLToPath(new URL('./index.vue', import.meta.url)),
  'utf8'
)

test('doctor list includes attachment columns without login account', () => {
  assert.deepEqual(
    DOCTOR_LIST_COLUMNS.map(column => column.key),
    [
      'id',
      'nickName',
      'idCardNumber',
      'title',
      'idCard',
      'qualificationCertificate',
      'phone',
      'status',
      'createTime',
      'actions'
    ]
  )
})

test('doctor view combines identity card attachments and supports review reason', () => {
  assert.match(doctorViewSource, /label="身份证"/)
  assert.doesNotMatch(doctorViewSource, /label="身份证正面"/)
  assert.doesNotMatch(doctorViewSource, /label="身份证反面"/)
  assert.doesNotMatch(doctorViewSource, /attachmentName\(row\.idCardFront\)/)
  assert.doesNotMatch(doctorViewSource, /attachmentName\(row\.idCardBack\)/)
  assert.doesNotMatch(doctorViewSource, /attachmentName\(row\.qualificationCertificate\)/)
  assert.match(doctorViewSource, /reviewForm\.reason/)
  assert.match(doctorViewSource, /请输入审核拒绝原因/)
})

test('doctor detail and review views do not expose login account', () => {
  assert.doesNotMatch(doctorViewSource, /label="登录账号"/)
  assert.doesNotMatch(doctorViewSource, /currentDoctor\.username/)
  assert.doesNotMatch(doctorViewSource, /reviewDoctorInfo\.username/)
})

test('filters doctors by name, phone, and status', () => {
  const records = [
    { id: 1, nickName: '张医生', username: 'zhang', phone: '13800000001', status: '0' },
    { id: 2, nickName: '李医生', username: 'li', phone: '13900000002', status: '1' }
  ]

  assert.deepEqual(
    filterDoctorRecords(records, { nickName: '张', status: '0' }).map(item => item.id),
    [1]
  )
  assert.deepEqual(
    filterDoctorRecords(records, { phone: '00000002' }).map(item => item.id),
    [2]
  )
})

test('paginates doctor records with total count', () => {
  const result = paginateDoctorRecords(
    [{ id: 1 }, { id: 2 }, { id: 3 }],
    { pageNum: 1, pageSize: 2 }
  )

  assert.deepEqual(result, { list: [{ id: 1 }, { id: 2 }], total: 3 })
})

test('empty doctor filters return all records', () => {
  const records = [
    { id: 1, nickName: '张医生', username: 'zhang', phone: '13800000001', status: '0' },
    { id: 2, nickName: '李医生', username: 'li', phone: '13900000002', status: '1' }
  ]

  assert.equal(filterDoctorRecords(records, {}).length, 2)
})
