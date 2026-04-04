"use client"

import Searchbar from '@/components/Searchbar'
import { Bell, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUser ,UserButton } from '@clerk/nextjs'
import { useEffect } from 'react'
import { saveUserToDB } from '@/app/actions/saveUser'

export default function Header() {
  const router = useRouter()
  const { user, isSignedIn, isLoaded } = useUser()

  // 🔥 save user after login
  useEffect(() => {
    if (!isLoaded || !user) return

    saveUserToDB({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.firstName,
    })
  }, [user, isLoaded])

  const handleProfileClick = () => {
    if (!isSignedIn) {
      router.push('/sign-in?redirect_url=/dashboard')
    } else {
      router.push('/settings')
    }
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="
        sticky top-0 z-40
        w-full h-16
        flex items-center justify-between
        px-4 md:px-6
        bg-stone-950 backdrop-blur-xl
        border-b border-zinc-800/60
      "
    >

      <div className="flex items-center gap-3">

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => router.back()}
          className="
            p-2 rounded-md
            text-zinc-400
            hover:text-zinc-100 hover:bg-stone-800/60
            transition
          "
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        <div className="md:hidden">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            Stockly<span className="text-zinc-500">.io</span>
          </h1>
        </div>
      </div>

      <div className="hidden md:block w-full max-w-md">
        <Searchbar />
      </div>

      <div className="flex items-center gap-2">

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => router.push('/notifications')}
          className="
            relative p-2 rounded-md
            text-zinc-400
            hover:text-zinc-100 hover:bg-stone-800/60
            transition
          "
        >
          <Bell className="h-5 w-5" />

          {/* 🔴 Notification Dot */}
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </motion.button>


        <button
          onClick={handleProfileClick}
          className="
            ml-1 md:ml-2 flex items-center gap-2
            rounded-md px-2 py-1.5
            hover:bg-stone-800/60
            transition 
          "
        >
          <img
            src={
              isSignedIn
                ? user?.imageUrl
                : 'https://i.pravatar.cc/40'
            }
            alt="profile"
            className="h-7 w-7 rounded-full"
          />
        </button>

      </div>
    </motion.header>
  )
}