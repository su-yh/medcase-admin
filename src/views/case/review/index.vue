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

    <el-dialog v-model="detailOpen" title="病例详情" width="680px" append-to-body>
      <el-descriptions v-if="currentCase" :column="2" border>
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
          <template v-if="currentCase.attachments?.length">
            <el-tag
              v-for="attachment in currentCase.attachments"
              :key="attachment"
              class="attachment-tag"
            >
              {{ attachment }}
            </el-tag>
          </template>
          <span v-else>暂无附件</span>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailOpen = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CaseReview">
import { onMounted, reactive, ref } from 'vue'
import { listCaseReview } from '@/api/biz/caseReview'
import {
  CASE_STATUS_OPTIONS
} from './mock'

const loading = ref(false)
const showSearch = ref(true)
const caseList = ref([])
const total = ref(0)
const detailOpen = ref(false)
const currentCase = ref(null)

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

function handleView(row) {
  currentCase.value = row
  detailOpen.value = true
}

function handleReview(row) {
  handleView(row)
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

.attachment-tag + .attachment-tag {
  margin-left: 8px;
}
</style>
