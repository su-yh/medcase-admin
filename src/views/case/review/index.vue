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
      <el-form-item label="病例编号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入病例编号"
          clearable
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="病例名称" prop="caseName">
        <el-input
          v-model="queryParams.caseName"
          placeholder="请输入病例名称"
          clearable
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="病例状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择病例状态"
          clearable
          style="width: 220px"
        >
          <el-option
            v-for="item in CASE_STATUS_OPTIONS"
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
        storage-key="case-review-columns"
        @queryTable="getList"
      />
    </el-row>

    <el-table v-loading="loading" :data="caseList" row-key="id">
      <el-table-column
        v-if="columns.id.visible"
        label="病例编号"
        prop="id"
        align="center"
        width="100"
      />
      <el-table-column
        v-if="columns.caseName.visible"
        label="病例名称"
        prop="caseName"
        min-width="220"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="columns.attachments.visible"
        label="附件"
        min-width="240"
      >
        <template #default="{ row }">
          <div v-if="getAttachmentList(row.attachments).length" class="table-attachment-list">
            <el-button
              v-for="attachment in getAttachmentList(row.attachments)"
              :key="attachment.key"
              link
              type="primary"
              class="table-attachment-button"
              @click="openAttachmentPreview(attachment)"
            >
              {{ attachment.name }}
            </el-button>
          </div>
          <span v-else class="empty-attachment">暂无附件</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.status.visible"
        label="状态"
        align="center"
        width="180"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusOption(row.status).tagType">
            {{ getStatusOption(row.status).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.submitInfo.visible"
        label="提交人"
        align="center"
        width="180"
      >
        <template #default="{ row }">
          <div class="case-operator-info">
            <span>{{ row.userName || '暂无' }}</span>
            <small>{{ row.createTime || '—' }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.reviewInfo.visible"
        label="审核"
        align="center"
        width="180"
      >
        <template #default="{ row }">
          <div class="case-operator-info">
            <span>{{ row.reviewerNickname || '暂无' }}</span>
            <small>{{ row.reviewTime || '—' }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.settleInfo.visible"
        label="结算"
        align="center"
        width="180"
      >
        <template #default="{ row }">
          <div class="case-operator-info">
            <span>{{ row.settlerNickname || '暂无' }}</span>
            <small>{{ row.settledTime || '—' }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.actions.visible"
        label="操作"
        align="center"
        width="220"
        fixed="right"
        class-name="case-review-actions-column"
        label-class-name="case-review-actions-header"
      >
        <template #default="{ row }">
          <el-button
            v-hasPermi="[queryPerm]"
            link
            type="primary"
            icon="View"
            @click="handleView(row)"
          >
            查看
          </el-button>
          <el-button
            v-if="row.status === 'pending_review'"
            v-hasPermi="[reviewPerm]"
            link
            type="primary"
            icon="Edit"
            @click="handleReview(row)"
          >
            审核
          </el-button>
          <el-button
            v-if="row.status === 'approved_pending_settlement'"
            v-hasPermi="[settlePerm]"
            link
            type="warning"
            icon="Money"
            :loading="settleSubmitting && currentCase?.id === row.id"
            @click="handleSettle(row)"
          >
            结算
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />

    <el-dialog
      v-model="detailOpen"
      :title="dialogTitle"
      width="680px"
      append-to-body
      :close-on-click-modal="false"
      class="case-review-dialog"
      @closed="resetDialog"
    >
      <el-descriptions
        v-if="currentCase"
        :column="2"
        label-width="100px"
        class="case-review-descriptions"
        border
      >
        <el-descriptions-item label="病例编号">
          {{ currentCase.id }}
        </el-descriptions-item>
        <el-descriptions-item label="提交人">
          {{ currentCase.userName }}
        </el-descriptions-item>
        <el-descriptions-item label="病例名称" :span="2">
          {{ currentCase.caseName }}
        </el-descriptions-item>
        <el-descriptions-item label="病例状态">
          <el-tag :type="getStatusOption(currentCase.status).tagType">
            {{ getStatusOption(currentCase.status).label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="提交时间">
          {{ currentCase.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="审核人">
          {{ currentCase.reviewerNickname || '暂无' }}
          <span v-if="currentCase.reviewerId">（{{ currentCase.reviewerId }}）</span>
        </el-descriptions-item>
        <el-descriptions-item label="结算人">
          {{ currentCase.settlerNickname || '暂无' }}
          <span v-if="currentCase.settlerId">（{{ currentCase.settlerId }}）</span>
        </el-descriptions-item>
        <el-descriptions-item label="病例内容" :span="2">
          {{ currentCase.content || '暂无病例内容' }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="currentCase.reviewReason"
          label="审核原因"
          :span="2"
        >
          {{ currentCase.reviewReason }}
        </el-descriptions-item>
        <el-descriptions-item label="附件" :span="2">
          <div v-if="attachmentList.length" class="attachment-list">
            <el-button
              v-for="attachment in attachmentList"
              :key="attachment.key"
              link
              type="primary"
              class="attachment-button"
              @click="openAttachmentPreview(attachment)"
            >
              {{ attachment.name }}
            </el-button>
          </div>
          <span v-else>暂无附件</span>
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        v-if="dialogMode === 'review' && currentCase?.status === 'pending_review'"
        ref="reviewFormRef"
        :model="reviewForm"
        class="review-form"
        label-width="90px"
      >
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="reviewForm.status">
            <el-radio value="approved_pending_settlement">审核通过</el-radio>
            <el-radio value="review_failed">审核拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="reviewForm.status === 'review_failed'"
          label="拒绝原因"
          prop="reason"
        >
          <el-input
            v-model="reviewForm.reason"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="请输入审核拒绝原因"
          />
        </el-form-item>
      </el-form>
      <el-form
        v-if="dialogMode === 'settle' && currentCase?.status === 'approved_pending_settlement'"
        :model="settleForm"
        class="review-form"
        label-width="90px"
      >
        <el-form-item label="结算状态">
          <el-tag type="warning">待结算</el-tag>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="detailOpen = false">关闭</el-button>
        <template v-if="dialogMode === 'review' && currentCase?.status === 'pending_review'">
          <el-button
            type="primary"
            icon="Check"
            :loading="reviewSubmitting"
            @click="handleSubmitReview"
          >
            提交
          </el-button>
        </template>
        <template v-if="dialogMode === 'settle' && currentCase?.status === 'approved_pending_settlement'">
          <el-button
            type="warning"
            icon="Money"
            :loading="settleSubmitting"
            @click="handleSubmitSettle"
          >
            提交
          </el-button>
        </template>
      </template>
    </el-dialog>

    <AttachmentPreviewDialog
      v-model="attachmentPreviewOpen"
      :attachment="previewAttachment"
    />
  </div>
</template>

<script setup name="CaseReview">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listCaseReview,
  reviewCaseReview,
  settleCaseReview
} from '@/api/biz/caseReview'
import {
  CASE_STATUS_OPTIONS
} from './mock'
import AttachmentPreviewDialog from '@/components/attachments/AttachmentPreviewDialog.vue'

const route = useRoute()

const loading = ref(false)
const showSearch = ref(true)
const caseList = ref([])
const total = ref(0)
const detailOpen = ref(false)
const currentCase = ref(null)
const dialogMode = ref('detail')
const reviewSubmitting = ref(false)
const settleSubmitting = ref(false)
const attachmentPreviewOpen = ref(false)
const previewAttachment = ref(null)
const reviewFormRef = ref()
const reviewForm = reactive({
  status: 'approved_pending_settlement',
  reason: ''
})
const settleForm = reactive({})
const caseType = computed(() => (route.path.includes('/patient') ? 'patient' : 'doctor'))
const queryPerm = computed(() => `${caseType.value}:case:query`)
const reviewPerm = computed(() => `${caseType.value}:case:review`)
const settlePerm = computed(() => `${caseType.value}:case:settle`)
const pageTitle = computed(() => (caseType.value === 'patient' ? '患者病例' : '医生病例'))
const attachmentList = computed(() => getAttachmentList(currentCase.value?.attachments))
const dialogTitle = computed(() => {
  if (dialogMode.value === 'review') {
    return `${pageTitle.value}审核`
  }
  if (dialogMode.value === 'settle') {
    return `${pageTitle.value}结算`
  }
  return `${pageTitle.value}详情`
})

const columns = reactive({
  id: { label: '病例编号', visible: true },
  caseName: { label: '病例名称', visible: true },
  attachments: { label: '附件', visible: true },
  status: { label: '状态', visible: true },
  submitInfo: { label: '提交', visible: true },
  reviewInfo: { label: '审核', visible: true },
  settleInfo: { label: '结算', visible: true },
  actions: { label: '操作', visible: true }
})

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: '',
  caseName: '',
  status: ''
})

function getList() {
  loading.value = true
  listCaseReview(caseType.value, {
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize,
    id: queryParams.id || undefined,
    caseName: queryParams.caseName || undefined,
    status: queryParams.status || undefined
  }).then(res => {
    caseList.value = res.list || []
    total.value = res.total || 0
  }).finally(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.pageNo = 1
  getList()
}

function resetQuery() {
  queryParams.pageNo = 1
  queryParams.id = ''
  queryParams.caseName = ''
  queryParams.status = ''
  getList()
}

function getStatusOption(status) {
  return CASE_STATUS_OPTIONS.find(item => item.value === status) || {
    label: '未知状态',
    tagType: 'info'
  }
}

function getAttachmentList(attachments) {
  if (!Array.isArray(attachments)) {
    return []
  }

  return attachments
    .filter(attachment => attachment?.filePath)
    .map((attachment, index) => ({
      ...attachment,
      key: `${index}-${attachment.filePath}`,
      name: attachment.originalFilename || attachment.filePath
    }))
}

function openAttachmentPreview(attachment) {
  previewAttachment.value = attachment
  attachmentPreviewOpen.value = true
}

function handleView(row) {
  dialogMode.value = 'detail'
  currentCase.value = row
  detailOpen.value = true
}

function handleReview(row) {
  dialogMode.value = 'review'
  currentCase.value = row
  reviewForm.status = 'approved_pending_settlement'
  reviewForm.reason = ''
  detailOpen.value = true
}

async function handleSubmitReview() {
  if (!currentCase.value || reviewSubmitting.value) {
    return
  }

  const isReject = reviewForm.status === 'review_failed'
  const reason = reviewForm.reason.trim()
  if (isReject && !reason) {
    ElMessage.warning('请输入审核拒绝原因')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认${isReject ? '拒绝' : '通过'}病例「${currentCase.value.caseName}」吗？`,
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
    await reviewCaseReview(caseType.value, currentCase.value.id, {
      approve: !isReject,
      reason: isReject ? reason : undefined
    })
    ElMessage.success(isReject ? '病例已拒绝' : '病例审核通过')
    detailOpen.value = false
    getList()
  } finally {
    reviewSubmitting.value = false
  }
}

function handleSettle(row) {
  if (!row || settleSubmitting.value) {
    return
  }

  dialogMode.value = 'settle'
  currentCase.value = row
  Object.keys(settleForm).forEach(key => delete settleForm[key])
  detailOpen.value = true
}

async function handleSubmitSettle() {
  if (!currentCase.value || settleSubmitting.value) {
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认结算病例「${currentCase.value.caseName}」吗？`,
      '结算确认',
      {
        type: 'warning',
        confirmButtonText: '确认提交',
        cancelButtonText: '取消'
      }
    )
  } catch {
    return
  }

  settleSubmitting.value = true
  try {
    await settleCaseReview(caseType.value, currentCase.value.id, settleForm)
    ElMessage.success('病例已结算')
    detailOpen.value = false
    getList()
  } finally {
    settleSubmitting.value = false
  }
}

function resetDialog() {
  reviewForm.status = 'approved_pending_settlement'
  reviewForm.reason = ''
  Object.keys(settleForm).forEach(key => delete settleForm[key])
  dialogMode.value = 'detail'
}

onMounted(getList)
</script>

<style lang="scss" scoped>
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

:deep(.case-review-actions-column) {
  background-color: #fafafa;
  border-left: 1px solid var(--el-border-color-lighter);
}

:deep(.case-review-actions-header) {
  background-color: #f5f7fa;
  border-left: 1px solid var(--el-border-color-light);
}

:deep(.el-table__body tr.hover-row > td.case-review-actions-column) {
  background-color: var(--el-table-row-hover-bg-color);
}

.review-form {
  margin-top: 20px;
}

.case-operator-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  line-height: 1.4;
}

.case-operator-info small {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

:deep(.case-review-dialog .el-dialog__body) {
  overflow-x: hidden;
}

:deep(.case-review-descriptions .el-descriptions__label) {
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  box-sizing: border-box;
  white-space: nowrap;
  word-break: keep-all;
}

:deep(.case-review-descriptions .el-descriptions__table) {
  width: 100%;
  table-layout: fixed;
}

:deep(.case-review-descriptions .el-descriptions__cell),
:deep(.case-review-descriptions .el-descriptions__content) {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.table-attachment-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
  max-width: 100%;
}

.table-attachment-button {
  max-width: 100%;
  min-width: 0;
  height: auto;
  padding: 4px 0;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-all;
  text-align: left;
}

.empty-attachment {
  color: var(--el-text-color-placeholder);
}
</style>
