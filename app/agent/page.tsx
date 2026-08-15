'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, ArrowRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';

export default function AgentDashboardPage() {
  const { activeAgent, listings } = useRecycloStore();

  // Find listings assigned to this agent
  const assignedListings = listings.filter(
    (l) => l.assignedAgentId === activeAgent.id || l.status === 'INSPECTION_IN_PROGRESS' || l.status === 'AGENT_ASSIGNED'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-6 rounded-none bg-foreground text-background shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-foreground">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-none overflow-hidden border-2 border-primary shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeAgent.avatarUrl} alt={activeAgent.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-bold text-xs rounded-none border border-black/10">
                Verified Agent #AG809
              </Badge>
              <Badge className="bg-background text-foreground font-bold text-xs rounded-none border border-border">
                Status: {activeAgent.activeStatus}
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-background">{activeAgent.name}</h1>
            <div className="text-xs opacity-80 mt-0.5">
              Operating Zone: {activeAgent.city} • Rating: {activeAgent.rating} ⭐ ({activeAgent.completedPickupsCount} pickups completed)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="p-3 rounded-none bg-background/10 text-center border border-background/20">
            <div className="text-xl font-extrabold text-background">{assignedListings.length}</div>
            <div className="opacity-80">Assigned Pickups</div>
          </div>

          <div className="p-3 rounded-none bg-background/10 text-center border border-background/20">
            <div className="text-xl font-extrabold text-background">{activeAgent.completedPickupsCount}</div>
            <div className="opacity-80">Total Completed</div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Today&apos;s Assigned Pickup Schedule</h2>
            <p className="text-xs text-muted-foreground">
              Perform physical item-by-item verification at customer location.
            </p>
          </div>
          <Badge variant="outline" className="bg-muted rounded-none font-bold">
            {assignedListings.length} Jobs Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {assignedListings.map((listing) => (
            <Card key={listing.id} className="border-2 border-primary hover:border-foreground transition-colors rounded-none">
              <CardHeader className="pb-3 bg-primary/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-none bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm border border-black/10">
                      #{listing.id}
                    </div>
                    <div>
                      <div className="font-bold text-base text-foreground">
                        Customer: {listing.userName}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-foreground font-semibold">
                          <Phone className="size-3 text-foreground" /> {listing.userPhone}
                        </span>
                        <span>• Scheduled: {listing.pickupDate} ({listing.pickupTimeSlot})</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs px-3 py-1 font-bold self-start sm:self-auto rounded-none bg-foreground text-background">
                    {listing.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-none bg-muted text-xs border border-border">
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1">
                      <MapPin className="size-3.5 text-foreground" /> Pickup Address:
                    </div>
                    <div>{listing.pickupAddress.streetAddress}, {listing.pickupAddress.landmark}</div>
                    <div className="text-muted-foreground">{listing.pickupAddress.city} - {listing.pickupAddress.pincode}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">Special Instructions:</div>
                    <div className="text-muted-foreground italic">
                      &quot;{listing.pickupInstructions || 'Ring doorbell upon arrival.'}&quot;
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">
                    Expected Clothing Items ({listing.items.length} garments):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {listing.items.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-none border-2 border-border bg-background text-xs space-y-1">
                        <div className="font-bold text-foreground">
                          Item #{idx + 1}: {item.category} ({item.gender})
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.material} • {item.condition}
                        </div>
                        <div className="text-xs font-bold text-foreground">
                          Est. Val: ₹{item.initialEstimatedValue}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <div className="px-6 py-4 border-t bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground">
                  Initial Container Estimate: <b className="text-foreground text-sm">₹{listing.initialEstimatedTotal}</b>
                </div>

                <Link href={`/agent/inspect/${listing.id}`}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 text-xs rounded-none border border-black/10">
                    <Truck className="size-4" /> Start Item Physical Inspection <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
