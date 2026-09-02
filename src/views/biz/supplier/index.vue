<template>
  <div class="app-container">
    <el-form
      ref="queryRef"
      v-show="showSearch"
      :model="queryParams"
      :inline="true"
      label-width="82px"
    >
      <el-form-item label="供应商昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入供应商昵称"
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
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          v-hasPermi="['supplier:add']"
          @click="handleAdd"
        >
          新增
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="supplierList" row-key="id">
      <el-table-column label="编号" prop="id" align="center" width="90" />
      <el-table-column label="供应商昵称" prop="nickName" align="center" min-width="140" />
      <el-table-column label="性别" align="center" width="80">
        <template #default="{ row }">
          {{ sexLabel(row.sex) }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone" align="center" width="140" />
      <el-table-column label="邮箱" prop="email" align="center" min-width="180" />
      <el-table-column label="身份证号" prop="idCardNumber" align="center" min-width="180" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-value="0"
            inactive-value="1"
            v-hasPermi="['supplier:status']"
            @change="status => handleStatusChange(row, status)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="创建人" prop="createBy" align="center" width="120" />
      <el-table-column label="更新时间" prop="updateTime" align="center" width="180" />
      <el-table-column label="更新人" prop="updateBy" align="center" width="120" />
      <el-table-column label="操作" align="center" fixed="right" width="90">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            icon="Edit"
            v-hasPermi="['supplier:edit']"
            @click="handleUpdate(row)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />

    <el-dialog v-model="dialogOpen" :title="dialogTitle" width="620px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="供应商昵称" prop="nickName">
          <el-input v-model="form.nickName" maxlength="30" placeholder="请输入供应商昵称" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio
              v-for="dict in sys_user_sex"
              :key="dict.value"
              :value="dict.value"
            >
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" maxlength="20" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" maxlength="50" placeholder="请输入邮箱（可选）" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCardNumber">
          <el-input v-model="form.idCardNumber" maxlength="30" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :value="dict.value"
            >
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            maxlength="500"
            show-word-limit
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="submitting" @click="submitForm">确定</el-button>
        <el-button @click="dialogOpen = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Supplier">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addSupplier, getSupplier, listSupplier, updateSupplier, updateSupplierStatus } from '@/api/biz/supplier'
import { useDict } from '@/utils/dict'
import { selectDictLabel } from '@/utils/ruoyi'

const loading = ref(false)
const submitting = ref(false)
const showSearch = ref(true)
const supplierList = ref([])
const total = ref(0)
const dialogOpen = ref(false)
const dialogTitle = ref('')
const queryRef = ref()
const formRef = ref()
const { sys_user_sex, sys_normal_disable } = useDict('sys_user_sex', 'sys_normal_disable')

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  nickName: '',
  phone: '',
  status: ''
})

const form = reactive({
  supplierId: undefined,
  nickName: '',
  sex: '',
  phone: '',
  email: '',
  idCardNumber: '',
  status: '0',
  remark: ''
})

const rules = {
  nickName: [{ required: true, message: '供应商昵称不能为空', trigger: 'blur' }],
  sex: [{ required: true, message: '供应商性别不能为空', trigger: 'change' }],
  phone: [
    { required: true, message: '供应商手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }],
  idCardNumber: [{ required: true, message: '供应商身份证号不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '供应商状态不能为空', trigger: 'change' }]
}

function getList() {
  loading.value = true
  listSupplier({
    pageNo: queryParams.pageNo,
    pageSize: queryParams.pageSize,
    nickName: queryParams.nickName || undefined,
    phone: queryParams.phone || undefined,
    status: queryParams.status || undefined
  }).then(response => {
    supplierList.value = response.list || []
    total.value = response.total || 0
  }).finally(() => {
    loading.value = false
  })
}

function handleQuery() {
  queryParams.pageNo = 1
  getList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  queryParams.pageNo = 1
  getList()
}

function resetForm() {
  Object.assign(form, {
    supplierId: undefined,
    nickName: '',
    sex: '',
    phone: '',
    email: '',
    idCardNumber: '',
    status: '0',
    remark: ''
  })
  formRef.value?.clearValidate()
}

function handleAdd() {
  resetForm()
  dialogTitle.value = '新增供应商'
  dialogOpen.value = true
}

function handleUpdate(row) {
  resetForm()
  getSupplier(row.id).then(response => {
    Object.assign(form, {
      supplierId: response.id,
      nickName: response.nickName,
      sex: response.sex,
      phone: response.phone,
      email: response.email || '',
      idCardNumber: response.idCardNumber,
      status: response.status,
      remark: response.remark || ''
    })
    dialogTitle.value = '修改供应商'
    dialogOpen.value = true
  })
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid || submitting.value) {
    return
  }

  submitting.value = true
  try {
    if (form.supplierId) {
      await updateSupplier({ ...form })
      ElMessage.success('修改成功')
    } else {
      await addSupplier({ ...form })
      ElMessage.success('新增成功')
    }
    dialogOpen.value = false
    getList()
  } finally {
    submitting.value = false
  }
}

async function handleStatusChange(row, status) {
  const oldStatus = status === '0' ? '1' : '0'
  try {
    await ElMessageBox.confirm(
      `确认${status === '0' ? '启用' : '停用'}供应商「${row.nickName}」吗？`,
      '状态确认',
      {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }
    )
    await updateSupplierStatus(row.id, status)
    ElMessage.success(status === '0' ? '启用成功' : '停用成功')
  } catch {
    row.status = oldStatus
  }
}

function sexLabel(sex) {
  return selectDictLabel(sys_user_sex.value, sex) || '-'
}

onMounted(getList)
</script>
