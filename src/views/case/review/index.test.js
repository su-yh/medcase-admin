import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const source = readFileSync(
  fileURLToPath(new URL('./index.vue', import.meta.url)),
  'utf8'
)

test('exposes case attachments in the review table', () => {
  assert.match(
    source,
    /<el-table-column[\s\S]*?label="附件"[\s\S]*?min-width="240"[\s\S]*?openAttachmentPreview\(attachment\)/
  )
})
