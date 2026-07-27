"use client"

import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { useEffect, useRef, useState } from "react"

const BATCH_SIZE = 16

export default function InfiniteProductGrid({
  products,
  region,
}: {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(BATCH_SIZE, products.length)
  )
  const sentinelRef = useRef<HTMLDivElement>(null)

  const hasMore = visibleCount < products.length

  useEffect(() => {
    if (!hasMore) return

    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + BATCH_SIZE, products.length)
          )
        }
      },
      { rootMargin: "600px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, products.length])

  if (!products.length) {
    return (
      <div className="py-24 text-center text-mute text-sm">
        No products found.
      </div>
    )
  }

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.slice(0, visibleCount).map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} region={region} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-10">
          <span className="text-xs uppercase tracking-widest text-mute">
            Loading more...
          </span>
        </div>
      )}
    </>
  )
}
