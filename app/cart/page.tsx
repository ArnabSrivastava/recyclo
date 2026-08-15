'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Smartphone, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';
import { Order } from '@/lib/types';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart, currentUser, placeOrder } = useRecycloStore();

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('UPI');

  const selectedAddress = currentUser.addresses[0];

  const subtotal = cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0);
  const shippingFee = subtotal > 999 || cart.length === 0 ? 0 : 79;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingFee + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    placeOrder(selectedAddress, paymentMethod);
    router.push('/orders');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <Badge variant="outline" className="bg-primary text-primary-foreground border-primary mb-1 rounded-none font-bold">
            Upcycled Marketplace Cart
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">Shopping Cart</h1>
        </div>

        <Link href="/store">
          <Button variant="outline" size="sm" className="text-xs font-bold text-foreground rounded-none border-2 border-foreground">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {cart.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-muted/30 rounded-none border-2 border-border">
          <ShoppingBag className="size-12 text-muted-foreground mx-auto" />
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Your cart is waiting for something sustainable</h2>
            <p className="text-xs text-muted-foreground">
              Explore tote bags, cushion covers, and laptop sleeves made with 100% recovered textiles.
            </p>
          </div>
          <Link href="/store">
            <Button className="font-bold rounded-none border border-black/10">Browse Recycled Store</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-3">
              {cart.map(({ product, quantity }) => (
                <Card key={product.id} className="p-4 rounded-none border-2 border-border">
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-none overflow-hidden bg-muted shrink-0 border-2 border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="text-xs text-muted-foreground font-medium">{product.category} • {product.material}</div>
                      <div className="font-bold text-sm text-foreground">{product.name}</div>
                      <div className="text-xs font-extrabold text-foreground">₹{product.price}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>

                      <div className="flex items-center gap-2 border-2 border-border rounded-none p-1 bg-muted">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          className="size-6 rounded-none bg-background flex items-center justify-center text-xs font-bold shadow-xs hover:bg-primary cursor-pointer border"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product.id, quantity + 1)}
                          className="size-6 rounded-none bg-background flex items-center justify-center text-xs font-bold shadow-xs hover:bg-primary cursor-pointer border"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="border-2 border-border rounded-none overflow-hidden">
              <CardHeader className="bg-primary/10 border-b border-primary/30 pb-4">
                <CardTitle className="text-lg font-extrabold">Order Summary</CardTitle>
                <CardDescription className="text-xs">
                  Review shipping address and select payment method.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 text-xs">
                <div className="space-y-2 border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cart.length} items):</span>
                    <span className="font-semibold text-foreground">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee:</span>
                    <span>{shippingFee === 0 ? <b className="text-foreground bg-primary px-1.5 py-0.5 font-bold">FREE</b> : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST Tax (5%):</span>
                    <span className="font-semibold text-foreground">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold border-t border-border pt-2">
                    <span>Total Amount:</span>
                    <span className="text-foreground text-xl">₹{total}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-muted-foreground block">Delivery Address</label>
                  <div className="p-3 rounded-none border-2 border-border bg-background text-xs space-y-1">
                    <div className="font-bold text-foreground">{selectedAddress.fullName}</div>
                    <div>{selectedAddress.streetAddress}, {selectedAddress.city}</div>
                    <div className="text-muted-foreground">Phone: {selectedAddress.phone}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-muted-foreground block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2.5 rounded-none border-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'UPI' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                      }`}
                    >
                      <Smartphone className="size-4" /> Instant UPI
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('WALLET')}
                      className={`p-2.5 rounded-none border-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'WALLET' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                      }`}
                    >
                      <Wallet className="size-4" /> Recyclo Earnings
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted border-t-2 border-border p-4 sm:p-6">
                <Button
                  onClick={handleCheckout}
                  className="w-full font-extrabold h-12 text-sm gap-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 border border-black/10 shadow-xs"
                >
                  Confirm Order & Pay ₹{total} <ArrowRight className="size-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
