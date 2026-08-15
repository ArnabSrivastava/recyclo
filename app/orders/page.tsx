"use client"

import React from "react"
import Link from "next/link"
import { Package, Truck, MapPin, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRecycloStore } from "@/lib/store/use-recyclo-store"

export default function OrdersPage() {
  const { orders } = useRecycloStore()

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <Badge
            variant="outline"
            className="mb-1 rounded-none border-primary bg-primary font-bold text-primary-foreground"
          >
            Store Purchases & Tracking
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Your Upcycled Product Orders
          </h1>
        </div>

        <Link href="/store">
          <Button className="gap-1.5 rounded-none border border-black/10 text-xs font-bold">
            <ShoppingBag className="size-4" /> Browse Store Catalog
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <Card className="space-y-4 rounded-none border-2 border-border bg-muted/30 p-12 text-center">
          <Package className="mx-auto size-12 text-muted-foreground" />
          <div className="space-y-1">
            <h2 className="text-xl font-bold">
              You haven&apos;t purchased a Recyclo product yet
            </h2>
            <p className="text-xs text-muted-foreground">
              Every purchase directly funds local textile sorting and recycling
              facilities.
            </p>
          </div>
          <Link href="/store">
            <Button className="rounded-none border border-black/10 font-bold">
              Explore Store Products
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="rounded-none border-2 border-primary"
            >
              <CardHeader className="border-b border-primary/30 bg-primary/10 pb-3">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-foreground">
                        Order #{order.id}
                      </span>
                      <Badge
                        variant="outline"
                        className="rounded-none bg-primary text-xs font-bold text-primary-foreground"
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}{" "}
                      • Tracking:{" "}
                      <b className="text-foreground">
                        {order.trackingNumber}
                      </b>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Total Paid ({order.paymentMethod})
                    </div>
                    <div className="text-xl font-extrabold text-foreground">
                      ₹{order.total}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between rounded-none border-2 border-primary bg-primary/20 p-3 text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Truck className="size-4 text-foreground" /> Order Status:{" "}
                    <b>{order.orderStatus}</b>
                  </span>
                  <span className="text-muted-foreground">
                    Est. Delivery: 2-3 Business Days
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 rounded-none border-2 border-border bg-background p-2.5 text-xs"
                    >
                      <div className="size-12 shrink-0 overflow-hidden rounded-none border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="font-bold text-foreground">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {product.category} • {product.batchId}
                        </div>
                      </div>

                      <div className="text-right font-semibold">
                        {quantity}x @ ₹{product.price}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 rounded-none border-2 border-border bg-muted p-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    <MapPin className="size-3.5 text-foreground" /> Delivery
                    Address:
                  </div>
                  <div>
                    {order.deliveryAddress.fullName} —{" "}
                    {order.deliveryAddress.streetAddress},{" "}
                    {order.deliveryAddress.city} (
                    {order.deliveryAddress.pincode})
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
