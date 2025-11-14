import { create } from 'zustand'

type UserStore = {
  userData: UserData | null
  updateUserData: (data: UserData) => void
  setUserDataAndIsLoggedIn: (data: UserData) => void
  isLoggedIn: boolean
  setLogout: () => void
  seasons: FullSeasonData[]
  activeSeason: FullSeasonData | null
  setActiveSeason: (season: FullSeasonData) => void
  updateSeasons: (seassons: FullSeasonData[]) => void
  selectedFaconnierId: string
  setSelectedFaconnierId: (id: string) => void
  selectedBonId: string
  setSelectedBonId: (id: string) => void
  selectedClientId: string
  setSelectedClientId: (id: string) => void
  selectedClientBonId: string
  setSelectedClientBonId: (id: string) => void
  selectedStylistId: string
  setSelectedStylistId: (id: string) => void
  selectedStylistBonId: string
  setSelectedStylistBonId: (id: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  updateUserData: (data) => set((state) => ({ userData: { ...state.userData, ...data } })),
  setUserDataAndIsLoggedIn: (data) => set({ userData: data, isLoggedIn: true }),
  isLoggedIn: false,
  setLogout: () => set({ userData: null, isLoggedIn: false }),
  seasons: [],
  activeSeason: null,
  setActiveSeason: (season) => set({ activeSeason: season }),
  updateSeasons: (seassons) => set({ seasons: seassons }),
  selectedFaconnierId: '',
  setSelectedFaconnierId: (id) => set({ selectedFaconnierId: id }),
  selectedBonId: '',
  setSelectedBonId: (id) => set({ selectedBonId: id }),
  selectedClientId: '',
  setSelectedClientId: (id) => set({ selectedClientId: id }),
  selectedClientBonId: '',
  setSelectedClientBonId: (id) => set({ selectedClientBonId: id }),
  selectedStylistId: '',
  setSelectedStylistId: (id) => set({ selectedStylistId: id }),
  selectedStylistBonId: '',
  setSelectedStylistBonId: (id) => set({ selectedStylistBonId: id })
}))

type WorkerStore = {
  workerId: string
  setWorkerId: (id: string) => void
  workplaceId: string
  setWorkplaceId: (id: string) => void
  weekId: string
  setWeekId: (id: string) => void
  weekName: string | null
  setWeekName: (name: string | null) => void
  currentView: 'weekly' | 'yearly'
  setCurrentView: (view: 'weekly' | 'yearly') => void
  currentViewInWeekly: 'workers' | 'workplaces'
  setCurrentViewInWeekly: (view: 'workers' | 'workplaces') => void
}

export const useWorkerStore = create<WorkerStore>((set) => ({
  workerId: '',
  setWorkerId: (id) => set({ workerId: id }),
  workplaceId: '',
  setWorkplaceId: (id) => set({ workplaceId: id }),
  weekId: '',
  setWeekId: (id) => set({ weekId: id }),
  weekName: null,
  setWeekName: (name) => set({ weekName: name }),
  currentView: 'weekly',
  setCurrentView: (view) => set({ currentView: view }),
  currentViewInWeekly: 'workplaces',
  setCurrentViewInWeekly: (view) => set({ currentViewInWeekly: view })
}))

type YearStore = {
  workplaceId: string
  setWorkplaceId: (id: string) => void
  year: string | null
  setYear: (year: string | null) => void
}

export const useYearStore = create<YearStore>((set) => ({
  workplaceId: '',
  setWorkplaceId: (id) => set({ workplaceId: id }),
  year: null,
  setYear: (year) => set({ year: year })
}))

type ProductDialogState = {
  selectedProduct: Product | null
  openSheet: boolean
  openEdit: boolean
  openDelete: boolean
  openTransferFac: boolean
  openTransferClient: boolean
  openTransferStylist: boolean

  setProduct: (product: Product | null) => void
  open: (key: keyof ProductDialogState) => void
  close: (key: keyof ProductDialogState) => void
}

export const useProductStore = create<ProductDialogState>((set) => ({
  selectedProduct: null,
  openSheet: false,
  openEdit: false,
  openDelete: false,
  openTransferFac: false,
  openTransferClient: false,
  openTransferStylist: false,

  setProduct: (product) => set({ selectedProduct: product }),
  open: (key) => set({ [key]: true }),
  close: (key) => set({ [key]: false })
}))
