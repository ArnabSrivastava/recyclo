import React from 'react';
import Link from 'next/link';
import {
  Recycle,
  CheckCircle2,
  Scale,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="outline" className="bg-primary text-primary-foreground border-primary rounded-none font-bold">
          Transparent Circular Economy
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          How Recyclo Works
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          From doorstep pickup to physical inspection, instant cash payout, and batch upcycling — explore how Recyclo turns textile waste into value.
        </p>
      </div>

      {/* 12-Step Detailed Workflow timeline */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold border-b pb-3">The 12-Step Recycling Journey</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-l-4 border-l-primary border-2 border-border rounded-none">
            <CardHeader className="pb-2">
              <div className="text-xs font-bold text-foreground bg-primary/20 inline-block px-2 py-0.5 border border-primary/40 w-max">STEP 01 - 03</div>
              <CardTitle className="text-lg mt-2">1. Create & Add Clothes</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Start a new recycling request. Add your first clothing item (e.g. Blue Cotton Shirt, Size L, Good Condition).</p>
              <p>Click <b>&quot;+ Add Another Item&quot;</b> to include all your unwanted garments in one single listing.</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary border-2 border-border rounded-none">
            <CardHeader className="pb-2">
              <div className="text-xs font-bold text-foreground bg-primary/20 inline-block px-2 py-0.5 border border-primary/40 w-max">STEP 04 - 05</div>
              <CardTitle className="text-lg mt-2">2. Instant Value Estimation</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Our pricing engine calculates an <b>Initial Estimated Value</b> based on category base rates, material multipliers, condition rating, and weight.</p>
              <p>Example: Shirt (₹150) + T-Shirt (₹100) + Kurta (₹200) = Total Estimate ₹450.</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary border-2 border-border rounded-none">
            <CardHeader className="pb-2">
              <div className="text-xs font-bold text-foreground bg-primary/20 inline-block px-2 py-0.5 border border-primary/40 w-max">STEP 06 - 08</div>
              <CardTitle className="text-lg mt-2">3. Address & Time Slot</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Select your pickup address and pick a preferred date and time slot (e.g., Tomorrow 10 AM - 1 PM).</p>
              <p>Review the full listing breakdown and submit your request.</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-foreground border-2 border-border rounded-none">
            <CardHeader className="pb-2">
              <div className="text-xs font-bold text-background bg-foreground inline-block px-2 py-0.5 w-max">STEP 09 - 10</div>
              <CardTitle className="text-lg mt-2">4. Agent Physical Inspection</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>An authorized Recyclo Pickup Agent (e.g. Vikram Singh) arrives at your location.</p>
              <p>The agent inspects every clothing item individually against submitted photos, checking for stains, tears, or fabric wear.</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-foreground border-2 border-border rounded-none">
            <CardHeader className="pb-2">
              <div className="text-xs font-bold text-background bg-foreground inline-block px-2 py-0.5 w-max">STEP 11</div>
              <CardTitle className="text-lg mt-2">5. Value Adjustment & Sign-Off</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p className="flex items-center flex-wrap gap-1">
                <span>Items match</span>
                <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                <span>Accepted at full price. Minor damage detected</span>
                <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                <span>System recalculates value with reported issue tags.</span>
              </p>
              <p className="flex items-center flex-wrap gap-1">
                <span>Agent confirms final total (e.g. Original ₹450</span>
                <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                <span>Final ₹400). Payout is locked.</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary border-2 border-border rounded-none">
            <CardHeader className="pb-2">
              <div className="text-xs font-bold text-foreground bg-primary/20 inline-block px-2 py-0.5 border border-primary/40 w-max">STEP 12</div>
              <CardTitle className="text-lg mt-2">6. Payout & Batch Processing</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Payment is transferred directly to your UPI ID or bank account within 24h.</p>
              <p>Collected garments are sorted, cleaned, and upcycled into tote bags, sleeves, and decor sold on the Recyclo store!</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Rule Policy Box */}
      <section className="p-8 rounded-none bg-card border-2 border-primary shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-none bg-primary text-primary-foreground flex items-center justify-center font-bold border border-black/10">
            <Scale className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Pricing Transparency & Inspection Rules</h3>
            <p className="text-xs text-muted-foreground">Fair business rules protecting both sellers and recyclers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-muted-foreground">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5 fill-primary" />
              <span><b>Estimate $\neq$ Guaranteed Payout</b>: The online estimate is generated by our pricing algorithm. Physical inspection confirms the final item condition.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 shrink-0 mt-0.5 fill-primary text-foreground" />
              <span><b>Rule 8 Enforced</b>: The pickup agent <i>cannot increase</i> the initial estimated price above the system calculation unless an authorized administrator overrides it.</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5 fill-primary" />
              <span className="inline-flex items-center flex-wrap gap-1">
                <b>Itemized Adjustments</b>: If a Kurta has a minor tear, the agent uploads an inspection image and selects the issue tag. The system recalculates value transparently (e.g. ₹200 <ChevronRight className="size-3 inline shrink-0" /> ₹150).
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5 fill-primary" />
              <span><b>Partial Acceptance Supported</b>: If 1 out of 4 items is un-recyclable/unusable, it is marked rejected (₹0), while the remaining 3 items are accepted and paid out.</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-6">
        <Link href="/recycle/create">
          <Button size="lg" className="px-8 font-bold gap-2 rounded-none border border-black/10">
            <Recycle className="size-5" /> Start Your Recycling Listing Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
