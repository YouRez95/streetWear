export const getMimeTypeFromFileName = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''

  // Ensure the file has a valid extension
  if (!ext || ext === fileName) return 'application/octet-stream'

  const mimeTypes: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp'
  }

  // Return the MIME type or default to 'application/octet-stream'
  return mimeTypes[ext] || 'application/octet-stream'
}
