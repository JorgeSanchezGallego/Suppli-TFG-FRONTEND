import { Outlet, ScrollRestoration } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import AvisoCookies from './AvisoCookies.jsx'

export default function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AvisoCookies />
      <ScrollRestoration />
    </div>
  )
}
