import { clientService } from '@renderer/services/clientService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from './use-toast'

export const queryKeys = {
  clients: (page: number, limit: number, search: string) => ['clients', page, limit, search],
  clientsRoot: ['clients']
}

function showErrorToast(title: string, error: any) {
  toast({
    title,
    description: error?.message || 'Something went wrong',
    variant: 'destructive'
  })
}

export function useClients(page: number, limit: number, search = '') {
  return useQuery({
    queryKey: queryKeys.clients(page, limit, search),
    queryFn: () => clientService.fetchClients(page, limit, search),
    refetchOnWindowFocus: false,
    retry: false
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: async (data) => {
      if (data.status === 'failed') {
        toast({
          title: 'Error creating client',
          description: data.message,
          variant: 'destructive'
        })
        return
      }
      toast({
        title: 'Client created successfully',
        description: data.message || 'Client has been created successfully.',
        variant: 'default'
      })
    },
    onError: (error) => showErrorToast('Error creating Client', error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientsRoot, exact: false })
    }
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: async (data) => {
      if (data.status === 'failed') {
        toast({
          title: 'Error deleting client',
          description: data.message,
          variant: 'destructive'
        })
        return
      }
      toast({
        title: 'Client deleted successfully',
        description: data.message || 'Client has been deleted successfully.',
        variant: 'default'
      })
    },
    onError: (error) => showErrorToast('Error deleting Client', error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientsRoot, exact: false })
    }
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: clientService.updateClient,
    onSuccess: async (data) => {
      if (data.status === 'failed') {
        toast({
          title: 'Error updating client',
          description: data.message,
          variant: 'destructive'
        })
        return
      }
      toast({
        title: 'Client updated successfully',
        description: data.message || 'Client has been updated successfully.',
        variant: 'default'
      })
    },
    onError: (error) => showErrorToast('Error updating Client', error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientsRoot, exact: false })
    }
  })
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: clientService.updateClientStatus,
    onSuccess: async (data) => {
      if (data.status === 'failed') {
        toast({
          title: 'Error updating client status',
          description: data.message,
          variant: 'destructive'
        })
        return
      }
      toast({
        title: 'Client status updated successfully',
        description: data.message || 'Client status has been updated successfully.',
        variant: 'default'
      })
    },
    onError: (error) => showErrorToast('Error updating Client status', error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientsRoot, exact: false })
    }
  })
}
