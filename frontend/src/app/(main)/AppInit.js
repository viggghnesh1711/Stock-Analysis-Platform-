"use client"
import { useEffect } from "react"

export default function AppInit() {
  useEffect(() => {
    const hasRun = sessionStorage.getItem("pipeline_called")

    if (!hasRun) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      sessionStorage.setItem("pipeline_called", "true")
    }
  }, [])

  return null
}