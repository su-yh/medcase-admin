<template>
  <el-dialog title="审计日志详细" v-model="dialogVisible" width="780px" append-to-body @close="$emit('update:visible', false)">
    <div class="detail-wrap">
      <div class="detail-card">
        <div class="detail-card-title"><el-icon><InfoFilled /></el-icon> 基本信息</div>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">日志编号</span><span class="detail-value">{{ form.id }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">操作名称</span><span class="detail-value">{{ form.operation }}</span></div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">操作时间</span><span class="detail-value">{{ form.created }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">请求方法</span><span class="detail-value">{{ form.reqMethod }}</span></div>
          </el-col>
        </el-row>
      </div>

      <div class="detail-card">
        <div class="detail-card-title"><el-icon><User /></el-icon> 操作人员</div>
        <el-row class="detail-row">
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">用户ID</span><span class="detail-value">{{ form.userId }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="detail-item"><span class="detail-label">用户名称</span><span class="detail-value">{{ form.userNickname }}</span></div>
          </el-col>
        </el-row>
        <el-row class="detail-row">
          <el-col :span="24">
            <div class="detail-item"><span class="detail-label">Trace ID</span><span class="detail-value mono">{{ form.traceId }}</span></div>
          </el-col>
        </el-row>
      </div>

      <div class="detail-card">
        <div class="detail-card-title"><el-icon><Sort /></el-icon> 请求信息</div>
        <el-row class="detail-row">
          <el-col :span="24">
            <div class="detail-item"><span class="detail-label">请求地址</span><span class="detail-value"><span :class="'method-tag method-' + form.reqMethod">{{ form.reqMethod }}</span> {{ form.reqPath }}</span></div>
          </el-col>
        </el-row>
      </div>

      <div class="detail-card">
        <div class="detail-card-title"><el-icon><Upload /></el-icon> 请求参数</div>
        <div class="code-body">
          <div class="code-wrap">
            <div class="code-action">
              <el-button size="small" :icon="CopyDocument" @click="copyText(form.reqArgument)">复制</el-button>
            </div>
            <pre class="code-pre">{{ formatJson(form.reqArgument) }}</pre>
          </div>
        </div>
      </div>

      <div class="detail-card">
        <div class="detail-card-title"><el-icon><Download /></el-icon> 结果明细</div>
        <div class="code-body">
          <div class="code-wrap">
            <div class="code-action">
              <el-button size="small" :icon="CopyDocument" @click="copyText(form.resultDetail)">复制</el-button>
            </div>
            <pre class="code-pre">{{ formatJson(form.resultDetail) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  row: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit('update:visible', value),
})

const form = computed(() => props.row || {})

function formatJson(value) {
  if (!value) return '（无数据）'
  try { return JSON.stringify(JSON.parse(value), null, 2) } catch { return value }
}

function copyText(value) {
  const text = formatJson(value)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => ElMessage({ message: '已复制', type: 'success', duration: 1500 }))
    return
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  ElMessage({ message: '已复制', type: 'success', duration: 1500 })
}
</script>
