import { useTheme } from '@renderer/hooks/useThemes'
import { cn } from '@renderer/lib/utils'
import Header from '../header'

export const AppLayout = ({ children, className, ...props }) => {
  return (
    <main className={cn('flex flex-row h-screen bg-muted', className)} {...props}>
      {children}
    </main>
  )
}

export const Sidebar = ({ className, children, ...props }) => {
  return (
    <aside className={cn('m-1', className)} {...props}>
      {children}
    </aside>
  )
}

export const Content = ({ children, className, ...props }) => (
  <div className={cn('flex-1 overflow-auto', className)} {...props}>
    {children}
  </div>
)

export const ContentHeader = ({ className, ...props }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={cn('flex w-full h-[80px]  rounded-xl', className)} {...props}>
      <Header />
    </div>
  )
}
