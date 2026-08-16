"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ShoppingBag,
  Sparkles,
  Filter,
  Leaf,
  CheckCircle2,
  Search,
  RotateCcw,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useRecycloStore } from "@/lib/store/use-recyclo-store"
import { FabricMaterial } from "@/lib/types"
import { useFuseSearch } from "@/hooks/use-fuse-search"
import { PRODUCT_FUSE_KEYS } from "@/lib/fuse-search"

function UpcycledStoreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get('q') || searchParams.get('search') || searchParams.get('keyword') || ''

  const { products, addToCart } = useRecycloStore()

  const [selectedGender, setSelectedGender] = useState<string>("ALL")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [selectedSize, setSelectedSize] = useState<string>("ALL")
  const [selectedMaterial, setSelectedMaterial] = useState<string>("ALL")
  const [selectedColor, setSelectedColor] = useState<string>("ALL")
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("ALL")
  const [minRecycledPercent, setMinRecycledPercent] = useState<number>(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery)
  const [overrideQuery, setOverrideQuery] = useState<string | null>(null)

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery)
    setOverrideQuery(null)
  }

  const searchQuery = overrideQuery !== null ? overrideQuery : urlQuery
  const setSearchQuery = (val: string) => setOverrideQuery(val)
  const fuzzyThreshold = 0.4
  const [sortBy, setSortBy] = useState<string>("FEATURED")

  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  const {
    results: fuseMatchedProducts,
    fuseResults,
    hasQuery: isFuzzySearchActive,
  } = useFuseSearch(products, searchQuery, {
    keys: PRODUCT_FUSE_KEYS,
    threshold: fuzzyThreshold,
  })

  const productFuseScoreMap = useMemo(() => {
    const map = new Map<string, number>()
    fuseResults.forEach((res) => {
      if (res.item && res.score !== undefined) {
        const similarity = Math.round((1 - res.score) * 100)
        map.set(res.item.id, similarity)
      }
    })
    return map
  }, [fuseResults])

  const genderOptions = ["ALL", "Men", "Women", "Unisex"]

  const categories = [
    "ALL",
    "Men's Wear",
    "Women's Wear",
    "Unisex Wear",
    "Ethnic & Traditional",
    "Winter & Outerwear",
    "Accessories & Scarves",
  ]

  const sizeOptions = ["ALL", "S", "M", "L", "XL", "XXL", "Free Size"]

  const materials: (FabricMaterial | "ALL")[] = [
    "ALL",
    "Cotton",
    "Denim",
    "Silk",
    "Wool",
    "Linen",
    "Mixed",
  ]

  const colorOptions = [
    "ALL",
    "Blue",
    "Indigo Blue",
    "Black",
    "White",
    "Red",
    "Green",
    "Beige",
    "Multicolor",
  ]

  const filteredAndSortedProducts = useMemo(() => {
    const sourceList = isFuzzySearchActive ? fuseMatchedProducts : products

    return sourceList
      .filter((p) => {
        const matchesGender =
          selectedGender === "ALL" ||
          p.gender === selectedGender ||
          (p.gender === "Unisex" && selectedGender !== "ALL")

        const matchesCat =
          selectedCategory === "ALL" || (p.category as string) === selectedCategory

        const matchesSize =
          selectedSize === "ALL" ||
          p.size === selectedSize ||
          (p.size === "Free Size" && selectedSize !== "ALL")

        const matchesMaterial =
          selectedMaterial === "ALL" ||
          p.material.toLowerCase() === selectedMaterial.toLowerCase()

        const matchesColor =
          selectedColor === "ALL" ||
          p.color.toLowerCase().includes(selectedColor.toLowerCase())

        let matchesPrice = true
        if (selectedPriceRange === "UNDER_500") matchesPrice = p.price < 500
        else if (selectedPriceRange === "500_1000")
          matchesPrice = p.price >= 500 && p.price <= 1000
        else if (selectedPriceRange === "1000_2000")
          matchesPrice = p.price > 1000 && p.price <= 2000
        else if (selectedPriceRange === "ABOVE_2000")
          matchesPrice = p.price > 2000

        const matchesRecycled =
          p.recycledContentPercentage >= minRecycledPercent

        const matchesStock = !inStockOnly || p.stock > 0

        return (
          matchesGender &&
          matchesCat &&
          matchesSize &&
          matchesMaterial &&
          matchesColor &&
          matchesPrice &&
          matchesRecycled &&
          matchesStock
        )
      })
      .sort((a, b) => {
        if (isFuzzySearchActive && sortBy === "FEATURED") {
          return 0 // Maintain Fuse.js relevance ranking score!
        }
        if (sortBy === "PRICE_LOW") return a.price - b.price
        if (sortBy === "PRICE_HIGH") return b.price - a.price
        if (sortBy === "RECYCLED_HIGH")
          return b.recycledContentPercentage - a.recycledContentPercentage
        if (sortBy === "CO2_SAVINGS")
          return b.traceabilityStory.co2SavedKg - a.traceabilityStory.co2SavedKg
        if (sortBy === "RATING") return b.rating - a.rating
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
      })
  }, [
    products,
    fuseMatchedProducts,
    isFuzzySearchActive,
    selectedGender,
    selectedCategory,
    selectedSize,
    selectedMaterial,
    selectedColor,
    selectedPriceRange,
    minRecycledPercent,
    inStockOnly,
    sortBy,
  ])

  // Floating Back to Top Scroll Tracking
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Pagination States & Logic
  const ITEMS_PER_PAGE = 9
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE) || 1
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAndSortedProducts, startIndex])

  const activeFilterCount =
    (selectedGender !== "ALL" ? 1 : 0) +
    (selectedCategory !== "ALL" ? 1 : 0) +
    (selectedSize !== "ALL" ? 1 : 0) +
    (selectedMaterial !== "ALL" ? 1 : 0) +
    (selectedColor !== "ALL" ? 1 : 0) +
    (selectedPriceRange !== "ALL" ? 1 : 0) +
    (minRecycledPercent > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (sortBy !== "FEATURED" ? 1 : 0)

  const resetAllFilters = () => {
    setSelectedGender("ALL")
    setSelectedCategory("ALL")
    setSelectedSize("ALL")
    setSelectedMaterial("ALL")
    setSelectedColor("ALL")
    setSelectedPriceRange("ALL")
    setMinRecycledPercent(0)
    setInStockOnly(false)
    setSearchQuery("")
    setSortBy("FEATURED")
    setCurrentPage(1)
  }

  const handleQuickAdd = (product: (typeof products)[0]) => {
    addToCart(product, 1)
    setAddedProductId(product.id)
    setTimeout(() => setAddedProductId(null), 1500)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      {/* Banner Header */}
      <div className="flex flex-col justify-between gap-6 rounded-none border-2 border-primary bg-primary/15 p-8 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="max-w-2xl space-y-2">
          <Badge
            variant="outline"
            className="rounded-none border-primary bg-primary font-bold text-primary-foreground"
          >
            100% Upcycled & Repurposed Sustainable Apparel
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            The Recyclo Clothing Store
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Explore handcrafted upcycled apparel — patchwork denim jackets, Banarasi silk kimonos, Ajrakh cotton kurtas, cozy woolen cardigans, and boho dresses. Made directly from post-consumer garments collected via Recyclo household pickups with 100% supply chain traceability.
          </p>
        </div>

        <Link href="/recycle/create">
          <Button className="gap-2 rounded-none border border-black/10 font-bold shadow-md">
            <Leaf className="size-4" /> Recycle Your Own Clothes
          </Button>
        </Link>
      </div>

      {/* CLOTHING SEARCH & FILTER CONTROL CENTER */}
      <Card className="rounded-none border-2 border-border bg-card shadow-sm">
        <CardHeader className="border-b bg-muted/40 pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Badge className="rounded-none border border-black/10 bg-primary font-bold text-primary-foreground">
                <SlidersHorizontal className="mr-1 size-3.5" /> Clothing Search & Specific Filters
              </Badge>
              {activeFilterCount > 0 && (
                <Badge
                  variant="outline"
                  className="rounded-none border-foreground bg-foreground text-xs font-bold text-background"
                >
                  {activeFilterCount} Applied
                </Badge>
              )}
            </div>

            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="h-8 gap-1.5 rounded-none border-2 border-foreground text-xs font-bold hover:bg-foreground hover:text-background"
              >
                <RotateCcw className="size-3.5" /> Reset All Filters
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Row 1: Search Bar & Department (Gender) Pills */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const trimmed = searchQuery.trim()
                if (trimmed) {
                  router.push(`/store?q=${encodeURIComponent(trimmed)}`)
                } else {
                  router.push('/store')
                }
              }}
              className="relative w-full lg:w-96"
            >
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search garments by keyword, fabric, color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-none border-2 border-border pl-9 pr-8 text-xs font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    router.push('/store')
                  }}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </form>

            {/* Gender / Department Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground">
                Department:
              </span>
              {genderOptions.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGender(g)}
                  className={`cursor-pointer rounded-none px-3.5 py-1.5 text-xs font-bold uppercase transition-colors ${
                    selectedGender === g
                      ? "border border-black/10 bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Apparel Category Tabs */}
          <div className="flex w-full items-center gap-2 overflow-x-auto border-t border-border/60 pt-3 pb-1">
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Filter className="size-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer rounded-none px-3 py-1 text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "border-2 border-foreground bg-foreground text-background"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Row 3: Specific Multi-Select Attribute Dropdowns */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 border-t border-border/60 pt-3">
            {/* Size Filter */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                Garment Size
              </label>
              <Select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="h-9 rounded-none border-2 border-border text-xs"
              >
                <option value="ALL">All Sizes</option>
                {sizeOptions
                  .filter((s) => s !== "ALL")
                  .map((size) => (
                    <option key={size} value={size}>
                      Size {size}
                    </option>
                  ))}
              </Select>
            </div>

            {/* Fabric Material Dropdown */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                Fabric Material
              </label>
              <Select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="h-9 rounded-none border-2 border-border text-xs"
              >
                <option value="ALL">All Materials</option>
                {materials
                  .filter((m) => m !== "ALL")
                  .map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
              </Select>
            </div>

            {/* Color Filter */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                Color Shade
              </label>
              <Select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="h-9 rounded-none border-2 border-border text-xs"
              >
                <option value="ALL">All Colors</option>
                {colorOptions
                  .filter((c) => c !== "ALL")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </Select>
            </div>

            {/* Price Range Dropdown */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                Price (₹)
              </label>
              <Select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="h-9 rounded-none border-2 border-border text-xs"
              >
                <option value="ALL">All Prices</option>
                <option value="UNDER_500">Under ₹500</option>
                <option value="500_1000">₹500 - ₹1,000</option>
                <option value="1000_2000">₹1,000 - ₹2,000</option>
                <option value="ABOVE_2000">Above ₹2,000</option>
              </Select>
            </div>

            {/* Min Recycled Content % */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                Min Recycled %
              </label>
              <Select
                value={minRecycledPercent.toString()}
                onChange={(e) => setMinRecycledPercent(Number(e.target.value))}
                className="h-9 rounded-none border-2 border-border text-xs"
              >
                <option value="0">Any Recycled %</option>
                <option value="70">70%+ Recycled</option>
                <option value="85">85%+ Recycled</option>
                <option value="95">95%+ Recycled</option>
                <option value="100">100% Fully Recycled</option>
              </Select>
            </div>

            {/* Sort By Dropdown */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                Sort Items By
              </label>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-none border-2 border-border text-xs font-bold"
              >
                <option value="FEATURED">Featured Items</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
                <option value="RECYCLED_HIGH">Highest Recycled %</option>
                <option value="CO2_SAVINGS">Max CO2 Saved</option>
                <option value="RATING">Highest Rating</option>
              </Select>
            </div>
          </div>

          {/* Active Filter Badges & Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-muted-foreground">
                Active Specific Filters:
              </span>

              {selectedGender !== "ALL" && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-none border-border bg-muted font-bold text-foreground"
                >
                  Department: {selectedGender}
                  <X
                    className="size-3 cursor-pointer hover:text-destructive"
                    onClick={() => setSelectedGender("ALL")}
                  />
                </Badge>
              )}

              {selectedCategory !== "ALL" && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-none border-border bg-muted font-bold text-foreground"
                >
                  Category: {selectedCategory}
                  <X
                    className="size-3 cursor-pointer hover:text-destructive"
                    onClick={() => setSelectedCategory("ALL")}
                  />
                </Badge>
              )}

              {selectedSize !== "ALL" && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-none border-border bg-muted font-bold text-foreground"
                >
                  Size: {selectedSize}
                  <X
                    className="size-3 cursor-pointer hover:text-destructive"
                    onClick={() => setSelectedSize("ALL")}
                  />
                </Badge>
              )}

              {selectedMaterial !== "ALL" && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-none border-border bg-muted font-bold text-foreground"
                >
                  Fabric: {selectedMaterial}
                  <X
                    className="size-3 cursor-pointer hover:text-destructive"
                    onClick={() => setSelectedMaterial("ALL")}
                  />
                </Badge>
              )}

              {selectedColor !== "ALL" && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-none border-border bg-muted font-bold text-foreground"
                >
                  Color: {selectedColor}
                  <X
                    className="size-3 cursor-pointer hover:text-destructive"
                    onClick={() => setSelectedColor("ALL")}
                  />
                </Badge>
              )}

              {searchQuery && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-none border-border bg-muted font-bold text-foreground"
                >
                  Keyword: &quot;{searchQuery}&quot;
                  <X
                    className="size-3 cursor-pointer hover:text-destructive"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}

              {selectedPriceRange !== "ALL" && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-none border-border bg-muted font-bold text-foreground"
                >
                  Price:{" "}
                  {selectedPriceRange === "UNDER_500"
                    ? "Under ₹500"
                    : selectedPriceRange === "500_1000"
                      ? "₹500 - ₹1,000"
                      : selectedPriceRange === "1000_2000"
                        ? "₹1,000 - ₹2,000"
                        : "Above ₹2,000"}
                  <X
                    className="size-3 cursor-pointer hover:text-destructive"
                    onClick={() => setSelectedPriceRange("ALL")}
                  />
                </Badge>
              )}

              {minRecycledPercent > 0 && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-none border-border bg-muted font-bold text-foreground"
                >
                  Recycled: {minRecycledPercent}%+
                  <X
                    className="size-3 cursor-pointer hover:text-destructive"
                    onClick={() => setMinRecycledPercent(0)}
                  />
                </Badge>
              )}

              {activeFilterCount === 0 && (
                <span className="text-xs text-muted-foreground italic">
                  None (Showing all {products.length} upcycled clothing items)
                </span>
              )}
            </div>

            <div className="font-extrabold text-foreground text-xs sm:text-sm">
              {searchQuery ? (
                <span>Showing {filteredAndSortedProducts.length} search {filteredAndSortedProducts.length === 1 ? 'result' : 'results'}</span>
              ) : (
                <span>Showing {filteredAndSortedProducts.length} of {products.length} garments</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CLOTHING PRODUCTS GRID */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.length === 0 ? (
          <div className="col-span-full space-y-4 rounded-none border-2 border-border bg-muted/20 py-16 text-center text-muted-foreground">
            <ShoppingBag className="mx-auto size-14 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">
                No clothing items match your search criteria
              </h3>
              <p className="text-xs text-muted-foreground">
                Try expanding your size selection, clearing color filters, or selecting &quot;All Departments&quot;.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={resetAllFilters}
              className="gap-2 rounded-none border-2 border-foreground font-bold text-foreground hover:bg-foreground hover:text-background"
            >
              <RotateCcw className="size-4" /> Reset All Clothing Filters
            </Button>
          </div>
        ) : (
          paginatedProducts.map((product) => {
            const isJustAdded = addedProductId === product.id

            return (
              <Card
                key={product.id}
                id={`product-${product.id}`}
                className="group flex flex-col justify-between overflow-hidden rounded-none border-2 border-border transition-all hover:border-primary"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <Badge className="rounded-none border border-black/10 bg-primary text-[11px] font-bold text-primary-foreground shadow-xs">
                        {product.recycledContentPercentage}% Recycled Content
                      </Badge>
                      {isFuzzySearchActive && productFuseScoreMap.has(product.id) && (
                        <Badge className="rounded-none border border-primary/40 bg-foreground text-background text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                          <Sparkles className="size-3 text-primary fill-primary" />
                          {productFuseScoreMap.get(product.id)}% Match
                        </Badge>
                      )}
                    </div>

                    <div className="absolute right-3 bottom-3">
                      <Badge
                        variant="secondary"
                        className="rounded-none border border-border bg-background/90 text-[10px] font-bold backdrop-blur-md"
                      >
                        {product.batchId}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                        {product.gender || "UNISEX"} • SIZE {product.size || "FREE"} • {product.material}
                      </span>
                      <span className="text-[10px]">SKU: {product.sku}</span>
                    </div>
                    <CardTitle className="text-lg transition-colors group-hover:text-primary">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {product.tagline}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-4">
                    <div className="flex items-center justify-between rounded-none border border-primary/40 bg-primary/10 p-2.5 text-[11px] font-bold text-foreground">
                      <span className="flex items-center gap-1">
                        <Leaf className="size-3 text-foreground" />{" "}
                        {product.traceabilityStory.co2SavedKg}kg CO2 saved
                      </span>
                      <span>
                        {product.traceabilityStory.waterSavedLiters}L water
                        saved
                      </span>
                    </div>

                    <p className="line-clamp-2 text-[11px] text-muted-foreground italic">
                      &quot;{product.traceabilityStory.originText}&quot;
                    </p>
                  </CardContent>
                </div>

                <div className="flex items-center justify-between gap-3 border-t px-6 pt-3 pb-6">
                  <div>
                    <div className="text-xl font-extrabold text-foreground">
                      ₹{product.price}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/store/${product.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none border-2 border-foreground text-xs font-bold"
                      >
                        Details
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      onClick={() => handleQuickAdd(product)}
                      className="gap-1 rounded-none border border-black/10 text-xs font-bold"
                    >
                      {isJustAdded ? (
                        <>
                          <CheckCircle2 className="size-3.5 text-primary-foreground" />{" "}
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="size-3.5" /> Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t-2 border-border pt-6 sm:flex-row">
          <div className="text-xs font-bold text-muted-foreground">
            Showing <span className="text-foreground">{startIndex + 1}</span>–
            <span className="text-foreground">
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedProducts.length)}
            </span>{" "}
            of <span className="text-foreground">{filteredAndSortedProducts.length}</span> clothing items (Page {safeCurrentPage} of {totalPages})
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1))
                window.scrollTo({ top: 250, behavior: "smooth" })
              }}
              className="rounded-none border-2 border-foreground px-3 font-bold disabled:opacity-40"
            >
              <ChevronLeft className="mr-1 size-4" /> Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={safeCurrentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 250, behavior: "smooth" })
                  }}
                  className={`h-8 w-8 rounded-none border-2 font-extrabold ${
                    safeCurrentPage === page
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={safeCurrentPage === totalPages}
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                window.scrollTo({ top: 250, behavior: "smooth" })
              }}
              className="rounded-none border-2 border-foreground px-3 font-bold disabled:opacity-40"
            >
              Next <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      )}

      <section className="space-y-2 rounded-none border-2 border-border bg-muted p-6 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <Sparkles className="size-4 fill-primary text-foreground" /> 100% Upcycled Clothing Traceability
        </div>
        <p className="leading-relaxed text-muted-foreground">
          When you buy upcycled clothing on Recyclo, you can click into its{" "}
          <b>Traceability Story</b> tab to inspect the exact processing batch code (e.g. <b>PB1024</b>), showing how old discarded garments collected from households were sanitized, reconstructed, and converted into wearable fashion.
        </p>
      </section>

      {/* FLOATING BACK TO TOP BUTTON */}
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
          <Button
            onClick={scrollToTop}
            size="icon"
            aria-label="Back to top"
            className="group flex h-11 w-11 items-center justify-center rounded-none border-2 border-foreground bg-primary p-0 text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-foreground hover:text-background sm:h-12 sm:w-12"
          >
            <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default function UpcycledStorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-semibold text-muted-foreground">Loading upcycled store...</div>}>
      <UpcycledStoreContent />
    </Suspense>
  )
}
