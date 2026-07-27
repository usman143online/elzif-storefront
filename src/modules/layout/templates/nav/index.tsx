import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { StoreRegion } from "@medusajs/types"
import { User, ShoppingBag } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchButton from "@modules/layout/components/search-button"

export default async function Nav() {
  const [regions, locales, currentLocale, productCategories, { collections }] =
    await Promise.all([
      listRegions().then((regions: StoreRegion[]) => regions),
      listLocales(),
      getLocale(),
      listCategories(),
      listCollections({ fields: "id, handle, title" }),
    ])

  const topLevelCategories = (productCategories || [])
    .filter((c: any) => !c.parent_category)
    .slice(0, 4)

  const menuItems = [
    ...topLevelCategories.map((c: any) => ({ label: c.name, handle: c.handle })),
    ...(collections || [])
      .slice(0, Math.max(0, 5 - topLevelCategories.length))
      .map((c) => ({ label: c.title, handle: c.handle })),
  ]

  return (
    <div className="sticky top-0 inset-x-0 z-50 group bg-paper">
      <header className="relative mx-auto duration-200">
        <div className="border-b border-line">
          <nav className="content-container flex items-center justify-between w-full h-16 small:h-20">
            <div className="flex-1 basis-0 h-full flex items-center small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>

            <div className="flex items-center h-full flex-1 small:flex-none justify-center small:justify-start">
              <LocalizedClientLink
                href="/"
                className="font-semibold text-lg small:text-xl tracking-tight text-ink"
                data-testid="nav-store-link"
              >
                Elzif
              </LocalizedClientLink>
            </div>

            <div className="hidden small:flex items-center justify-center flex-1 h-full gap-x-8">
              {menuItems.map((item) => (
                <LocalizedClientLink
                  key={item.handle}
                  href={`/collections/${item.handle}`}
                  className="text-xs font-medium uppercase tracking-widest text-ink/80 hover:text-ink transition-colors"
                >
                  {item.label}
                </LocalizedClientLink>
              ))}
              <LocalizedClientLink
                href="/store"
                className="text-xs font-medium uppercase tracking-widest text-ink/80 hover:text-ink transition-colors"
              >
                All products
              </LocalizedClientLink>
            </div>

            <div className="flex items-center gap-x-5 h-full flex-1 basis-0 justify-end">
              <SearchButton />
              <LocalizedClientLink
                className="hidden small:flex items-center text-ink hover:text-mute transition-colors"
                href="/account"
                data-testid="nav-account-link"
                aria-label="Account"
              >
                <User />
              </LocalizedClientLink>
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="flex items-center text-ink hover:text-mute"
                    href="/cart"
                    data-testid="nav-cart-link"
                    aria-label="Cart"
                  >
                    <ShoppingBag />
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}
