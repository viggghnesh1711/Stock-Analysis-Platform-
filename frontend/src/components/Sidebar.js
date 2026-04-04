'use client'

import { Home, Eye, BarChart3, Settings, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Insights', icon: BarChart3, path: '/insights' },
  { label: 'Watchlist', icon: Eye, path: '/watchlist' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const { user, isSignedIn, isLoaded } = useUser()
  const { signOut } = useClerk()

  return (
    <>

      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="
          relative hidden md:flex h-screen w-64 flex-col
          bg-stone-900/60 backdrop-blur-xl
          border-r border-zinc-800
        "
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[2px]
          bg-gradient-to-b from-indigo-400/60 via-indigo-400/20 to-transparent"
        />

        {/* Logo */}
        <div className="px-6 py-6 border-b border-zinc-800">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Stockly<span className="text-zinc-500">.io</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-8 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={pathname === item.path}
              onClick={() => router.push(item.path)}
            />
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-zinc-800">
          {isLoaded && (
            <div className="flex flex-col gap-3">
              
              {/* Profile Info */}
              <div className="flex items-center gap-3 w-full rounded-lg px-3 py-2">
                <div className="h-8 w-8 rounded-md bg-stone-800 flex items-center justify-center">
                  {/* 🔥 KEEPING STATIC ICON */}
                  <User className="h-4 w-4 text-zinc-300" />
                </div>

                <div className="text-left leading-tight">
                  <p className="text-xs text-zinc-400">
                    {isSignedIn ? 'Welcome back 👋' : 'Hello 👋'}
                  </p>
                  <p className="text-sm text-zinc-100 font-medium">
                    {isSignedIn ? user?.firstName : 'Guest'}
                  </p>
                </div>
              </div>

              {isSignedIn ? (
                <button
                  onClick={() =>
                    signOut(() => router.push('/dashboard'))
                  }
                  className="w-full rounded-md px-3 py-2 text-sm bg-stone-800/60 text-zinc-100 hover:bg-stone-800 transition"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() =>
                    router.push('/sign-in?redirect_url=/dashboard')
                  }
                  className="w-full rounded-md px-3 py-2 text-sm bg-indigo-500/80 text-white hover:bg-indigo-500 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </motion.aside>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="
          fixed bottom-0 left-0 right-0 z-50
          md:hidden
          mx-3 mb-3
          bg-stone-950/40
          backdrop-blur-3xl
          border border-white/5
          rounded-2xl
          shadow-[0_8px_30px_rgba(0,0,0,0.6)]
        "
      >
        <div className="flex items-center justify-around py-5">
          {NAV_ITEMS.map((item) => (
            <MobileItem
              key={item.path}
              icon={item.icon}
              onClick={() => router.push(item.path)}
            />
          ))}
        </div>
      </motion.div>
    </>
  )
}

function NavItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 w-full
        rounded-md px-3 py-2 text-sm transition-colors
        ${
          active
            ? 'bg-stone-800/60 text-zinc-100'
            : 'text-zinc-400 hover:bg-stone-800/40 hover:text-zinc-100'
        }
      `}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 bg-indigo-400" />
      )}
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function MobileItem({ icon: Icon, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.85 }}
      className="flex flex-col items-center gap-1 text-zinc-400"
    >
      <Icon className="h-6 w-6" />
    </motion.button>
  )
}