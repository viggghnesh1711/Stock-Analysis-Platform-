"use client"
import React, { useEffect, useState } from "react"
import Header from "../stock/[symbol]/Header"
import { motion } from "framer-motion"
import Searchbar from "@/components/Searchbar"
import StockList from "./StockList"

function page() {
  return (
    <div className="md:pt-3">
            
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

      <StockList />
    </div>
  )
}

export default page