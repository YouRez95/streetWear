import Store from 'electron-store'

// Define your schema
export type StoreSchema = {
  user: UserData | null
  // add more keys as needed
}

const store = new Store<StoreSchema>()
type StoreKey = keyof StoreSchema

export const setToStore = <K extends StoreKey>(key: K, data: StoreSchema[K]) => {
  store.set(key, data)
}

export const getFromStore = <K extends StoreKey>(key: K): StoreSchema[K] => {
  return store.get(key)
}

export const removeFromStore = <K extends StoreKey>(key: K) => {
  store.delete(key)
}

export const clearStore = () => {
  store.clear()
}
