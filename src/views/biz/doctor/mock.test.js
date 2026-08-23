import test from 'node:test'
import assert from 'node:assert/strict'
import { filterDoctorRecords, paginateDoctorRecords } from './mock.js'

test('filters doctors by name, phone, and status', () => {
  const records = [
    { id: 1, name: '张医生', username: 'zhang', phone: '13800000001', status: '0' },
    { id: 2, name: '李医生', username: 'li', phone: '13900000002', status: '1' }
  ]

  assert.deepEqual(
    filterDoctorRecords(records, { name: '张', status: '0' }).map(item => item.id),
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

  assert.deepEqual(result, { rows: [{ id: 1 }, { id: 2 }], total: 3 })
})

test('empty doctor filters return all records', () => {
  const records = [
    { id: 1, name: '张医生', username: 'zhang', phone: '13800000001', status: '0' },
    { id: 2, name: '李医生', username: 'li', phone: '13900000002', status: '1' }
  ]

  assert.equal(filterDoctorRecords(records, {}).length, 2)
})
