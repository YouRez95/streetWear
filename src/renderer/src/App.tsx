import { Button } from '@renderer/components/ui/button'
import { AppLayout, Content, Sidebar } from './components/AppLayout'

function App() {
  return (
    <AppLayout className="">
      <Sidebar className="bg-blue-500">Sidebar</Sidebar>
      <Content className="bg-slate-300 flex items-center justify-center flex-col">
        <Button variant={'ghost'}>ghost</Button>
        <Button variant={'outline'}>outline</Button>
        <Button variant={'default'}>secondary</Button>
        <Button variant={'destructive'}>destructive</Button>
      </Content>
    </AppLayout>
  )
}

export default App
