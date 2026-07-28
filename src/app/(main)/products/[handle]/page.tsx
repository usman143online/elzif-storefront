import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { getBaseURL } from "@lib/util/env"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const { response } = await listProducts({
      countryCode: "pk",
      queryParams: { limit: 500, fields: "handle" },
    })

    return response.products
      .map((product) => ({ handle: product.handle }))
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

const stripHtmlAndTruncate = (text?: string | null, maxLength = 160) => {
  if (!text) return undefined
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  return plain.length > maxLength ? `${plain.slice(0, maxLength - 1)}…` : plain
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion("pk")

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: "pk",
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const description =
    stripHtmlAndTruncate(product.description) ||
    `Shop ${product.title} at Elzif.`

  return {
    title: product.title,
    description,
    alternates: {
      canonical: `/products/${product.handle}`,
    },
    openGraph: {
      title: product.title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion("pk")
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: "pk",
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  if (!pricedProduct) {
    notFound()
  }

  const { cheapestPrice } = getProductPrice({ product: pricedProduct })
  const baseUrl = getBaseURL()

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pricedProduct.title,
    description: stripHtmlAndTruncate(pricedProduct.description, 500),
    image: pricedProduct.images?.map((i) => i.url) || [],
    sku: pricedProduct.variants?.[0]?.sku || undefined,
    brand: {
      "@type": "Brand",
      name: "Elzif",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${pricedProduct.handle}`,
      priceCurrency: cheapestPrice?.currency_code?.toUpperCase() || "PKR",
      price: cheapestPrice?.calculated_price_number ?? undefined,
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode="pk"
        images={images}
      />
    </>
  )
}
