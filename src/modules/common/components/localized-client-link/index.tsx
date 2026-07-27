"use client"

import Link from "next/link"
import React from "react"

/**
 * Use this component to create a Next.js `<Link />`.
 * The store is single-region, so URLs no longer carry a country code prefix.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
