'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Droplets, Cloud, Shirt, Recycle, Sparkles, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';
import { calculateEnvironmentalImpact } from '@/lib/pricing-engine';

export default function ImpactPage() {
  const { currentUser } = useRecycloStore();

  const userImpact = calculateEnvironmentalImpact(
    currentUser.totalItemsRecycled,
    currentUser.totalKgRecycled
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="outline" className="bg-primary text-primary-foreground border-primary rounded-none font-bold">
          Personal & Community Environmental Metrics
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Recyclo Environmental Impact
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Every garment submitted to Recyclo diverts textiles from landfills, conserves groundwater, and prevents CO2 emissions from raw cotton farming and synthetic fabric manufacturing.
        </p>
      </div>

      <Card className="border-2 border-primary bg-primary/10 overflow-hidden shadow-xl rounded-none">
        <CardHeader className="border-b border-primary/30 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-none bg-primary text-primary-foreground flex items-center justify-center shadow-md border border-black/10">
                <Trophy className="size-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentUser.name}&apos;s Recycling Contribution</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Verified metrics across {currentUser.totalListingsCount} completed recycling requests
                </CardDescription>
              </div>
            </div>

            <Badge variant="outline" className="bg-foreground text-background font-bold px-3 py-1 rounded-none border-foreground">
              Top 5% Eco Recycler
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-none bg-background border-2 border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Textile Waste Recovered</span>
                <Leaf className="size-4 text-primary fill-primary" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{userImpact.weightKg} kg</div>
              <p className="text-[11px] text-muted-foreground">Diverted completely from city landfills</p>
            </div>

            <div className="p-5 rounded-none bg-background border-2 border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Groundwater Conserved</span>
                <Droplets className="size-4 text-foreground" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{userImpact.waterSavedLiters.toLocaleString()} L</div>
              <p className="text-[11px] text-muted-foreground">Saved from raw cotton irrigation & dyeing</p>
            </div>

            <div className="p-5 rounded-none bg-background border-2 border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>CO2 Emissions Avoided</span>
                <Cloud className="size-4 text-foreground" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{userImpact.co2SavedKg} kg</div>
              <p className="text-[11px] text-muted-foreground">Equivalent to 62 km driven in a car</p>
            </div>

            <div className="p-5 rounded-none bg-background border-2 border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
                <span>Garments Collected</span>
                <Shirt className="size-4 text-primary fill-primary" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{userImpact.itemsCount} items</div>
              <p className="text-[11px] text-muted-foreground">Processed into upcycled store goods</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-none border-2 border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="size-5 text-foreground" /> Why Textile Recycling Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              Textiles account for over <b>8.5% of municipal solid waste</b> in urban India. Synthetic fibers like polyester take over 200 years to decompose in landfills, releasing microplastics into groundwater.
            </p>
            <p>
              Manufacturing a single cotton shirt requires over <b>2,700 liters of fresh water</b>. By recycling and upcycling existing garments, Recyclo reduces the demand for virgin cotton farming and toxic chemical dyeing.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-none border-2 border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Recycle className="size-5 text-foreground" /> Our Science-Backed Estimation Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              Our environmental formulas are modeled on standard life-cycle assessment (LCA) data for post-consumer textile recovery:
            </p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li><b>1 kg Recycled Textile</b> = ~14.5 kg CO2 avoided</li>
              <li><b>1 kg Recycled Cotton</b> = ~2,700 Liters groundwater saved</li>
              <li><b>1 Upcycled Denim Tote Bag</b> = Diverts ~0.65 kg heavy denim from landfills</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <div className="text-center pt-4">
        <Link href="/recycle/create">
          <Button size="lg" className="gap-2 font-bold px-8 rounded-none border border-black/10">
            <Recycle className="size-5" /> Increase Your Environmental Impact Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
