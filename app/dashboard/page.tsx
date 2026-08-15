'use client';

import React from 'react';
import Link from 'next/link';
import {
  Recycle,
  Truck,
  IndianRupee,
  Leaf,
  Plus,
  Eye,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';
import { ListingStatus } from '@/lib/types';

export default function CustomerDashboardPage() {
  const { currentUser, listings } = useRecycloStore();

  const userListings = listings.filter((l) => l.userId === currentUser.id);

  const activeListings = userListings.filter(
    (l) => !['COMPLETED', 'PAYMENT_COMPLETED', 'CANCELLED'].includes(l.status)
  );
  const completedListings = userListings.filter((l) =>
    ['COMPLETED', 'PAYMENT_COMPLETED'].includes(l.status)
  );

  const statusBadges: Record<ListingStatus, { label: string; variant: 'default' | 'secondary' | 'warning' | 'success' | 'info' }> = {
    DRAFT: { label: 'Draft', variant: 'secondary' },
    SUBMITTED: { label: 'Submitted', variant: 'info' },
    AWAITING_PICKUP: { label: 'Awaiting Pickup', variant: 'info' },
    PICKUP_SCHEDULED: { label: 'Pickup Scheduled', variant: 'info' },
    AGENT_ASSIGNED: { label: 'Agent Assigned', variant: 'info' },
    AGENT_ON_THE_WAY: { label: 'Agent On The Way', variant: 'warning' },
    AGENT_ARRIVED: { label: 'Agent Arrived', variant: 'warning' },
    INSPECTION_IN_PROGRESS: { label: 'Inspection In Progress', variant: 'warning' },
    INSPECTION_COMPLETED: { label: 'Inspection Completed', variant: 'success' },
    PICKUP_COMPLETED: { label: 'Pickup Completed', variant: 'success' },
    PAYMENT_PROCESSING: { label: 'Payment Processing', variant: 'warning' },
    PAYMENT_COMPLETED: { label: 'Payment Completed', variant: 'success' },
    PROCESSING: { label: 'Batch Processing', variant: 'info' },
    RECYCLED: { label: 'Recycled', variant: 'success' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'secondary' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 rounded-none">
              Customer Portal
            </Badge>
            <span className="text-xs text-muted-foreground">User ID: {currentUser.id}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {currentUser.name}!</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your active recycling requests, track pickup agents, and view instant wallet earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/recycle/create">
            <Button className="gap-2 font-bold shadow-md rounded-none">
              <Plus className="size-4" /> Recycle Clothes Now
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              <span>Active Recycling Requests</span>
              <Truck className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">{activeListings.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            {activeListings.length > 0 ? `${activeListings[0].items.length} items awaiting inspection` : 'No active pickups right now'}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              <span>Total Payouts Earned</span>
              <IndianRupee className="size-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-foreground">₹{currentUser.totalEarnings}</CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground flex justify-between items-center">
            <span>Verified physical inspection payouts</span>
            <Link href="/wallet" className="text-primary hover:underline font-semibold flex items-center gap-0.5">
              <span>View Ledger</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              <span>Textile Waste Recycled</span>
              <Leaf className="size-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">{currentUser.totalKgRecycled} kg</CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            {currentUser.totalItemsRecycled} garments diverted from landfill
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              <span>Total Completed Requests</span>
              <CheckCircle2 className="size-4 text-purple-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">{completedListings.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            100% material traceability guaranteed
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Active Recycling Requests ({activeListings.length})</h2>
          <Link href="/recycle/create">
            <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary gap-1 rounded-none">
              <Plus className="size-3.5" /> New Request
            </Button>
          </Link>
        </div>

        {activeListings.length === 0 ? (
          <Card className="p-8 text-center space-y-4 bg-muted/30 rounded-none">
            <div className="size-12 rounded-none bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Recycle className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold">No Clothes Recycled Yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Give your unused clothes a second life. List your unwanted garments, view price estimates, and schedule a pickup.
              </p>
            </div>
            <Link href="/recycle/create">
              <Button size="sm" className="font-bold rounded-none">
                Start Recycling Clothes
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeListings.map((listing) => {
              const badgeInfo = statusBadges[listing.status] || { label: listing.status, variant: 'default' };

              return (
                <Card key={listing.id} className="border-2 border-primary/20 hover:border-primary/40 transition-colors rounded-none">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-none bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                          #{listing.id}
                        </div>
                        <div>
                          <div className="font-bold text-base">
                            Listing #{listing.id} ({listing.items.length} items)
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Pickup Date: <b className="text-foreground">{listing.pickupDate}</b> • Slot: {listing.pickupTimeSlot}
                          </div>
                        </div>
                      </div>

                      <Badge variant={badgeInfo.variant} className="self-start sm:self-auto text-xs px-3 py-1 font-semibold rounded-none">
                        {badgeInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-2 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-none bg-muted/40 text-xs">
                      <div>
                        <div className="text-muted-foreground">Assigned Pickup Agent:</div>
                        <div className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                          <Truck className="size-3.5 text-primary" />
                          {listing.assignedAgentName || 'Assigning soon...'}
                        </div>
                      </div>

                      <div>
                        <div className="text-muted-foreground">Pickup Address:</div>
                        <div className="font-semibold text-foreground truncate mt-0.5">
                          {listing.pickupAddress.streetAddress}, {listing.pickupAddress.city}
                        </div>
                      </div>

                      <div>
                        <div className="text-muted-foreground">Estimated Payout Total:</div>
                        <div className="font-extrabold text-foreground text-sm mt-0.5">
                          ₹{listing.initialEstimatedTotal}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                      {listing.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-2.5 py-1 rounded-none border bg-background text-xs shrink-0">
                          <span className="font-semibold">{item.category}</span>
                          <span className="text-muted-foreground">({item.material})</span>
                          <span className="text-primary font-bold">₹{item.initialEstimatedValue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <div className="px-6 py-3 border-t bg-muted/20 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Created on {new Date(listing.createdAt).toLocaleDateString()}
                    </span>

                    <Link href={`/listings/${listing.id}`}>
                      <Button size="sm" className="gap-1 font-semibold rounded-none">
                        <Eye className="size-3.5" /> View Listing & Inspection Breakdown
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight">Completed Recycling History</h2>

        <div className="rounded-none border bg-card overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b">
              <tr>
                <th className="p-3.5">Listing ID</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Initial Estimate</th>
                <th className="p-3.5">Final Payout</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {completedListings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">
                    No completed recycling listings yet.
                  </td>
                </tr>
              ) : (
                completedListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-muted/30">
                    <td className="p-3.5 font-bold text-foreground">#{listing.id}</td>
                    <td className="p-3.5 text-muted-foreground">{listing.pickupDate}</td>
                    <td className="p-3.5">{listing.items.length} garments</td>
                    <td className="p-3.5 text-muted-foreground">₹{listing.initialEstimatedTotal}</td>
                    <td className="p-3.5 font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₹{listing.finalPayoutTotal ?? listing.initialEstimatedTotal}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="success" className="text-[10px] rounded-none">
                        Payment Received
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link href={`/listings/${listing.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs font-semibold text-primary rounded-none">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
