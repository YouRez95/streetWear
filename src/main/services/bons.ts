import apiClient from '@/utils/apiClient'
import { dialog } from 'electron'
import fs from 'fs'

export async function downloadBon(buffer: ArrayBuffer, defaultName: string, extension = 'pdf') {
  let filters: Electron.SaveDialogOptions['filters'] = []
  if (extension === 'pdf') {
    filters = [{ name: 'PDF File', extensions: ['pdf'] }]
  } else if (extension === 'xlsx') {
    filters = [{ name: 'Excel File', extensions: ['xlsx'] }]
  } else {
    throw new Error('Invalid extension')
  }

  const { filePath } = await dialog.showSaveDialog({
    defaultPath: defaultName,
    filters: filters
  })
  if (filePath) {
    fs.writeFileSync(filePath, Buffer.from(buffer))
  }
}

export async function downloadExcelBon(bonId: string, type: 'faconnier' | 'stylist' | 'client') {
  try {
    const result = await apiClient.get(`/api/v1/${type}/bon/download/${bonId}`, {
      responseType: 'arraybuffer'
    })
    await downloadBon(result.data, `bon-${bonId}.xlsx`, 'xlsx')
  } catch (error) {
    console.error('Error downloading excel bon:', error)
    throw error
  }
}
