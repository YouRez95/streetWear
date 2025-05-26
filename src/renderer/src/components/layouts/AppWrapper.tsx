import Login from '@renderer/screens/login'
import { useUserStore } from '@renderer/store'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LoadingSuspense } from '../loading'

export const AppWrapper = () => {
  // TODO: add a login logic
  const { isLoggedIn, setUserDataAndIsLoggedIn, setLogout } = useUserStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userData = await window.context.getFromStore('user')
      console.log('userData from store', userData)
      if (userData) {
        setUserDataAndIsLoggedIn(userData)
      }
    }
    checkLoginStatus()
    setLoading(false)

    // if (data?.status === 'success') {
    //   updateSeasons(data.seasons)
    //   setActiveSeason(data.seasons[0])
    // }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSuspense />
      </div>
    )
  }

  return isLoggedIn ? <Outlet /> : <Login />
}
