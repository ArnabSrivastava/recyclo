"use client"

import React, { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Leaf,
  Droplets,
  Cloud,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRecycloStore } from "@/lib/store/use-recyclo-store"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { products, batches, addToCart } = useRecycloStore()

  const product = products.find((p) => p.id === resolvedParams.id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdded, setIsAdded] = useState(false)

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <Link href="/store">
          <Button
            variant="outline"
            className="rounded-none border-2 border-foreground font-bold"
          >
            Back to Upcycled Store
          </Button>
        </Link>
      </div>
    )
  }

  const batch = batches.find((b) => b.id === product.batchId)

  const handleAddToCart = () => {
    addToCart(product, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, 1)
    router.push("/cart")
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Link href="/store">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 rounded-none text-xs font-bold"
          >
            <ArrowLeft className="size-4" /> Back to Store Catalog
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-6">
          <div className="relative aspect-4/3 overflow-hidden rounded-none border-2 border-primary bg-muted shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
              }}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="rounded-none border border-black/10 bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground">
                {product.recycledContentPercentage}% Recycled Fabric
              </Badge>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`size-20 cursor-pointer overflow-hidden rounded-none border-2 transition-all ${
                    selectedImage === idx
                      ? "border-primary shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt="thumb"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"
                    }}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-none bg-muted font-bold"
              >
                Category: {product.category}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-none text-xs font-bold"
              >
                SKU: {product.sku}
              </Badge>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm font-bold text-foreground">
              {product.tagline}
            </p>
          </div>

          <div className="flex items-baseline gap-3 border-y border-border py-4">
            <div className="text-3xl font-extrabold text-foreground">
              ₹{product.price}
            </div>
            {product.originalPrice && (
              <div className="text-base text-muted-foreground line-through">
                ₹{product.originalPrice}
              </div>
            )}
            <Badge
              variant="outline"
              className="ml-auto rounded-none bg-primary font-bold text-primary-foreground"
            >
              In Stock ({product.stock} available)
            </Badge>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="grid grid-cols-3 gap-3 rounded-none border-2 border-primary bg-primary/15 p-3.5 text-center text-xs">
            <div>
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground">
                <Leaf className="size-3 text-foreground" /> Textile Recovered
              </div>
              <div className="mt-0.5 font-extrabold text-foreground">
                {product.traceabilityStory.textileWeightRecoveredKg} kg
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground">
                <Cloud className="size-3 text-foreground" /> CO2 Avoided
              </div>
              <div className="mt-0.5 font-extrabold text-foreground">
                {product.traceabilityStory.co2SavedKg} kg
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground">
                <Droplets className="size-3 text-foreground" /> Water Conserved
              </div>
              <div className="mt-0.5 font-extrabold text-foreground">
                {product.traceabilityStory.waterSavedLiters} L
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row">
            <Button
              onClick={handleAddToCart}
              size="lg"
              variant="outline"
              className="h-12 w-full gap-2 rounded-none border-2 border-foreground font-bold text-foreground hover:bg-foreground hover:text-background sm:w-1/2"
            >
              {isAdded ? (
                <>
                  <CheckCircle2 className="size-5 text-primary" /> Added to
                  Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="size-5" /> Add to Cart
                </>
              )}
            </Button>

            <Button
              onClick={handleBuyNow}
              size="lg"
              className="h-12 w-full rounded-none border border-black/10 font-bold shadow-lg sm:w-1/2"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      <section className="border-t border-border pt-8">
        <Tabs defaultValue="traceability" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger
              value="traceability"
              className="gap-1.5 rounded-none font-bold"
            >
              <Sparkles className="size-4 fill-primary text-foreground" />{" "}
              Traceability Story
            </TabsTrigger>
            <TabsTrigger value="specs" className="rounded-none font-bold">
              Product Specifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="traceability" className="pt-6">
            <Card className="rounded-none border-2 border-primary bg-primary/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-none border-primary bg-primary font-bold text-primary-foreground"
                  >
                    100% Circular Supply Chain
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Batch Code #{product.batchId || "PB1024"}
                  </span>
                </div>
                <CardTitle className="mt-1 text-xl">
                  The Lifecycle Journey of This Product
                </CardTitle>
                <CardDescription className="text-xs">
                  {product.traceabilityStory.originText}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-4">
                  <div className="space-y-1 rounded-none border-2 border-border bg-background p-4">
                    <div className="font-bold text-foreground">
                      1. Household Pickup
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Collected from household recycling listings by verified
                      Recyclo pickup agents.
                    </p>
                  </div>

                  <div className="space-y-1 rounded-none border-2 border-border bg-background p-4">
                    <div className="font-bold text-foreground">
                      2. Manual Sorting
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Cleaned and sorted into {product.batchId || "PB1024"}{" "}
                      based on fiber material.
                    </p>
                  </div>

                  <div className="space-y-1 rounded-none border-2 border-border bg-background p-4">
                    <div className="font-bold text-foreground">
                      3. Artisan Upcycling
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Crafted into durable store products by master tailors with
                      zero waste offcuts.
                    </p>
                  </div>

                  <div className="space-y-1 rounded-none border-2 border-border bg-background p-4">
                    <div className="font-bold text-foreground">
                      4. Your Doorstep
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Delivered plastic-free to extend the textile lifecycle for
                      years to come.
                    </p>
                  </div>
                </div>

                {batch && (
                  <div className="space-y-1 rounded-none border-2 border-border bg-card p-4 text-xs">
                    <div className="font-semibold text-foreground">
                      Associated Batch Metadata:
                    </div>
                    <div className="text-muted-foreground">
                      Batch Name: <b>{batch.name}</b> • Total Material
                      Recovered: <b>{batch.totalWeightKg} kg</b> across{" "}
                      {batch.sourceListingIds.length} listings.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="pt-6">
            <Card className="rounded-none border-2 border-border">
              <CardContent className="p-6 text-xs">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="font-semibold text-foreground">
                        {product.material}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">
                        Recycled Content:
                      </span>
                      <span className="font-semibold text-foreground">
                        {product.recycledContentPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Color:</span>
                      <span className="font-semibold text-foreground">
                        {product.color}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-semibold text-foreground">
                        {product.dimensions || "Standard"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-semibold text-foreground">
                        {product.weightKg} kg
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Packaging:</span>
                      <span className="font-semibold text-foreground">
                        100% Plastic-Free Recycled Paper
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
