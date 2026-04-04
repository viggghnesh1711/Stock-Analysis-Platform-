"use client"

import React, { useState } from "react"
import Header from "../stock/[symbol]/Header"
import { motion, AnimatePresence } from "framer-motion"
import { useUser, UserButton, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Searchbar from "@/components/Searchbar"
import toast from "react-hot-toast"

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-zinc-800 py-3">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-medium">{question}</span>
        <span className="text-zinc-400 text-lg">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SettingsPage() {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="min-h-screen text-zinc-100 no-scrollbar scrollbar-hidden md:py-4">

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
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

      {/* Content */}
      <div className="w-full mx-auto px-3  md:px-6 py-10 space-y-6">

        {/* Title */}
        <h1 className="text-2xl font-semibold tracking-tight">
          Settings
        </h1>

        {/* Profile Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Profile</h2>

          {isSignedIn ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Name</p>
                <p className="font-medium">{user.fullName}</p>

                <p className="text-sm text-zinc-400 mt-2">Email</p>
                <p className="font-medium">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>

             
              <UserButton afterSignOutUrl="/dashboard" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-zinc-400">You are not logged in</p>

              <button
                onClick={() =>
                  router.push("/sign-in?redirect_url=/settings")
                }
                className="rounded-md px-3 py-2 text-sm bg-indigo-500/80 text-white hover:bg-indigo-500 transition"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">FAQ</h2>

          <FAQItem
            question="Is this app only for Indian stock market?"
            answer="Yes, currently Stockly focuses on Indian stock market data. Support for global markets may be added in future updates."
            isOpen={openIndex === 0}
            onClick={() => setOpenIndex(openIndex === 0 ? null : 0)}
          />

          <FAQItem
            question="Is the stock data real-time?"
            answer="No, the data is not real-time. It is delayed (usually by one day) and is intended for analysis and learning purposes only."
            isOpen={openIndex === 1}
            onClick={() => setOpenIndex(openIndex === 1 ? null : 1)}
          />

          <FAQItem
            question="Can I use this app for trading decisions?"
            answer="Stockly is designed for tracking, analysis, and learning. It should not be used as the sole source for making real trading decisions."
            isOpen={openIndex === 2}
            onClick={() => setOpenIndex(openIndex === 2 ? null : 2)}
          />
        </div>

        
        {isSignedIn && (
          <div className="bg-red-950 border border-red-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-4 text-red-400">
              Danger Zone
            </h2>

            <button 
            onClick={async () =>
                    await signOut({ redirectUrl: '/settings' })
                  }
                  className="px-4 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-500">
              Logout
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default SettingsPage