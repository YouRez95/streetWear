import { useEffect, useState } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Force light mode on mount
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)

    document.documentElement.classList.remove(theme)
    document.documentElement.classList.add(newTheme)
  }

  return { theme, toggleTheme }
}
