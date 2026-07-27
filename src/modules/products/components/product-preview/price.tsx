import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"
import { formatPKR } from "@lib/util/format-pkr"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-mute"
          data-testid="original-price"
        >
          {formatPKR(price.original_price_number)}
        </Text>
      )}
      <Text
        className={clx("text-ink", {
          "text-red-600": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {formatPKR(price.calculated_price_number)}
      </Text>
    </>
  )
}
