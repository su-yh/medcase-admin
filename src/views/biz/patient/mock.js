export const PATIENT_STATUS_OPTIONS = [
  { value: '0', label: '正常', tagType: 'success' },
  { value: '1', label: '停用', tagType: 'info' },
  { value: '3', label: '待审核', tagType: 'warning' },
  { value: '4', label: '审核失败', tagType: 'danger' },
  { value: '5', label: '注册', tagType: 'info' }
]

export const PATIENT_LIST_COLUMNS = [
  { key: 'id', label: '患者编号' },
  { key: 'nickName', label: '患者姓名' },
  { key: 'idCardNumber', label: '身份证号' },
  { key: 'idCard', label: '身份证' },
  { key: 'phone', label: '手机号' },
  { key: 'status', label: '状态' },
  { key: 'createTime', label: '创建时间' },
  { key: 'actions', label: '操作' }
]
