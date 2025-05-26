import { AppWrapper } from '@renderer/components/layouts/AppWrapper'
import Clients from '@renderer/screens/clients'
import Dashboard from '@renderer/screens/dashboard'
import Producer from '@renderer/screens/producer'
import Products from '@renderer/screens/products'
import Settings from '@renderer/screens/settings'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './assets/main.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute as default stale time
      gcTime: 5 * 60 * 1000 // 5 minutes as default cache time
    }
  }
})
const router = createHashRouter([
  {
    path: '/',
    element: <AppWrapper />,
    children: [
      {
        element: <App />,
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: '/products',
            element: <Products />
          },
          {
            path: '/producers',
            element: <Producer />
          },
          {
            path: '/clients',
            element: <Clients />
          },
          {
            path: '/settings',
            element: <Settings />
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
