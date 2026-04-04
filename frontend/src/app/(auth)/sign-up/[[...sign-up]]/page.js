'use client'

import { SignUp } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 text-zinc-100 relative overflow-hidden">

      {/* 🔥 Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full" />
      </div>

      {/* 🔥 Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          relative z-10
          w-full max-w-md
          p-6 rounded-2xl
          bg-stone-900/60 backdrop-blur-xl
          border border-white/10
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
        "
      >
        {/* Heading */}
<div className="mb-6 text-center">
  <h1 className="text-2xl font-semibold tracking-tight">
    Welcome to Stockly 👋
  </h1>
  <p className="text-sm text-zinc-500 mt-1">
    Track, compare, and explore stocks — all in one place 📈
  </p>
</div>

        {/* 🔥 Clerk SignUp (uses your CSS variables) */}
        <SignUp
          routing="path"
          path="/sign-up"
          appearance={{
            elements: {
              card: "bg-transparent shadow-none p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
        />
      </motion.div>
    </div>
  )
}