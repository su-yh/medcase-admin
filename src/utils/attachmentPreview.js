const PREVIEW_TYPES = {
  image: new Set(['gif', 'jpeg', 'jpg', 'png', 'webp']),
  pdf: new Set(['pdf']),
  docx: new Set(['docx']),
  excel: new Set(['xls', 'xlsx']),
  pptx: new Set(['pptx']),
  text: new Set(['txt'])
}

export function getAttachmentExtension(attachment) {
  const name = attachment?.originalFilename || attachment?.filePath || ''
  const fileName = name.split(/[?#]/)[0].split('/').pop() || ''
  const extensionIndex = fileName.lastIndexOf('.')
  if (extensionIndex <= 0 || extensionIndex === fileName.length - 1) {
    return ''
  }
  return fileName.slice(extensionIndex + 1).toLowerCase()
}

export function getAttachmentPreviewType(attachment) {
  const extension = getAttachmentExtension(attachment)
  for (const [previewType, extensions] of Object.entries(PREVIEW_TYPES)) {
    if (extensions.has(extension)) {
      return previewType
    }
  }
  return 'download'
}
