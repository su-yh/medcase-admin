import test from 'node:test'
import assert from 'node:assert/strict'
import { getAttachmentExtension, getAttachmentPreviewType } from './attachmentPreview.js'

test('identifies attachment extensions from the original filename first', () => {
  assert.equal(
    getAttachmentExtension({
      filePath: 'case/20260828/file.bin',
      originalFilename: '病例报告.PDF'
    }),
    'pdf'
  )
})

test('maps supported formats and legacy office files consistently', () => {
  assert.equal(getAttachmentPreviewType({ originalFilename: 'photo.jpg' }), 'image')
  assert.equal(getAttachmentPreviewType({ originalFilename: 'report.pdf' }), 'pdf')
  assert.equal(getAttachmentPreviewType({ originalFilename: 'report.docx' }), 'docx')
  assert.equal(getAttachmentPreviewType({ originalFilename: 'report.xlsx' }), 'excel')
  assert.equal(getAttachmentPreviewType({ originalFilename: 'slides.pptx' }), 'pptx')
  assert.equal(getAttachmentPreviewType({ originalFilename: 'report.doc' }), 'download')
  assert.equal(getAttachmentPreviewType({ originalFilename: 'slides.ppt' }), 'download')
})
