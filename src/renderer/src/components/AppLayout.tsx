import { cn } from '@renderer/lib/utils'

export const AppLayout = ({ children, className, ...props }) => {
  return (
    <main className={cn('flex flex-row h-screen', className)} {...props}>
      {children}
    </main>
  )
}

export const Sidebar = ({ className, children, ...props }) => {
  return (
    <aside className={cn('w-[250px] h-screen overflow-auto', className)} {...props}>
      {children}
    </aside>
  )
}

export const Content = ({ children, className, ...props }) => (
  <div className={cn('flex-1 overflow-auto', className)} {...props}>
    {children}
  </div>
)
