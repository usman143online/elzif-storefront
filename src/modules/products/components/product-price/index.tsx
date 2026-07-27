import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { formatPKR } from "@lib/util/format-pkr"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex items-center gap-x-3 text-ink">
      <span
        className={clx("text-xl font-semibold", {
          "text-red-600": selectedPrice.price_type === "sale",
        })}
      >
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {formatPKR(selectedPrice.calculated_price_number)}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <span
          className="line-through text-mute text-sm"
          data-testid="original-product-price"
          data-value={selectedPrice.original_price_number}
        >
          {formatPKR(selectedPrice.original_price_number)}
        </span>
      )}
    </div>
  )
}
