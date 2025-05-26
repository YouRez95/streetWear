import { ACCOUNT, SERVICE_NAME } from '@shared/constants'
import keytar from 'keytar'

export const saveToken = async (token: string) => {
  await keytar.setPassword(SERVICE_NAME, ACCOUNT, token)
}

export const getToken = async () => {
  const token = await keytar.getPassword(SERVICE_NAME, ACCOUNT)
  return token
}

export const deleteToken = async () => {
  await keytar.deletePassword(SERVICE_NAME, ACCOUNT)
}
