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
      <el-form-item label="病例标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入病例标题"
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
        v-if="columns.title.visible"
        label="病例标题"
        prop="title"
        min-width="220"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="columns.doctorName.visible"
        label="提交医生"
        prop="doctorName"
        align="center"
        width="120"
      />
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
        v-if="columns.createTime.visible"
        label="提交时间"
        prop="createTime"
        align="center"
        width="180"
      />
      <el-table-column
        v-if="columns.actions.visible"
        label="操作"
        align="center"
        width="160"
        fixed="right"
        class-name="case-review-actions-column"
        label-class-name="case-review-actions-header"
      >
        <template #default="{ row }">
          <el-button link type="primary" icon="View" @click="handleView(row)">
            查看
          </el-button>
          <el-button
            v-if="row.status === 'pending_review'"
            link
            type="primary"
            icon="Edit"
            @click="handleReview(row)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />

    <el-dialog
      v-model="detailOpen"
      :title="reviewMode ? '病例审核' : '病例详情'"
      width="680px"
      append-to-body
      :close-on-click-modal="false"
      class="case-review-dialog"
      @closed="resetReviewForm"
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
        <el-descriptions-item label="提交医生">
          {{ currentCase.doctorName }}
        </el-descriptions-item>
        <el-descriptions-item label="病例标题" :span="2">
          {{ currentCase.title }}
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
        <el-descriptions-item label="备注" :span="2">
          {{ currentCase.remark || '暂无备注' }}
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
            <el-tag
              v-for="attachment in attachmentList"
              :key="attachment.key"
              class="attachment-tag"
            >
              {{ attachment.name }}
            </el-tag>
          </div>
          <span v-else>暂无附件</span>
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        v-if="reviewMode && currentCase?.status === 'pending_review'"
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
      <template #footer>
        <el-button @click="detailOpen = false">关闭</el-button>
        <template v-if="reviewMode && currentCase?.status === 'pending_review'">
          <el-button
            type="primary"
            icon="Check"
            :loading="reviewSubmitting"
            @click="handleSubmitReview"
          >
            提交
          </el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CaseReview">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  listCaseReview,
  reviewCaseReview
} from '@/api/biz/caseReview'
import {
  CASE_STATUS_OPTIONS
} from './mock'

const loading = ref(false)
const showSearch = ref(true)
const caseList = ref([])
const total = ref(0)
const detailOpen = ref(false)
const currentCase = ref(null)
const reviewMode = ref(false)
const reviewSubmitting = ref(false)
const reviewFormRef = ref()
const reviewForm = reactive({
  status: 'approved_pending_settlement',
  reason: ''
})
const attachmentList = computed(() => getAttachmentList(currentCase.value?.attachments))

const columns = reactive({
  id: { label: '病例编号', visible: true },
  title: { label: '病例标题', visible: true },
  doctorName: { label: '提交医生', visible: true },
  status: { label: '状态', visible: true },
  createTime: { label: '提交时间', visible: true },
  actions: { label: '操作', visible: true }
})

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  id: '',
  title: '',
  status: ''
})

function getList() {
  loading.value = true
  listCaseReview({
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize,
    id: queryParams.id || undefined,
    title: queryParams.title || undefined,
    status: queryParams.status || undefined
  }).then(res => {
    caseList.value = res.list || []
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
  queryParams.id = ''
  queryParams.title = ''
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
  if (!attachments) {
    return []
  }

  let attachmentList = attachments
  if (typeof attachments === 'string') {
    try {
      attachmentList = JSON.parse(attachments)
    } catch {
      attachmentList = [attachments]
    }
  }

  if (!Array.isArray(attachmentList)) {
    attachmentList = [attachmentList]
  }

  return attachmentList
    .map((attachment, index) => {
      let value = attachment
      if (typeof attachment === 'string') {
        try {
          value = JSON.parse(attachment)
        } catch {
          value = attachment
        }
      }

      if (value && typeof value === 'object') {
        const name = value.originalFilename
          || value.newFileName
          || value.fileName
          || getAttachmentNameFromUrl(value.url)
          || `附件${index + 1}`
        return {
          key: `${index}-${value.url || name}`,
          name
        }
      }

      const name = String(value || '').trim()
      return name ? { key: `${index}-${name}`, name } : null
    })
    .filter(Boolean)
}

function getAttachmentNameFromUrl(url) {
  if (!url) {
    return ''
  }

  const path = String(url).split('?')[0]
  const name = path.substring(path.lastIndexOf('/') + 1)
  try {
    return decodeURIComponent(name) || ''
  } catch {
    return name
  }
}

function handleView(row) {
  reviewMode.value = false
  currentCase.value = row
  detailOpen.value = true
}

function handleReview(row) {
  reviewMode.value = row.status === 'pending_review'
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
      `确认${isReject ? '拒绝' : '通过'}病例「${currentCase.value.title}」吗？`,
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
    await reviewCaseReview(currentCase.value.id, {
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

function resetReviewForm() {
  reviewForm.status = 'approved_pending_settlement'
  reviewForm.reason = ''
  reviewMode.value = false
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

.attachment-tag {
  display: flex;
  width: 100%;
  height: auto;
  max-width: 100%;
  min-width: 0;
  min-height: 24px;
  line-height: 18px;
  text-align: left;
}

.attachment-tag :deep(.el-tag__content) {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-all;
}
</style>
