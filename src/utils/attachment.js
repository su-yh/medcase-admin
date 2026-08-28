import adminRequest from '@/utils/adminRequest'

export function fetchAttachmentBlob(attachment, requestClient = adminRequest) {
  const filePath = attachment?.filePath
  if (!filePath) {
    return Promise.resolve(null)
  }

  const params = { filePath }
  if (attachment.originalFilename) {
    params.originalFilename = attachment.originalFilename
  }

  return requestClient({
    url: '/file/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export async function downloadAttachment(
  attachment,
  {
    requestClient = adminRequest,
    documentObject = typeof document !== 'undefined' ? document : null,
    urlObject = typeof URL !== 'undefined' ? URL : null
  } = {}
) {
  const filePath = attachment?.filePath
  if (!filePath) {
    return
  }

  const blob = await fetchAttachmentBlob(attachment, requestClient)
  if (!blob || !documentObject || !urlObject) {
    return
  }

  const objectUrl = urlObject.createObjectURL(blob)
  const anchor = documentObject.createElement('a')
  anchor.href = objectUrl
  anchor.download = attachment.originalFilename || filePath.split('/').pop() || '附件'
  documentObject.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  urlObject.revokeObjectURL(objectUrl)
}
