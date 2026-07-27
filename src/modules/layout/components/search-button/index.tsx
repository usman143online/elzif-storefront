"use client"

import { MagnifyingGlass } from "@medusajs/icons"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/store?q=${encodeURIComponent(query.trim())}`)
    setOpen(false)
  }

  return (
    <div className="relative flex items-center">
      {open ? (
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => !query && setOpen(false)}
            placeholder="Search products..."
            className="border border-line bg-paper text-sm text-ink px-3 py-1.5 w-40 small:w-56 focus:outline-none focus:border-ink"
          />
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search"
          className="text-ink hover:text-mute transition-colors"
        >
          <MagnifyingGlass />
        </button>
      )}
    </div>
  )
}
