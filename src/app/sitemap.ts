import { getBaseURL } from "@lib/util/env"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/store`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  const [categories, { collections }, { response }] = await Promise.all([
    listCategories(),
    listCollections({ fields: "id, handle, updated_at" }),
    listProducts({
      queryParams: { limit: 500, fields: "handle, updated_at" },
      countryCode: "pk",
    }),
  ])

  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map(
    (category: any) => ({
      url: `${baseUrl}/collections/${category.handle}`,
      lastModified: category.updated_at,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  )

  const collectionRoutes: MetadataRoute.Sitemap = (collections || []).map(
    (collection) => ({
      url: `${baseUrl}/collections/${collection.handle}`,
      lastModified: (collection as any).updated_at,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  )

  const productRoutes: MetadataRoute.Sitemap = (response.products || []).map(
    (product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: (product as any).updated_at,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  )

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
    ...productRoutes,
  ]
}
