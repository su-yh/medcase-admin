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
      <el-form-item label="医生姓名" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入医生姓名"
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
            v-for="item in DOCTOR_STATUS_OPTIONS"
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
        storage-key="doctor-management-columns"
        @queryTable="getList"
      />
    </el-row>

    <el-table v-loading="loading" :data="doctorList" row-key="id">
      <el-table-column
        v-if="columns.id.visible"
        label="医生编号"
        prop="id"
        align="center"
        width="100"
      />
      <el-table-column
        v-if="columns.nickName.visible"
        label="医生姓名"
        prop="nickName"
        align="center"
        width="120"
      />
      <el-table-column
        v-if="columns.title.visible"
        label="职称"
        prop="title"
        align="center"
        width="140"
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
          <div class="doctor-attachment">
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
        v-if="columns.qualificationCertificate.visible"
        label="职业资格证"
        align="center"
        width="190"
      >
        <template #default="{ row }">
          <div class="doctor-attachment">
            <el-button
              :disabled="!row.qualificationCertificate?.filePath"
              text
              type="primary"
              @click="openPreview(row.qualificationCertificate)"
            >
              预览
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
        class-name="doctor-actions-column"
        label-class-name="doctor-actions-header"
      >
        <template #default="{ row }">
          <el-button link type="primary" icon="View" @click="handleView(row)">
            查看
          </el-button>
          <el-button
            v-if="row.status === '3' || row.status === '5'"
            v-hasPermi="['biz:doctor:review']"
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

    <el-dialog v-model="detailOpen" title="医生详情" width="620px" append-to-body>
      <el-descriptions
        v-if="currentDoctor"
        :column="2"
        label-width="100px"
        class="doctor-descriptions"
        border
      >
        <el-descriptions-item label="医生编号">
          {{ currentDoctor.id }}
        </el-descriptions-item>
        <el-descriptions-item label="医生姓名">
          {{ currentDoctor.nickName }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ sexLabel(currentDoctor.sex) }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ currentDoctor.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="职称">
          {{ currentDoctor.title }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">
          {{ maskIdCardNumber(currentDoctor.idCardNumber) }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证">
          <div class="doctor-attachment">
            <el-button
              :disabled="!currentDoctor.idCardFront?.filePath"
              text
              type="primary"
              @click="openPreview(currentDoctor.idCardFront)"
            >
              正面
            </el-button>
            <el-button
              :disabled="!currentDoctor.idCardBack?.filePath"
              text
              type="primary"
              @click="openPreview(currentDoctor.idCardBack)"
            >
              反面
            </el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="职业资格证">
          <div class="doctor-attachment">
            <el-button
              :disabled="!currentDoctor.qualificationCertificate?.filePath"
              text
              type="primary"
              @click="openPreview(currentDoctor.qualificationCertificate)"
            >
              预览
            </el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusOption(currentDoctor.status).tagType">
            {{ getStatusOption(currentDoctor.status).label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentDoctor.createTime }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailOpen = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewOpen" title="医生审核" width="520px" append-to-body>
      <el-descriptions
        v-if="reviewDoctorInfo"
        :column="1"
        label-width="90px"
        class="doctor-descriptions"
        border
      >
        <el-descriptions-item label="医生姓名">
          {{ reviewDoctorInfo.nickName }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ sexLabel(reviewDoctorInfo.sex) }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ reviewDoctorInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="职称">
          {{ reviewDoctorInfo.title }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证号">
          {{ maskIdCardNumber(reviewDoctorInfo.idCardNumber) }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证">
          <div class="doctor-attachment">
            <el-button
              :disabled="!reviewDoctorInfo.idCardFront?.filePath"
              text
              type="primary"
              @click="openPreview(reviewDoctorInfo.idCardFront)"
            >
              正面
            </el-button>
            <el-button
              :disabled="!reviewDoctorInfo.idCardBack?.filePath"
              text
              type="primary"
              @click="openPreview(reviewDoctorInfo.idCardBack)"
            >
              反面
            </el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="职业资格证">
          <div class="doctor-attachment">
            <el-button
              :disabled="!reviewDoctorInfo.qualificationCertificate?.filePath"
              text
              type="primary"
              @click="openPreview(reviewDoctorInfo.qualificationCertificate)"
            >
              预览
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
          title="审核失败后，医生可使用原账号重新提交审核。"
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

<script setup name="Doctor">
import { onMounted, reactive, ref } from 'vue'
import { getDoctor, listDoctor, reviewDoctor } from '@/api/biz/doctor'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDict } from '@/utils/dict'
import { selectDictLabel } from '@/utils/ruoyi'
import AttachmentPreviewDialog from '@/components/attachments/AttachmentPreviewDialog.vue'
import {
  DOCTOR_LIST_COLUMNS,
  DOCTOR_STATUS_OPTIONS
} from './mock'

const loading = ref(false)
const showSearch = ref(true)
const doctorList = ref([])
const total = ref(0)
const detailOpen = ref(false)
const currentDoctor = ref(null)
const reviewOpen = ref(false)
const reviewDoctorInfo = ref(null)
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
  DOCTOR_LIST_COLUMNS.map(({ key, label }) => [key, { label, visible: true }])
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
  listDoctor({
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize,
    nickName: queryParams.nickName || undefined,
    phone: queryParams.phone || undefined,
    status: queryParams.status || undefined
  }).then(res => {
    doctorList.value = res.list || []
    total.value = Number(res.total || 0)
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
  return DOCTOR_STATUS_OPTIONS.find(item => item.value === status) || {
    label: '未知状态',
    tagType: 'info'
  }
}

function handleView(row) {
  getDoctor(row.id).then(res => {
    currentDoctor.value = res
    detailOpen.value = true
  })
}

function handleReview(row) {
  reviewDoctorInfo.value = row
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
  if (!reviewDoctorInfo.value || reviewSubmitting.value) {
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
      `确认${isApprove ? '通过' : '拒绝'}医生「${reviewDoctorInfo.value.nickName}」的注册申请吗？`,
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
    await reviewDoctor(reviewDoctorInfo.value.id, {
      approve: isApprove,
      reason: isApprove ? undefined : reviewForm.reason.trim()
    })
    ElMessage.success(isApprove ? '医生审核通过' : '医生审核已拒绝')
    reviewOpen.value = false
    getList()
  } finally {
    reviewSubmitting.value = false
  }
}

function handleMore() {
  ElMessage.info('医生操作功能待补充')
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

:deep(.doctor-actions-column) {
  background-color: #fafafa;
  border-left: 1px solid var(--el-border-color-lighter);
}

:deep(.doctor-actions-header) {
  background-color: #f5f7fa;
  border-left: 1px solid var(--el-border-color-light);
}

:deep(.el-table__body tr.hover-row > td.doctor-actions-column) {
  background-color: var(--el-table-row-hover-bg-color);
}

:deep(.doctor-descriptions .el-descriptions__label) {
  white-space: nowrap;
}

.doctor-attachment {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
}

</style>
