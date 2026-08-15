import React from 'react';
import Link from 'next/link';
import { Recycle, Heart, ShieldCheck, Truck, Sparkles, ChevronRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card text-card-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-none bg-primary flex items-center justify-center text-primary-foreground">
                <Recycle className="size-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">Recyclo</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Recyclo is India&apos;s leading circular textile recycling platform. We turn old unwanted garments into value for sellers, and upcycle raw textiles into beautiful sustainable goods.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-primary" /> Verified Inspection</span>
              <span className="flex items-center gap-1"><Truck className="size-3.5 text-primary" /> Free Pickup</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Recycling Flow</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/recycle/create" className="hover:text-foreground">Recycle Your Clothes</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground">Pricing Engine & Rules</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Track Your Pickups</Link></li>
              <li><Link href="/wallet" className="hover:text-foreground">Instant Earnings Wallet</Link></li>
              <li><Link href="/impact" className="hover:text-foreground">Personal Impact Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Upcycled Marketplace</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/store" className="hover:text-foreground">Browse Upcycled Store</Link></li>
              <li><Link href="/store?cat=Fashion" className="hover:text-foreground">Denim Tote Bags</Link></li>
              <li><Link href="/store?cat=Home" className="hover:text-foreground">Cushion Covers & Decor</Link></li>
              <li><Link href="/store?cat=Lifestyle" className="hover:text-foreground">Padded Laptop Sleeves</Link></li>
              <li><Link href="/store?cat=Recycled Materials" className="hover:text-foreground">Artisan Fabric Bundles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Circular Traceability</h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Every item collected is tracked digitally through batch processing into finished store products. Zero textile waste to landfill.
            </p>
            <div className="p-3 rounded-none bg-muted/60 text-xs border border-border/40 space-y-1.5">
              <div className="font-semibold text-primary flex items-center gap-1"><Sparkles className="size-3" /> 100% Transparency</div>
              <div className="text-[11px] text-muted-foreground flex items-center flex-wrap gap-1 leading-snug">
                <span>Item estimation</span>
                <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                <span>Physical verification</span>
                <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                <span>Payout</span>
                <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                <span>Batch processing</span>
                <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                <span>Store</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <div>
            © {new Date().getFullYear()} Recyclo Eco Platform Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Made with <Heart className="size-3.5 text-red-500 fill-red-500" /> for Zero-Waste India
          </div>
        </div>
      </div>
    </footer>
  );
}
