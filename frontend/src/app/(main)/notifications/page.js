"use client"

import React from "react"
import { motion } from "framer-motion"
import { BellOff } from "lucide-react"
import Header from "../stock/[symbol]/Header"
import Searchbar from "@/components/Searchbar"

function NotificationsPage() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center md:py-4">

          {/* Header */}
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          flex flex-col items-center text-center
          mt-10 
          rounded-2xl px-8 py-10
          backdrop-blur-md
          max-w-md w-full
        "
      >
        {/* Icon */}
        <div className="mb-4 p-4 rounded-full bg-zinc-800">
          <BellOff className="h-8 w-8 text-zinc-400" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-zinc-100">
          No Notifications Yet
        </h2>

        {/* Description */}
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          You're all caught up 🎉 <br />
          We’ll notify you when something important happens — like price alerts or updates.
        </p>

        {/* Optional Action */}
        <button
          className="
            mt-6 px-4 py-2 rounded-lg
            bg-indigo-500/80 text-white text-sm
            hover:bg-indigo-500 transition
          "
        >
          Explore Stocks
        </button>
      </motion.div>

    </div>
  )
}

export default NotificationsPage