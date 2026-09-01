<template>
  <div class="app-container">
    <el-form
      ref="queryRef"
      v-show="showSearch"
      :model="queryParams"
      :inline="true"
      label-width="82px"
      class="query-form"
    >
      <el-form-item label="患者姓名" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入患者姓名"
          clearable
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="item in PATIENT_STATUS_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="query-actions">
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        v-model:showSearch="showSearch"
        :columns="columns"
        storage-key="patient-management-columns"
        @queryTable="getList"
      />
    </el-row>

    <el-table v-loading="loading" :data="patientList" row-key="id">
      <el-table-column
        v-if="columns.id.visible"
        label="患者编号"
        prop="id"
        align="center"
        width="100"
      />
      <el-table-column
        v-if="columns.nickName.visible"
        label="患者姓名"
        prop="nickName"
        align="center"
        width="120"
      />
      <el-table-column
        v-if="columns.idCardNumber.visible"
        label="身份证号"
        align="center"
        width="180"
      >
        <template #default="{ row }">
          {{ maskIdCardNumber(row.idCardNumber) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.idCard.visible"
        label="身份证"
        align="center"
        width="170"
      >
        <template #default="{ row }">
          <div class="patient-attachment">
            <el-button
              :disabled="!row.idCardFront?.filePath"
              text
              type="primary"
              @click="openPreview(row.idCardFront)"
            >
              正面
            </el-button>
            <el-button
              :disabled="!row.idCardBack?.filePath"
              text
              type="primary"
              @click="openPreview(row.idCardBack)"
            >
              反面
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.phone.visible"
        label="手机号"
        prop="phone"
        align="center"
        width="140"
      />
      <el-table-column
        v-if="columns.status.visible"
        label="状态"
        align="center"
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusOption(row.status).tagType">
            {{ getStatusOption(row.status).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.createTime.visible"
        label="创建时间"
        prop="createTime"
        align="center"
        width="180"
      />
      <el-table-column
        v-if="columns.actions.visible"
        label="操作"
        align="center"
        width="140"
        fixed="right"
        class-name="patient-actions-column"
        label-class-name="patient-actions-header"
      >
        <template #default="{ row }">
          <el-button link type="primary" icon="View" @click="handleView(row)">
            查看
          </el-button>
          <el-button
            v-if="row.status === '3' || row.status === '5'"
            v-hasPermi="['patient:user:review']"
            link
            type="primary"
            icon="Checked"
            @click="handleReview(row)"
          >
            审核
          </el-button>
          <el-button
            link
            type="primary"
            icon="MoreFilled"
            title="更多操作"
            @click="handleMore(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />

    <el-dialog v-model="detailOpen" title="患者详情" width="620px" append-to-body>
      <el-descriptions
        v-if="currentPatient"
        :column="2"
        label-width="100px"
        class="patient-descriptions"
        border
      >
        <el-descriptions-item label="患者编号">
          {{ currentPatient.id }}
        </el-descriptions-item>
        <el-descriptions-item label="患者姓名">
          {{ currentPatient.nickName }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ sexLabel(currentPatient.sex) }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ currentPatient.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">
          {{ maskIdCardNumber(currentPatient.idCardNumber) }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证">
          <div class="patient-attachment">
            <el-button
              :disabled="!currentPatient.idCardFront?.filePath"
              text
              type="primary"
              @click="openPreview(currentPatient.idCardFront)"
            >
              正面
            </el-button>
            <el-button
              :disabled="!currentPatient.idCardBack?.filePath"
              text
              type="primary"
              @click="openPreview(currentPatient.idCardBack)"
            >
              反面
            </el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusOption(currentPatient.status).tagType">
            {{ getStatusOption(currentPatient.status).label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentPatient.createTime }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailOpen = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewOpen" title="患者审核" width="520px" append-to-body>
      <el-descriptions
        v-if="reviewPatientInfo"
        :column="1"
        label-width="90px"
        class="patient-descriptions"
        border
      >
        <el-descriptions-item label="患者姓名">
          {{ reviewPatientInfo.nickName }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ sexLabel(reviewPatientInfo.sex) }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ reviewPatientInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">
          {{ maskIdCardNumber(reviewPatientInfo.idCardNumber) }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证">
          <div class="patient-attachment">
            <el-button
              :disabled="!reviewPatientInfo.idCardFront?.filePath"
              text
              type="primary"
              @click="openPreview(reviewPatientInfo.idCardFront)"
            >
              正面
            </el-button>
            <el-button
              :disabled="!reviewPatientInfo.idCardBack?.filePath"
              text
              type="primary"
              @click="openPreview(reviewPatientInfo.idCardBack)"
            >
              反面
            </el-button>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        ref="reviewFormRef"
        :model="reviewForm"
        :rules="reviewRules"
        label-width="90px"
        class="review-form"
      >
        <el-form-item label="审核结果">
          <el-radio-group v-model="reviewForm.approve">
            <el-radio :value="true">审核通过</el-radio>
            <el-radio :value="false">审核拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!reviewForm.approve" label="拒绝原因" prop="reason">
          <el-input
            v-model="reviewForm.reason"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="请输入审核拒绝原因"
          />
        </el-form-item>
        <el-alert
          v-if="!reviewForm.approve"
          title="审核失败后，患者可使用原账号重新提交审核。"
          type="warning"
          :closable="false"
          show-icon
        />
      </el-form>
      <template #footer>
        <el-button @click="reviewOpen = false">关闭</el-button>
        <el-button
          type="primary"
          icon="Check"
          :loading="reviewSubmitting"
          @click="handleSubmitReview"
        >
          提交
        </el-button>
      </template>
    </el-dialog>

    <AttachmentPreviewDialog
      v-model="previewOpen"
      :attachment="previewAttachment"
    />
  </div>
</template>

<script setup name="Patient">
import { onMounted, reactive, ref } from 'vue'
import { getPatient, listPatient, reviewPatient } from '@/api/biz/patient'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDict } from '@/utils/dict'
import { selectDictLabel } from '@/utils/ruoyi'
import AttachmentPreviewDialog from '@/components/attachments/AttachmentPreviewDialog.vue'
import {
  PATIENT_LIST_COLUMNS,
  PATIENT_STATUS_OPTIONS
} from './mock'

const loading = ref(false)
const showSearch = ref(true)
const patientList = ref([])
const total = ref(0)
const detailOpen = ref(false)
const currentPatient = ref(null)
const reviewOpen = ref(false)
const reviewPatientInfo = ref(null)
const previewOpen = ref(false)
const previewAttachment = ref(null)
const reviewSubmitting = ref(false)
const reviewFormRef = ref()
const reviewForm = reactive({
  approve: true,
  reason: ''
})
const reviewRules = {
  reason: [
    { required: true, message: '请输入审核拒绝原因', trigger: 'blur' }
  ]
}
const { sys_user_sex } = useDict('sys_user_sex')

const columns = reactive(Object.fromEntries(
  PATIENT_LIST_COLUMNS.map(({ key, label }) => [key, { label, visible: true }])
))

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  nickName: '',
  phone: '',
  status: ''
})

function getList() {
  loading.value = true
  listPatient({
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize,
    nickName: queryParams.nickName || undefined,
    phone: queryParams.phone || undefined,
    status: queryParams.status || undefined
  }).then(res => {
    patientList.value = res.list || []
    total.value = res.total || 0
  }).finally(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  queryParams.pageNum = 1
  queryParams.nickName = ''
  queryParams.phone = ''
  queryParams.status = ''
  getList()
}

function getStatusOption(status) {
  return PATIENT_STATUS_OPTIONS.find(item => item.value === status) || {
    label: '未知状态',
    tagType: 'info'
  }
}

function handleView(row) {
  getPatient(row.id).then(res => {
    currentPatient.value = res
    detailOpen.value = true
  })
}

function handleReview(row) {
  reviewPatientInfo.value = row
  reviewForm.approve = true
  reviewForm.reason = ''
  reviewOpen.value = true
}

function sexLabel(sex) {
  return selectDictLabel(sys_user_sex.value, sex) || '-'
}

function openPreview(attachment) {
  previewAttachment.value = attachment
  previewOpen.value = true
}

function maskIdCardNumber(idCardNumber) {
  if (!idCardNumber) {
    return '-'
  }
  const value = String(idCardNumber)
  if (value.length <= 8) {
    return value
  }
  return `${value.slice(0, 4)}********${value.slice(-4)}`
}

async function handleSubmitReview() {
  if (!reviewPatientInfo.value || reviewSubmitting.value) {
    return
  }

  const isApprove = reviewForm.approve
  if (!isApprove) {
    const valid = await reviewFormRef.value?.validate().catch(() => false)
    if (!valid) {
      return
    }
  }
  try {
    await ElMessageBox.confirm(
      `确认${isApprove ? '通过' : '拒绝'}患者「${reviewPatientInfo.value.nickName}」的注册申请吗？`,
      '审核确认',
      {
        type: 'warning',
        confirmButtonText: '确认提交',
        cancelButtonText: '取消'
      }
    )
  } catch {
    return
  }

  reviewSubmitting.value = true
  try {
    await reviewPatient(reviewPatientInfo.value.id, {
      approve: isApprove,
      reason: isApprove ? undefined : reviewForm.reason.trim()
    })
    ElMessage.success(isApprove ? '患者审核通过' : '患者审核已拒绝')
    reviewOpen.value = false
    getList()
  } finally {
    reviewSubmitting.value = false
  }
}

function handleMore() {
  ElMessage.info('患者操作功能待补充')
}

onMounted(getList)
</script>

<style scoped>
.query-form {
  display: flex;
  flex-wrap: wrap;
}

.query-form :deep(.query-actions) {
  flex-basis: 100%;
  width: 100%;
  margin-right: 0;
}

:deep(.el-table__fixed-right) {
  box-shadow: -6px 0 8px -6px rgb(0 0 0 / 25%);
}

:deep(.patient-actions-column) {
  background-color: #fafafa;
  border-left: 1px solid var(--el-border-color-lighter);
}

:deep(.patient-actions-header) {
  background-color: #f5f7fa;
  border-left: 1px solid var(--el-border-color-light);
}

:deep(.el-table__body tr.hover-row > td.patient-actions-column) {
  background-color: var(--el-table-row-hover-bg-color);
}

:deep(.patient-descriptions .el-descriptions__label) {
  white-space: nowrap;
}

.patient-attachment {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
}

</style>
