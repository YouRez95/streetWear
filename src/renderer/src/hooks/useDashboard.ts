import { dashboardService } from '@renderer/services/dashboardService'
import { useQuery } from '@tanstack/react-query'
import { toast } from './use-toast'

export const queryKeys = {
  generalSettings: ['generalSettings']
}

function showErrorToast(title: string, error: any) {
  toast({
    title,
    description: error?.message || 'Something went wrong',
    variant: 'destructive'
  })
}

export function useGeneralSettings() {
  return useQuery({
    queryKey: queryKeys.generalSettings,
    queryFn: dashboardService.getGeneralSettings,
    refetchOnWindowFocus: false,
    retry: false
  })
}
