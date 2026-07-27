"use client"

import { useState } from "react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-sm text-ink">Thanks — you're on the list.</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xs">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="flex-1 min-w-0 bg-paper border border-line px-3 py-2 text-sm text-ink placeholder:text-mute focus:outline-none focus:border-ink"
      />
      <button
        type="submit"
        className="shrink-0 bg-ink text-paper text-xs font-medium uppercase tracking-widest px-4 py-2 hover:bg-ink/85 transition-colors"
      >
        Join
      </button>
    </form>
  )
}
