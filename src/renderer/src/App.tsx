import { AppLayout, Content, ContentHeader, Sidebar } from '@renderer/components/layouts/AppLayout'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { Toaster } from './components/ui/toaster'
import { useUserStore } from './store'

function App() {
  const { setLogout } = useUserStore()

  useEffect(() => {
    if (window.context?.onForceLogout) {
      window.context.onForceLogout(async () => {
        console.log('Force logout triggered')
        setLogout()
        await window.context.logoutUser()
      })
    }
  }, [])

  return (
    <AppLayout className="">
      <Sidebar className="flex flex-col items-center justify-center">
        <Navbar />
      </Sidebar>
      <Content className="flex items-center justify-center flex-col m-2 mb-4 gap-2">
        <ContentHeader className="" />
        <Outlet />
      </Content>
      <Toaster />
    </AppLayout>
  )
}

export default App
