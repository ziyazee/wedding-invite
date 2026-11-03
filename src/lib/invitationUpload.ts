export const invitationUploadAccept = '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp'

export function invitationUploadMimeType(file: File): string {
  const types: Record<string, string> = { pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }
  const mimeType = file.type && file.type !== 'application/octet-stream'
    ? file.type
    : types[file.name.split('.').pop()?.toLowerCase() || '']
  if (!Object.values(types).includes(mimeType)) throw new Error('Choose a PDF, JPG, PNG, or WebP invitation.')
  if (!file.size) throw new Error('This file is empty. Choose another invitation.')
  const limitMB = mimeType === 'application/pdf' ? 20 : 5
  if (file.size > limitMB * 1024 * 1024) throw new Error(`Choose ${mimeType === 'application/pdf' ? 'a PDF under 20 MB' : 'an image under 5 MB'}.`)
  return mimeType
}
