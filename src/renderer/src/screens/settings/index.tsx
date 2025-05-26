import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { queryKeys as queryKeysClient } from '@renderer/hooks/useClients'
import { queryKeys as queryKeysFaconnier } from '@renderer/hooks/useFaconnier'
import { queryKeys } from '@renderer/hooks/useUsers'
import { clientService } from '@renderer/services/clientService'
import { faconnierService } from '@renderer/services/faconnierService'
import { userService } from '@renderer/services/userService'
import { useUserStore } from '@renderer/store'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import TabClients from './clientSettings/TabClients'
import TabFaconniers from './faconnierSettings/TabFaconniers'
import TabSeasons from './seasonSettings/TabSeasons'
import SettingsHeader from './SettingsHeader'
import TabUsers from './userSettings/TabUsers'

export default function Settings() {
  const { userData } = useUserStore()
  const queryClient = useQueryClient()

  const TabsListItems = [
    { id: 'Users', name: 'Utilisateurs', content: <TabUsers /> },
    { id: 'Faconniers', name: 'Faconniers', content: <TabFaconniers /> },
    { id: 'Clients', name: 'Clients', content: <TabClients /> },
    { id: 'Tailors', name: 'Tailleurs', content: <div>Tailleurs</div> },
    { id: 'Seasons', name: 'Saisons', content: <TabSeasons /> }
  ].filter((tab) => !(userData?.role === 'admin' && tab.id === 'Users'))

  // Prefetch data for all tabs when component mounts
  useEffect(() => {
    // Prefetch Users data
    console.log('Prefetching Users data')
    queryClient.prefetchQuery({
      queryKey: queryKeys.users(1, 10, ''),
      queryFn: () => userService.fetchUsers(1, 10, ''),
      staleTime: 30000 // 30 seconds
    })

    queryClient.prefetchQuery({
      queryKey: queryKeysFaconnier.faconniers(1, 10, ''),
      queryFn: () => faconnierService.fetchFaconniers(1, 10, ''),
      staleTime: 30000 // 30 seconds
    })

    queryClient.prefetchQuery({
      queryKey: queryKeysClient.clients(1, 10, ''),
      queryFn: () => clientService.fetchClients(1, 10, ''),
      staleTime: 30000 // 30 seconds
    })
  }, [queryClient])

  return (
    <section className="w-full h-full flex flex-col gap-10">
      <SettingsHeader />

      <div className="text-background flex-1 relative">
        <Tabs defaultValue={TabsListItems[0]?.id} className="space-y-8 flex flex-col h-full">
          <TabsList className="bg-transparent gap-7 text-background rounded-none w-full justify-start border-b border-b-background/20">
            {TabsListItems.map((item) => (
              <TabsTrigger
                key={item.id}
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-[3px] border-b-background rounded-none data-[state=active]:font-bold text-lg data-[state=active]:text-background data-[state=active]:shadow-none "
                value={item.id}
              >
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {TabsListItems.map((item) => (
            <TabsContent
              key={item.id}
              value={item.id}
              className="bg-foreground text-background rounded-xl border flex-1 p-7 space-y-10"
            >
              {item.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
