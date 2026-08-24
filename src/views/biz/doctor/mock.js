export const DOCTOR_STATUS_OPTIONS = [
  { value: '0', label: '正常', tagType: 'success' },
  { value: '1', label: '停用', tagType: 'info' },
  { value: '3', label: '待审核', tagType: 'warning' },
  { value: '4', label: '审核失败', tagType: 'danger' },
  { value: '5', label: '注册', tagType: 'info' }
]

export const DOCTOR_RECORDS = [
  {
    id: 20001,
    name: '张医生',
    username: 'zhangsan',
    title: '主治医师',
    phone: '13800000001',
    status: '0',
    createTime: '2026-08-10 09:30:00'
  },
  {
    id: 20002,
    name: '李医生',
    username: 'lisi',
    title: '副主任医师',
    phone: '13900000002',
    status: '0',
    createTime: '2026-08-09 14:20:00'
  },
  {
    id: 20003,
    name: '王医生',
    username: 'wangwu',
    title: '主治医师',
    phone: '13700000003',
    status: '1',
    createTime: '2026-08-08 11:05:00'
  },
  {
    id: 20004,
    name: '赵医生',
    username: 'zhaoliu',
    title: '住院医师',
    phone: '13600000004',
    status: '0',
    createTime: '2026-08-07 16:45:00'
  },
  {
    id: 20005,
    name: '陈医生',
    username: 'chenqi',
    title: '副主任医师',
    phone: '13500000005',
    status: '0',
    createTime: '2026-08-06 10:10:00'
  },
  {
    id: 20006,
    name: '刘医生',
    username: 'liuba',
    title: '主治医师',
    phone: '13300000006',
    status: '1',
    createTime: '2026-08-05 13:25:00'
  },
  {
    id: 20007,
    name: '周医生',
    username: 'zhoujiu',
    title: '住院医师',
    phone: '13200000007',
    status: '0',
    createTime: '2026-08-04 08:55:00'
  },
  {
    id: 20008,
    name: '吴医生',
    username: 'wushi',
    title: '主治医师',
    phone: '13100000008',
    status: '0',
    createTime: '2026-08-03 15:40:00'
  },
  {
    id: 20009,
    name: '孙医生',
    username: 'sunshi',
    title: '主治医师',
    phone: '13000000009',
    status: '1',
    createTime: '2026-08-02 12:15:00'
  },
  {
    id: 20010,
    name: '郑医生',
    username: 'zhengyi',
    title: '主任医师',
    phone: '15800000010',
    status: '0',
    createTime: '2026-08-01 17:00:00'
  },
  {
    id: 20011,
    name: '何医生',
    username: 'heyi',
    title: '住院医师',
    phone: '15900000011',
    status: '0',
    createTime: '2026-07-31 09:05:00'
  }
]

export function filterDoctorRecords(records, filters = {}) {
  const matches = (value, keyword) => {
    if (!keyword) {
      return true
    }
    return String(value).toLowerCase().includes(String(keyword).trim().toLowerCase())
  }

  return records.filter(record =>
    matches(record.name, filters.name)
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
