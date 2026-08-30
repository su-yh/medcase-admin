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
    caseName: '胸痛病例讨论',
    doctorName: '张医生',
    status: 'pending_review',
    createTime: '2026-08-23 09:12:00',
    content: '需要重点关注既往用药记录。',
    reviewReason: '',
    attachments: ['胸痛病例讨论.docx']
  },
  {
    id: 10002,
    caseName: '术后复诊记录',
    doctorName: '李医生',
    status: 'settled',
    createTime: '2026-08-22 16:40:00',
    content: '复诊资料已整理。',
    reviewReason: '',
    attachments: ['术后复诊记录.pdf']
  },
  {
    id: 10003,
    caseName: '慢病随访病例',
    doctorName: '王医生',
    status: 'draft',
    createTime: '2026-08-22 14:05:00',
    content: '待补充实验室检查结果。',
    reviewReason: '',
    attachments: []
  },
  {
    id: 10004,
    caseName: '门诊初诊记录',
    doctorName: '赵医生',
    status: 'review_failed',
    createTime: '2026-08-21 11:28:00',
    content: '初诊资料已提交。',
    reviewReason: '请补充完整的检查报告。',
    attachments: ['门诊初诊记录.jpg']
  },
  {
    id: 10005,
    caseName: '发热病例分析',
    doctorName: '陈医生',
    status: 'approved_pending_settlement',
    createTime: '2026-08-20 17:18:00',
    content: '病例分析已完成。',
    reviewReason: '',
    attachments: ['发热病例分析.docx']
  },
  {
    id: 10006,
    caseName: '消化道症状病例',
    doctorName: '刘医生',
    status: 'pending_review',
    createTime: '2026-08-20 10:46:00',
    content: '等待管理端审核。',
    reviewReason: '',
    attachments: []
  },
  {
    id: 10007,
    caseName: '高血压管理病例',
    doctorName: '周医生',
    status: 'settled',
    createTime: '2026-08-19 15:30:00',
    content: '结算已完成。',
    reviewReason: '',
    attachments: ['高血压管理病例.pdf']
  },
  {
    id: 10008,
    caseName: '皮肤症状病例',
    doctorName: '吴医生',
    status: 'approved_pending_settlement',
    createTime: '2026-08-18 13:20:00',
    content: '审核已通过。',
    reviewReason: '',
    attachments: []
  },
  {
    id: 10009,
    caseName: '呼吸道感染病例',
    doctorName: '孙医生',
    status: 'review_failed',
    createTime: '2026-08-17 09:50:00',
    content: '资料需要重新整理。',
    reviewReason: '病例备注内容不完整。',
    attachments: ['呼吸道感染病例.pdf']
  },
  {
    id: 10010,
    caseName: '糖尿病复诊病例',
    doctorName: '郑医生',
    status: 'draft',
    createTime: '2026-08-16 16:12:00',
    content: '草稿待医生补充。',
    reviewReason: '',
    attachments: []
  },
  {
    id: 10011,
    caseName: '骨科康复病例',
    doctorName: '何医生',
    status: 'pending_review',
    createTime: '2026-08-15 14:08:00',
    content: '康复记录已上传。',
    reviewReason: '',
    attachments: ['骨科康复病例.docx']
  }
]

export function filterCaseRecords(records, filters = {}) {
  const caseName = filters.caseName?.trim().toLowerCase()

  return records.filter(record => {
    const caseNameMatches = !caseName || record.caseName.toLowerCase().includes(caseName)
    const statusMatches = !filters.status || record.status === filters.status
    const idMatches = !filters.id || String(record.id).includes(String(filters.id).trim())
    return caseNameMatches && statusMatches && idMatches
  })
}

export function paginateCaseRecords(records, { pageNum = 1, pageSize = 10 } = {}) {
  const start = Math.max(pageNum - 1, 0) * pageSize
  return {
    rows: records.slice(start, start + pageSize),
    total: records.length
  }
}
