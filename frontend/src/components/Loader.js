import React from 'react'

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      
     
      <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

    
      <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-10 py-8 flex flex-col items-center gap-4">
        
      
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin" />
        </div>

        
        <p className="text-sm text-white/70 tracking-wide">
          Loading market data
        </p>
      </div>

    </div>
  )
}

export default Loader