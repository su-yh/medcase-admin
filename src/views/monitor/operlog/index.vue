<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="用户名称" prop="userNicknameLike">
        <el-input
          v-model="queryParams.userNicknameLike"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作名称" prop="operationLike">
        <el-input
          v-model="queryParams.operationLike"
          placeholder="请输入操作名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求路径" prop="reqPathLike">
        <el-input
          v-model="queryParams.reqPathLike"
          placeholder="请输入请求路径"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作时间" style="width: 308px">
        <el-date-picker
          v-model="dateRange"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="auditLogList">
      <el-table-column label="日志编号" align="center" prop="id" />
      <el-table-column label="操作人员" align="center" prop="userNickname" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="操作名称" align="center" prop="operation" :show-overflow-tooltip="true" />
      <el-table-column label="请求方法" align="center" prop="reqMethod" width="110" />
      <el-table-column label="请求路径" align="center" prop="reqPath" :show-overflow-tooltip="true" />
      <el-table-column label="操作时间" align="center" prop="created" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.created) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="View"
            @click="handleDetail(scope.row)"
            v-hasPermi="['monitor:operlog:query']"
          >详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <operlog-detail v-model:visible="detailVisible" :row="detailRow" />
  </div>
</template>

<script setup name="Operlog">
import OperlogDetail from './detail'
import { list } from '@/api/monitor/operlog'

const { proxy } = getCurrentInstance()

const auditLogList = ref([])
const detailVisible = ref(false)
const detailRow = ref({})
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const dateRange = ref([])

const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  userNicknameLike: undefined,
  operationLike: undefined,
  reqPathLike: undefined,
})

function getList() {
  loading.value = true
  list(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    auditLogList.value = response.list || []
    total.value = response.total || 0
    loading.value = false
  })
}

function handleQuery() {
  queryParams.value.pageNo = 1
  getList()
}

function resetQuery() {
  dateRange.value = []
  proxy.resetForm('queryRef')
  queryParams.value.pageNo = 1
  getList()
}

function handleDetail(row) {
  detailRow.value = row
  detailVisible.value = true
}

getList()
</script>
