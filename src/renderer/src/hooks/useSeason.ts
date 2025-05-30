import { seasonService } from '@renderer/services/seasonService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from './use-toast'

export const queryKeys = {
  seasons: (page: number, limit: number, search: string) => ['seasons', page, limit, search],
  seasonRoot: ['seasons']
}

function showErrorToast(title: string, error: any) {
  toast({
    title,
    description: error?.message || 'Something went wrong',
    variant: 'destructive'
  })
}

export function useSeasons(page: number, limit: number, search = '') {
  return useQuery({
    queryKey: queryKeys.seasons(page, limit, search),
    queryFn: () => seasonService.fetchSeasons(page, limit, search),
    refetchOnWindowFocus: false,
    retry: false
  })
}

export function useCreateSeason() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: seasonService.createSeason,
    onSuccess: async (data) => {
      if (data.status === 'failed') {
        toast({
          title: 'Error creating season',
          description: data.message,
          variant: 'destructive'
        })
        return
      }
      toast({
        title: 'Season created successfully',
        description: data.message || 'Season has been created successfully.',
        variant: 'default'
      })
    },
    onError: (error) => showErrorToast('Error creating seasons', error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.seasonRoot, exact: false })
    }
  })
}

export function useUpdateSeason() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: seasonService.updateSeason,
    onSuccess: async (data) => {
      if (data.status === 'failed') {
        toast({
          title: 'Error updating season',
          description: data.message,
          variant: 'destructive'
        })
        return
      }
      toast({
        title: 'Season updated successfully',
        description: data.message || 'Season has been updated successfully.',
        variant: 'default'
      })
    },
    onError: (error) => showErrorToast('Error updating seasons', error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.seasonRoot, exact: false })
      queryClient.invalidateQueries({ queryKey: queryKeys.seasons(1, 4, ''), exact: true })
    }
  })
}

export function useDeleteSeason() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: seasonService.deleteSeason,
    onSuccess: async (data) => {
      if (data.status === 'failed') {
        toast({
          title: 'Error deleting season',
          description: data.message,
          variant: 'destructive'
        })
        return
      }
      toast({
        title: 'Season deleted successfully',
        description: data.message || 'Season has been deleted successfully.',
        variant: 'default'
      })
    },
    onError: (error) => showErrorToast('Error deleting seasons', error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.seasonRoot, exact: false })
    }
  })
}
