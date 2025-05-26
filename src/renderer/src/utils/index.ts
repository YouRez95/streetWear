import defaultProductImage from '@/assets/placeholder-image/default-product.webp'
import defaultImage from '@/assets/placeholder-image/default-user.png'
import { apiUrl } from './env'

export const getImageUrl = (imageUrl: string | null | undefined, type = 'user'): string => {
  const DEFAULT_IMAGE = type === 'user' ? defaultImage : defaultProductImage
  if (imageUrl && imageUrl.trim()) {
    return `${apiUrl}/${imageUrl.trim()}`
  }
  return DEFAULT_IMAGE
}

export function formatIndex(index: number): string {
  return index < 9 ? `0${index + 1}` : `${index + 1}`
}

export function getPaginationPages(current: number, total: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []

  const addPage = (page: number) => {
    if (!pages.includes(page)) pages.push(page)
  }

  addPage(1)
  if (total >= 2) addPage(2)

  if (current > 4) pages.push('ellipsis')

  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 2 && i < total - 1) addPage(i)
  }

  if (current < total - 3) pages.push('ellipsis')

  if (total - 1 > 2) addPage(total - 1)
  if (total > 1) addPage(total)

  return pages
}

export function formatDateToDDMMYYYY(dateInput: string | Date): string {
  const date = new Date(dateInput)

  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

type FormData = {
  name: string
  email: string
  password?: string
  confirmPassword?: string
  phone?: string
  address?: string
  imageUrl?: string
  role?: string
  id?: string | number
  skipPasswordValidation?: boolean
}

export function validateUserForm(formData: FormData): string | null {
  if (!formData.name || formData.name.trim() === '') {
    return 'Name is required.'
  }

  if (!formData.email || formData.email.trim() === '') {
    return 'Email is required.'
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(formData.email)) {
    return 'Please enter a valid email address.'
  }

  const isUpdateOperation =
    formData.skipPasswordValidation ||
    (formData.id !== undefined && !formData.password && !formData.confirmPassword)

  if (isUpdateOperation && !formData.password && !formData.confirmPassword) {
    return null
  }

  if (!isUpdateOperation || (formData.password && formData.password.length > 0)) {
    if (!formData.password) {
      return 'Password is required.'
    }

    if (formData.password.length < 5) {
      return 'Password must be at least 5 characters long.'
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.'
    }
  }

  // All validations passed
  return null
}

export function validateProductForm(formData: CreateProductInput): string | null {
  if (!formData.reference || formData.reference.trim() === '') {
    return 'Reference is required.'
  }

  if (!formData.name || formData.name.trim() === '') {
    return 'Name is required.'
  }

  if (!formData.type || formData.type.trim() === '') {
    return 'Type is required.'
  }

  if (!formData.totalQty || formData.totalQty <= 0) {
    return 'Total quantity is required.'
  }

  return null
}

// This function removes empty/null/undefined values from an object
export function removeEmptyValues<T extends object>(obj: T): T {
  const result = {} as T

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      result[key as keyof T] = value as any
    }
  }

  return result
}
