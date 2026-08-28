<template>
  <el-dialog
    v-model="visible"
    :title="attachmentName"
    width="min(92vw, 1100px)"
    top="4vh"
    append-to-body
    destroy-on-close
    class="attachment-preview-dialog"
    @closed="resetPreview"
  >
    <div v-loading="loading" class="attachment-preview">
      <div v-if="errorMessage" class="preview-fallback">
        <el-empty :description="errorMessage" />
        <el-button type="primary" :icon="Download" @click="handleDownload">
          下载附件
        </el-button>
      </div>

      <el-image
        v-else-if="previewType === 'image' && previewUrl"
        :src="previewUrl"
        fit="contain"
        class="image-preview"
        :preview-src-list="[previewUrl]"
      />

      <component
        :is="previewComponent"
        v-else-if="previewComponent && previewSource"
        :src="previewSource"
        class="office-preview"
        @error="handlePreviewError"
      />

      <pre v-else-if="previewType === 'text' && textContent !== null" class="text-preview">{{ textContent }}</pre>

      <div v-else-if="!loading" class="preview-fallback">
        <el-empty description="该格式暂不支持在线预览" />
        <el-button type="primary" :icon="Download" @click="handleDownload">
          下载附件
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, defineAsyncComponent, onBeforeUnmount, ref, watch } from 'vue'
import { ElImage, ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'
import { downloadAttachment, fetchAttachmentBlob } from '@/utils/attachment'
import { getAttachmentPreviewType } from '@/utils/attachmentPreview'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  attachment: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const previewComponents = {
  docx: defineAsyncComponent(() => import('@vue-office/docx')),
  excel: defineAsyncComponent(() => import('@vue-office/excel')),
  pdf: defineAsyncComponent(() => import('@vue-office/pdf')),
  pptx: defineAsyncComponent(() => import('@vue-office/pptx'))
}
const loading = ref(false)
const errorMessage = ref('')
const previewType = ref('download')
const previewSource = ref(null)
const previewUrl = ref('')
const textContent = ref(null)
let requestSequence = 0

const attachmentName = computed(() => (
  props.attachment?.originalFilename
  || props.attachment?.filePath?.split('/').pop()
  || '附件预览'
))
const previewComponent = computed(() => previewComponents[previewType.value] || null)

watch(
  () => [props.modelValue, props.attachment],
  ([isVisible, attachment]) => {
    if (isVisible && attachment?.filePath) {
      loadPreview(attachment)
    } else if (!isVisible) {
      resetPreview()
    }
  },
  { immediate: true }
)

async function loadPreview(attachment) {
  const sequence = ++requestSequence
  clearPreview()
  previewType.value = getAttachmentPreviewType(attachment)
  if (previewType.value === 'download') {
    return
  }
  loading.value = true

  try {
    const blob = await fetchAttachmentBlob(attachment)
    if (sequence !== requestSequence || !blob) {
      return
    }

    if (previewType.value === 'image') {
      previewUrl.value = URL.createObjectURL(blob)
    } else if (previewType.value === 'text') {
      textContent.value = await blob.text()
    } else {
      previewSource.value = blob
    }
  } catch (error) {
    if (sequence === requestSequence) {
      errorMessage.value = error.message || '附件预览失败，请下载后查看'
    }
  } finally {
    if (sequence === requestSequence) {
      loading.value = false
    }
  }
}

function clearPreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  previewSource.value = null
  textContent.value = null
  errorMessage.value = ''
}

function resetPreview() {
  requestSequence += 1
  loading.value = false
  clearPreview()
  previewType.value = 'download'
}

function handlePreviewError() {
  errorMessage.value = '附件预览失败，请下载后查看'
  previewSource.value = null
}

async function handleDownload() {
  try {
    await downloadAttachment(props.attachment)
  } catch (error) {
    ElMessage.error(error.message || '附件下载失败')
  }
}

onBeforeUnmount(resetPreview)
</script>

<style scoped>
.attachment-preview {
  min-height: 420px;
  max-height: 78vh;
  overflow: auto;
}

.image-preview {
  display: block;
  width: 100%;
  min-height: 420px;
  max-height: 72vh;
}

.office-preview {
  display: block;
  width: 100%;
  height: 72vh;
  min-height: 420px;
}

.text-preview {
  min-height: 420px;
  margin: 0;
  padding: 16px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid var(--el-border-color);
  background: var(--el-fill-color-lighter);
  font: inherit;
  line-height: 1.6;
}

.preview-fallback {
  display: flex;
  min-height: 420px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
}
</style>
