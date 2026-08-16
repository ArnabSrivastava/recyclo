import Fuse, { IFuseOptions, FuseOptionKey } from "fuse.js"
import { StoreProduct, RecyclingListing, ClothingItem } from "@/lib/types"

export const DEFAULT_FUSE_OPTIONS: IFuseOptions<unknown> = {
  isCaseSensitive: false,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  ignoreLocation: true,
  useExtendedSearch: false,
}

export const PRODUCT_FUSE_KEYS: FuseOptionKey<StoreProduct>[] = [
  { name: "name", weight: 0.3 },
  { name: "brand", weight: 0.25 },
  { name: "gender", weight: 0.2 },
  { name: "category", weight: 0.15 },
  { name: "material", weight: 0.05 },
  { name: "tagline", weight: 0.02 },
  { name: "color", weight: 0.02 },
  { name: "sku", weight: 0.01 },
]

export const LISTING_FUSE_KEYS: FuseOptionKey<RecyclingListing>[] = [
  { name: "id", weight: 0.3 },
  { name: "userName", weight: 0.25 },
  { name: "userPhone", weight: 0.15 },
  { name: "status", weight: 0.1 },
  { name: "items.category", weight: 0.1 },
  { name: "items.material", weight: 0.05 },
  { name: "items.brand", weight: 0.05 },
]

export const ITEM_FUSE_KEYS: FuseOptionKey<ClothingItem>[] = [
  { name: "category", weight: 0.3 },
  { name: "material", weight: 0.25 },
  { name: "brand", weight: 0.2 },
  { name: "color", weight: 0.15 },
  { name: "description", weight: 0.1 },
]

export function fuzzySearchCollection<T>(
  collection: T[],
  query: string,
  keys: FuseOptionKey<T>[] | string[],
  customOptions?: Partial<IFuseOptions<T>>
): T[] {
  if (!query.trim()) return collection

  const options: IFuseOptions<T> = {
    ...DEFAULT_FUSE_OPTIONS,
    keys: keys as IFuseOptions<T>["keys"],
    ...customOptions,
  }

  const fuse = new Fuse(collection, options)
  const results = fuse.search(query).filter((res) => {
    if (res.score !== undefined) {
      const similarityPct = Math.round((1 - res.score) * 100)
      return similarityPct >= 60
    }
    return true
  })
  return results.map((res) => res.item)
}

export function searchStoreProducts(
  products: StoreProduct[],
  query: string,
  customThreshold = 0.4
): StoreProduct[] {
  return fuzzySearchCollection(products, query, PRODUCT_FUSE_KEYS, {
    threshold: customThreshold,
  })
}

export function searchRecyclingListings(
  listings: RecyclingListing[],
  query: string,
  customThreshold = 0.4
): RecyclingListing[] {
  return fuzzySearchCollection(listings, query, LISTING_FUSE_KEYS, {
    threshold: customThreshold,
  })
}
