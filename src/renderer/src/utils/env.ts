export function getEnv(key: string, defaultValue?: string): string {
  const env = import.meta.env
  const value = env[key as keyof typeof env]

  if (value !== undefined) return value
  if (defaultValue !== undefined) return defaultValue

  throw new Error(`Environment variable "${key}" is not defined and no default value provided.`)
}

export const apiUrl = getEnv('VITE_API_URL', 'http://localhost:3000')
