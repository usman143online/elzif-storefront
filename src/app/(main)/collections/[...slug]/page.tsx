import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { StoreCollection } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

/**
 * This route serves both Collections and Categories under /collections/*,
 * matching the URL convention used by Shopify. A single-segment slug is
 * checked against Collections first, then against Categories (which also
 * supports nested paths via multi-segment slugs).
 */
export async function generateStaticParams() {
  const params: { slug: string[] }[] = []

  const { collections } = await listCollections({ fields: "*products" })
  collections?.forEach((collection: StoreCollection) => {
    if (collection.handle) {
      params.push({ slug: [collection.handle] })
    }
  })

  const categories = await listCategories()
  categories?.forEach((category: any) => {
    if (category.handle) {
      params.push({ slug: [category.handle] })
    }
  })

  return params
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const canonical = `/collections/${params.slug.join("/")}`

  if (params.slug.length === 1) {
    const collection = await getCollectionByHandle(params.slug[0])
    if (collection) {
      return {
        title: collection.title,
        description: `Shop the ${collection.title} collection at Elzif.`,
        alternates: { canonical },
      }
    }
  }

  try {
    const productCategory = await getCategoryByHandle(params.slug)
    const description =
      productCategory.description ||
      `Shop ${productCategory.name} at Elzif.`

    return {
      title: productCategory.name,
      description,
      alternates: { canonical },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CollectionOrCategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  if (params.slug.length === 1) {
    const collection = await getCollectionByHandle(params.slug[0]).then(
      (collection: StoreCollection) => collection
    )

    if (collection) {
      return (
        <CollectionTemplate
          collection={collection}
          page={page}
          sortBy={sortBy}
          countryCode="pk"
        />
      )
    }
  }

  const productCategory = await getCategoryByHandle(params.slug)

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode="pk"
    />
  )
}
