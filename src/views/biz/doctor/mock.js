export const DOCTOR_STATUS_OPTIONS = [
  { value: '0', label: '正常', tagType: 'success' },
  { value: '1', label: '停用', tagType: 'info' },
  { value: '3', label: '待审核', tagType: 'warning' },
  { value: '4', label: '审核失败', tagType: 'danger' },
  { value: '5', label: '注册', tagType: 'info' }
]

export const DOCTOR_LIST_COLUMNS = [
  { key: 'id', label: '医生编号' },
  { key: 'nickName', label: '医生姓名' },
  { key: 'idCardNumber', label: '身份证号' },
  { key: 'title', label: '职称' },
  { key: 'idCardFront', label: '身份证正面' },
  { key: 'idCardBack', label: '身份证反面' },
  { key: 'qualificationCertificate', label: '职业资格证' },
  { key: 'phone', label: '手机号' },
  { key: 'status', label: '状态' },
  { key: 'createTime', label: '创建时间' },
  { key: 'actions', label: '操作' }
]

export const DOCTOR_RECORDS = [
  {
    id: 20001,
    nickName: '张医生',
    username: 'zhangsan',
    idCardNumber: '110101199001011234',
    title: '主治医师',
    phone: '13800000001',
    idCardFront: attachment('doctor-zhang-front.png'),
    idCardBack: attachment('doctor-zhang-back.png'),
    qualificationCertificate: attachment('doctor-zhang-qualification.png'),
    status: '0',
    createTime: '2026-08-10 09:30:00'
  },
  {
    id: 20002,
    nickName: '李医生',
    username: 'lisi',
    idCardNumber: '110101199201021234',
    title: '副主任医师',
    phone: '13900000002',
    idCardFront: attachment('doctor-li-front.png'),
    idCardBack: attachment('doctor-li-back.png'),
    qualificationCertificate: attachment('doctor-li-qualification.png'),
    status: '0',
    createTime: '2026-08-09 14:20:00'
  },
  {
    id: 20003,
    nickName: '王医生',
    username: 'wangwu',
    idCardNumber: '110101199301031234',
    title: '主治医师',
    phone: '13700000003',
    idCardFront: attachment('doctor-wang-front.png'),
    idCardBack: attachment('doctor-wang-back.png'),
    qualificationCertificate: attachment('doctor-wang-qualification.png'),
    status: '1',
    createTime: '2026-08-08 11:05:00'
  },
  {
    id: 20004,
    nickName: '赵医生',
    username: 'zhaoliu',
    idCardNumber: '110101199401041234',
    title: '住院医师',
    phone: '13600000004',
    idCardFront: attachment('doctor-zhao-front.png'),
    idCardBack: attachment('doctor-zhao-back.png'),
    qualificationCertificate: attachment('doctor-zhao-qualification.png'),
    status: '0',
    createTime: '2026-08-07 16:45:00'
  },
  {
    id: 20005,
    nickName: '陈医生',
    username: 'chenqi',
    idCardNumber: '110101199501051234',
    title: '副主任医师',
    phone: '13500000005',
    idCardFront: attachment('doctor-chen-front.png'),
    idCardBack: attachment('doctor-chen-back.png'),
    qualificationCertificate: attachment('doctor-chen-qualification.png'),
    status: '0',
    createTime: '2026-08-06 10:10:00'
  },
  {
    id: 20006,
    nickName: '刘医生',
    username: 'liuba',
    idCardNumber: '110101199601061234',
    title: '主治医师',
    phone: '13300000006',
    idCardFront: attachment('doctor-liu-front.png'),
    idCardBack: attachment('doctor-liu-back.png'),
    qualificationCertificate: attachment('doctor-liu-qualification.png'),
    status: '1',
    createTime: '2026-08-05 13:25:00'
  },
  {
    id: 20007,
    nickName: '周医生',
    username: 'zhoujiu',
    idCardNumber: '110101199701071234',
    title: '住院医师',
    phone: '13200000007',
    idCardFront: attachment('doctor-zhou-front.png'),
    idCardBack: attachment('doctor-zhou-back.png'),
    qualificationCertificate: attachment('doctor-zhou-qualification.png'),
    status: '0',
    createTime: '2026-08-04 08:55:00'
  },
  {
    id: 20008,
    nickName: '吴医生',
    username: 'wushi',
    idCardNumber: '110101199801081234',
    title: '主治医师',
    phone: '13100000008',
    idCardFront: attachment('doctor-wu-front.png'),
    idCardBack: attachment('doctor-wu-back.png'),
    qualificationCertificate: attachment('doctor-wu-qualification.png'),
    status: '0',
    createTime: '2026-08-03 15:40:00'
  },
  {
    id: 20009,
    nickName: '孙医生',
    username: 'sunshi',
    idCardNumber: '110101199901091234',
    title: '主治医师',
    phone: '13000000009',
    idCardFront: attachment('doctor-sun-front.png'),
    idCardBack: attachment('doctor-sun-back.png'),
    qualificationCertificate: attachment('doctor-sun-qualification.png'),
    status: '1',
    createTime: '2026-08-02 12:15:00'
  },
  {
    id: 20010,
    nickName: '郑医生',
    username: 'zhengyi',
    idCardNumber: '110101200001101234',
    title: '主任医师',
    phone: '15800000010',
    idCardFront: attachment('doctor-zheng-front.png'),
    idCardBack: attachment('doctor-zheng-back.png'),
    qualificationCertificate: attachment('doctor-zheng-qualification.png'),
    status: '0',
    createTime: '2026-08-01 17:00:00'
  },
  {
    id: 20011,
    nickName: '何医生',
    username: 'heyi',
    idCardNumber: '110101200101111234',
    title: '住院医师',
    phone: '15900000011',
    idCardFront: attachment('doctor-he-front.png'),
    idCardBack: attachment('doctor-he-back.png'),
    qualificationCertificate: attachment('doctor-he-qualification.png'),
    status: '0',
    createTime: '2026-07-31 09:05:00'
  }
]

function attachment(filename) {
  return {
    filePath: `doctor/${filename}`,
    originalFilename: filename
  }
}

export function filterDoctorRecords(records, filters = {}) {
  const matches = (value, keyword) => {
    if (!keyword) {
      return true
    }
    return String(value).toLowerCase().includes(String(keyword).trim().toLowerCase())
  }

  return records.filter(record =>
    matches(record.nickName, filters.nickName)
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
