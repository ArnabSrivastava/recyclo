"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Recycle,
  Sparkles,
  ArrowRight,
  Truck,
  IndianRupee,
  Factory,
  ShoppingBag,
  Leaf,
  CheckCircle2,
  ChevronRight,
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
import { Select } from "@/components/ui/select"
import { useRecycloStore } from "@/lib/store/use-recyclo-store"
import { calculateEstimatedItemValue } from "@/lib/pricing-engine"
import {
  ClothingCategory,
  FabricMaterial,
  ClothingCondition,
} from "@/lib/types"

export default function HomePage() {
  const { products } = useRecycloStore()

  // Interactive Live Price Estimator state for Home hero
  const [estCategory, setEstCategory] = useState<ClothingCategory>("Kurta")
  const [estMaterial, setEstMaterial] = useState<FabricMaterial>("Cotton")
  const [estCondition, setEstCondition] = useState<ClothingCondition>("GOOD")
  const [estQty, setEstQty] = useState(1)

  const singleEstimate = calculateEstimatedItemValue(
    estCategory,
    estMaterial,
    estCondition
  )
  const totalEstPrice = singleEstimate.estimatedValue * estQty

  const featuredProducts = products.slice(0, 3)

  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-primary/15 via-background to-background pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-none border-2 border-primary bg-primary/20 px-3 py-1 text-xs font-bold text-foreground">
                <Sparkles className="size-3.5 fill-primary text-foreground" />
                <span>
                  India&apos;s Premier Circular Textile Economy Platform
                </span>
              </div>

              <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Turn Old Clothes Into{" "}
                <span className="border border-black/10 bg-primary px-2 py-0.5 text-primary-foreground">
                  Instant Cash
                </span>{" "}
                & Upcycled Goods.
              </h1>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                Recyclo collects your unwanted garments, physically inspects
                every item, pays you a fair price, and transforms recovered
                fabrics into beautiful sustainable products.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
                <Link href="/recycle/create">
                  <Button
                    size="lg"
                    className="h-12 w-full gap-2 rounded-none border border-black/10 px-8 text-base font-bold shadow-lg sm:w-auto"
                  >
                    <Recycle className="size-5" />
                    Recycle Your Clothes
                  </Button>
                </Link>

                <Link href="/store">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full gap-2 rounded-none border-2 border-foreground px-8 text-base font-bold sm:w-auto"
                  >
                    <ShoppingBag className="size-5" />
                    Browse Recycled Store
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-none border border-primary bg-primary/20 text-foreground">
                    <IndianRupee className="size-4" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      Transparent Payout
                    </div>
                    <div>Itemized verification</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-none border border-primary bg-primary/20 text-foreground">
                    <Truck className="size-4" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      Free Doorstep Pickup
                    </div>
                    <div>Assigned agent visits</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-none border border-primary bg-primary/20 text-foreground">
                    <Leaf className="size-4" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      Zero Landfill Waste
                    </div>
                    <div>100% Textile Recovery</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="rounded-none border-2 border-primary bg-card shadow-2xl">
                <CardHeader className="border-b bg-primary/20 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="rounded-none border-primary bg-primary font-bold text-primary-foreground"
                    >
                      Instant Price Estimator
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Formula-Driven
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-lg">
                    Check What Your Clothes Are Worth
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Select clothing type, material, and condition to see an
                    instant estimate.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-6">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                      Clothing Category
                    </label>
                    <Select
                      value={estCategory}
                      onChange={(e) =>
                        setEstCategory(e.target.value as ClothingCategory)
                      }
                      className="border-2 border-border"
                    >
                      <option value="Kurta">Kurta / Kurti (Ethnic)</option>
                      <option value="Shirt">Button Shirt</option>
                      <option value="T-Shirt">T-Shirt / Polo</option>
                      <option value="Jeans">Jeans / Denim Pants</option>
                      <option value="Jacket">Jacket / Blazer</option>
                      <option value="Saree">Saree / Lehenga</option>
                      <option value="Sweater">Sweater / Hoodie</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                        Fabric Material
                      </label>
                      <Select
                        value={estMaterial}
                        onChange={(e) =>
                          setEstMaterial(e.target.value as FabricMaterial)
                        }
                        className="border-2 border-border text-xs"
                      >
                        <option value="Cotton">Cotton (1.1x)</option>
                        <option value="Denim">Denim (1.2x)</option>
                        <option value="Silk">Silk (1.35x)</option>
                        <option value="Wool">Wool (1.25x)</option>
                        <option value="Polyester">Polyester (0.9x)</option>
                      </Select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                        Condition
                      </label>
                      <Select
                        value={estCondition}
                        onChange={(e) =>
                          setEstCondition(e.target.value as ClothingCondition)
                        }
                        className="border-2 border-border text-xs"
                      >
                        <option value="EXCELLENT">Excellent (1.25x)</option>
                        <option value="GOOD">Good (1.0x)</option>
                        <option value="FAIR">Fair (0.7x)</option>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2 text-xs">
                    <span className="font-medium text-muted-foreground">
                      Quantity of items:
                    </span>
                    <div className="flex items-center gap-2">
                      {[1, 3, 5, 10].map((qty) => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => setEstQty(qty)}
                          className={`size-7 cursor-pointer rounded-none text-xs font-bold transition-colors ${
                            estQty === qty
                              ? "border border-black/10 bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {qty}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-none border-2 border-primary bg-primary/15 p-4">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">
                        Estimated Total Payout
                      </div>
                      <div className="text-2xl font-extrabold text-foreground">
                        ₹{totalEstPrice}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          ({estQty} item{estQty > 1 ? "s" : ""})
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/recycle/create?category=${estCategory}&material=${estMaterial}`}
                    >
                      <Button
                        size="sm"
                        className="gap-1 rounded-none border border-black/10 font-bold"
                      >
                        Recycle Now <ArrowRight className="size-3.5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="text-center text-[11px] text-muted-foreground">
                    *Final payout confirmed upon physical inspection by Recyclo
                    pickup agent.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <Badge
            variant="outline"
            className="rounded-none border-primary bg-primary/20 font-bold text-foreground"
          >
            Complete End-to-End Ecosystem
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            How Recyclo Works
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Recyclo bridges the gap between old unwanted textiles and new
            sustainable products through a transparent 3-phase circular
            lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="relative overflow-hidden rounded-none border-2 border-border transition-colors hover:border-primary">
            <div className="absolute top-0 right-0 rounded-none border-b border-l border-black/10 bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
              PHASE 1
            </div>
            <CardHeader className="pt-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-none border border-primary bg-primary/20 text-foreground">
                <Truck className="size-6 text-foreground" />
              </div>
              <CardTitle className="text-xl">
                1. Give Clothes & Get Paid
              </CardTitle>
              <CardDescription className="text-xs">
                List unused garments online, view instant price estimates, and
                schedule doorstep pickup.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 fill-primary text-foreground" />
                <span>
                  Add multiple items (Shirts, Kurtas, Jeans, etc.) to one
                  listing.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 fill-primary text-foreground" />
                <span>
                  Assigned agent arrives and performs item-by-item physical
                  inspection.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 fill-primary text-primary" />
                <span>
                  Receive verified final payout directly into your UPI/Bank
                  within 24h.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden rounded-none border-2 border-border transition-colors hover:border-primary">
            <div className="absolute top-0 right-0 rounded-none bg-foreground px-4 py-1 text-xs font-bold text-background">
              PHASE 2
            </div>
            <CardHeader className="pt-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-none border border-border bg-muted text-foreground">
                <Factory className="size-6" />
              </div>
              <CardTitle className="text-xl">
                2. Sort, Repair & Process
              </CardTitle>
              <CardDescription className="text-xs">
                Collected textiles enter Recyclo’s internal facility for sorting
                and batch processing.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                <span>
                  Quality items undergo cleaning and reconditioning for direct
                  resale.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                <span>
                  Ethnic fabrics & denims upcycled into tote bags, sleeves, and
                  decor.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                <span>
                  Textiles grouped into traceable batches (e.g. PB1024).
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden rounded-none border-2 border-border transition-colors hover:border-primary">
            <div className="absolute top-0 right-0 rounded-none border-b border-l border-black/10 bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
              PHASE 3
            </div>
            <CardHeader className="pt-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-none border border-primary bg-primary/20 text-foreground">
                <ShoppingBag className="size-6 text-foreground" />
              </div>
              <CardTitle className="text-xl">
                3. Buy Recycled Products
              </CardTitle>
              <CardDescription className="text-xs">
                Upcycled bags, cushion covers, sleeves, and fabrics listed on
                the Recyclo store.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 fill-primary text-primary" />
                <span>
                  Shop handcrafted goods made with up to 100% recycled
                  materials.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 fill-primary text-primary" />
                <span>
                  View <b>Traceability Story</b> showing CO2 and water saved per
                  product.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 fill-primary text-primary" />
                <span>
                  Direct delivery to your doorstep with zero plastic packaging.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge
              variant="outline"
              className="mb-2 rounded-none border-primary bg-primary/20 font-bold text-foreground"
            >
              Sustainable Marketplace
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured Upcycled Products
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Crafted from recovered textiles collected through Recyclo
              household pickups.
            </p>
          </div>

          <Link href="/store">
            <Button
              variant="outline"
              className="gap-1 rounded-none border-2 border-foreground text-xs font-bold"
            >
              View Full Store Catalog <ChevronRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group flex flex-col justify-between overflow-hidden rounded-none border-2 border-border transition-all hover:border-primary"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="rounded-none border border-black/10 bg-primary font-bold text-primary-foreground">
                      {product.recycledContentPercentage}% Recycled Content
                    </Badge>
                  </div>
                  <div className="absolute right-3 bottom-3">
                    <Badge
                      variant="secondary"
                      className="rounded-none border border-border bg-background/90 font-bold backdrop-blur-md"
                    >
                      {product.batchId}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    {product.category} • {product.material}
                  </div>
                  <CardTitle className="text-lg transition-colors group-hover:text-primary">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {product.tagline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="flex items-center justify-between rounded-none border border-primary/40 bg-primary/10 p-2.5 text-[11px] font-bold text-foreground">
                    <span>
                      Impact: {product.traceabilityStory.co2SavedKg}kg CO2 saved
                    </span>
                    <span>
                      {product.traceabilityStory.waterSavedLiters}L water saved
                    </span>
                  </div>
                </CardContent>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-border/40 px-6 pt-0 pb-6">
                <div>
                  <div className="text-lg font-bold text-foreground">
                    ₹{product.price}
                  </div>
                  {product.originalPrice && (
                    <div className="text-xs text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </div>
                  )}
                </div>

                <Link href={`/store/${product.id}`}>
                  <Button
                    size="sm"
                    className="gap-1 rounded-none border border-black/10 font-bold"
                  >
                    View Product & Story
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="rounded-none border-2 border-foreground bg-foreground p-6 text-background sm:p-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-none border-primary bg-primary font-bold text-primary-foreground"
                >
                  Live Operations Traceability
                </Badge>
                <span className="text-xs opacity-80">PB1024 & PB1025</span>
              </div>
              <h3 className="text-2xl font-extrabold text-background sm:text-3xl">
                Complete Material Lifecycle Tracking
              </h3>
              <p className="text-sm leading-relaxed opacity-90">
                When you recycle with Recyclo, your garments are assigned a
                unique digital ID. You can track how your{" "}
                <b>Kurta or Denim Jeans</b> move into <b>Processing PB1024</b>{" "}
                and get reborn as an upcycled laptop sleeve or tote bag.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-4">
              <div className="space-y-2 rounded-none border-2 border-primary bg-background p-4 text-xs text-foreground shadow-xs">
                <div className="flex justify-between font-bold">
                  <span>PB1024 (Denim)</span>
                  <Badge
                    variant="outline"
                    className="rounded-none border-none bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    COMPLETED
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span>Recovered: 12.4 kg denim from 18 items</span>
                  <ChevronRight className="size-3 shrink-0" />
                  <span>15 Tote bags & Sleeves.</span>
                </div>
              </div>

              <Link href="/how-it-works">
                <Button
                  variant="secondary"
                  className="w-full gap-1 rounded-none border border-black/10 bg-primary text-xs font-bold text-primary-foreground"
                >
                  Learn More About Our Recycling Formula{" "}
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-none border-2 border-black/10 bg-primary p-8 text-center text-primary-foreground shadow-xl sm:p-12">
          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Give Your Old Clothes a Second Life?
            </h2>
            <p className="text-sm font-medium text-primary-foreground/90 sm:text-base">
              Join thousands of households across India recycling textiles,
              earning instant cash, and driving a circular zero-waste economy.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <Link href="/recycle/create">
                <Button
                  size="lg"
                  className="w-full rounded-none border border-foreground bg-foreground px-8 text-base font-extrabold text-background hover:bg-foreground/90 sm:w-auto"
                >
                  Start Recycling Request Now
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-none border-2 border-foreground text-base font-bold text-foreground hover:bg-foreground/10 sm:w-auto"
                >
                  How Pricing Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
