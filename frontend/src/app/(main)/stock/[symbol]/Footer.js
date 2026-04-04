"use client";

import React from "react";

export default function Footer({data}) {
    console.log("data",data)
//   const percentage =
    // high === low ? 0 : ((current - low) / (high - low)) * 100;

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 w-full mt-5 shadow-lg">
      
     
      <div className="flex items-center justify-between mb-4">
        <p className="text-zinc-400 text-sm tracking-wide">
          Range
        </p>
        <p className="text-xs text-zinc-500">
          {/* {low.toLocaleString()} — {high.toLocaleString()} */}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
        //   style={{ width: `${}%` }}
        />
      </div>

      {/* Bottom Values */}
      <div className="flex justify-between mt-3 text-sm">
        <span className="text-zinc-500">
          Low: <span className="text-white font-medium"></span>
        </span>
        <span className="text-zinc-500">
          Current:{" "}
          <span className="text-white font-semibold">
           
          </span>
        </span>
        <span className="text-zinc-500">
          High: <span className="text-white font-medium"></span>
        </span>
      </div>
    </div>
  );
}
