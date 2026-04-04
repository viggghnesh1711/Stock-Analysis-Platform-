"use client"

import React from 'react'
import Header from '../stock/[symbol]/Header'
import Searchbar from '@/components/Searchbar'
import { motion } from "framer-motion"
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Listwatch from './Listwatch'

function Page() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  if (!isLoaded) return null

  return (
    <div className="h-screen text-zinc-100 overflow-hidden md:py-4">
      
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full"
      >
        <Header />
      </motion.div>
  
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="w-full py-6 md:hidden"
      >
        <Searchbar />
      </motion.div>

      <div className=" md:mt-0 md:flex items-center justify-center h-full">
        {!isSignedIn ? (
          <div className="text-center space-y-4 mt-40 md:0">
            <h2 className="text-xl font-semibold">
              🔐 Login to view your Watchlist
            </h2>
            <p className="text-zinc-400 text-sm">
              Track your favorite stocks and never miss updates 📈
            </p>

            <button
              onClick={() =>
                router.push('/sign-in?redirect_url=/watchlist')
              }
              className="mt-2 px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
            >
              Sign In 🚀
            </button>
          </div>
        ) : (
          <div className="h-full w-full ">
          <Listwatch/>
          </div>
        )}
      </div>

    </div>
  )
}

export default Page