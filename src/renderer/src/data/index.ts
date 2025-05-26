import clients from '../assets/icons/client-icon.svg'
import dashboard from '../assets/icons/dashboard-icon.svg'
import producers from '../assets/icons/producer-icon-1.svg'
import products from '../assets/icons/products-icon.svg'

export const navbarItems = [
  {
    id: 1,
    text: 'dashboard',
    link: '/',
    icon: dashboard
  },
  {
    id: 2,
    text: 'products',
    link: '/products',
    icon: products
  },
  {
    id: 3,
    text: 'faconniers',
    link: '/producers',
    icon: producers
  },
  {
    id: 4,
    text: 'clients',
    link: '/clients',
    icon: clients
  }
]
