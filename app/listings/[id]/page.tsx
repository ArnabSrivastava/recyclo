'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { listings, activeRole, createDispute, auditLogs } = useRecycloStore();

  const listing = listings.find((l) => l.id === resolvedParams.id);

  // Dispute modal state
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeIssueType, setDisputeIssueType] = useState<'PRICE_REDUCTION' | 'INSPECTION_RESULT' | 'ITEM_REJECTION' | 'PAYMENT_ISSUE'>('PRICE_REDUCTION');
  const [disputeExplanation, setDisputeExplanation] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Listing Not Found</h1>
        <p className="text-sm text-muted-foreground">Listing ID #{resolvedParams.id} could not be found.</p>
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-none border-2 border-foreground font-bold">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const listingAuditLogs = auditLogs.filter((l) => l.entityId === listing.id);

  const handleRaiseDispute = (e: React.FormEvent) => {
    e.preventDefault();
    createDispute({
      listingId: listing.id,
      userId: listing.userId,
      userName: listing.userName,
      issueType: disputeIssueType,
      explanation: disputeExplanation,
    });
    setDisputeSubmitted(true);
    setTimeout(() => {
      setShowDisputeModal(false);
      setDisputeSubmitted(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-none">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary text-primary-foreground border-primary rounded-none font-bold">
                Listing #{listing.id}
              </Badge>
              <Badge variant="success" className="text-xs rounded-none font-bold">
                {listing.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">
              Recycling Request Summary ({listing.items.length} Items)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeRole === 'AGENT' && (
            <Link href={`/agent/inspect/${listing.id}`}>
              <Button className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold gap-1.5 text-xs rounded-none border border-black/10 shadow-xs">
                <Truck className="size-4" /> Agent Inspection Portal
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            onClick={() => setShowDisputeModal(true)}
            className="h-10 px-4 text-xs font-bold border-2 border-foreground text-foreground hover:bg-foreground hover:text-background gap-1.5 rounded-none"
          >
            <ShieldAlert className="size-4 text-foreground" /> Raise Dispute / Inquiry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/10 border-2 border-primary md:col-span-2 rounded-none">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground font-semibold">Initial Estimate</div>
                <div className="text-2xl font-extrabold text-foreground">₹{listing.initialEstimatedTotal}</div>
                <div className="text-[11px] text-muted-foreground">Pre-inspection estimate</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground font-semibold">Verified Final Payout</div>
                <div className="text-2xl font-extrabold text-foreground">
                  ₹{listing.finalPayoutTotal ?? listing.initialEstimatedTotal}
                </div>
                <div className="text-[11px] text-muted-foreground">Confirmed by pickup agent</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground font-semibold">Net Price Adjustment</div>
                <div className="text-2xl font-extrabold text-foreground">
                  {listing.finalPayoutTotal && listing.finalPayoutTotal !== listing.initialEstimatedTotal ? (
                    <span className="text-destructive font-extrabold">
                      -₹{listing.initialEstimatedTotal - listing.finalPayoutTotal}
                    </span>
                  ) : (
                    <span className="text-foreground font-extrabold">₹0 (Matched)</span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground">Based on item condition</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
              <Truck className="size-4 text-foreground" /> Assigned Pickup Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1.5 pt-0">
            <div className="font-bold text-sm text-foreground">{listing.assignedAgentName || 'Agent Pending'}</div>
            <div className="text-muted-foreground">Pickup Date: <b>{listing.pickupDate}</b></div>
            <div className="text-muted-foreground">Time Slot: {listing.pickupTimeSlot}</div>
            <div className="text-muted-foreground truncate">Location: {listing.pickupAddress.streetAddress}</div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Item-by-Item Verification Report</h2>
            <p className="text-xs text-muted-foreground">
              Every item is inspected individually against user submitted details.
            </p>
          </div>

          <Badge variant="outline" className="bg-muted rounded-none border-2 border-border font-bold text-xs">
            Container Total: {listing.items.length} garments
          </Badge>
        </div>

        <div className="space-y-4">
          {listing.items.map((item, index) => {
            const isAdjusted = item.inspectionResult === 'ADJUSTED';
            const isRejected = item.inspectionResult === 'REJECTED';

            return (
              <Card
                key={item.id}
                className={`border-2 rounded-none ${
                  isRejected
                    ? 'border-destructive/40 bg-destructive/10'
                    : isAdjusted
                    ? 'border-foreground/40 bg-foreground/5'
                    : 'border-border'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-none overflow-hidden bg-muted shrink-0 border-2 border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.userImages[0]} alt={item.category} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base">
                            Item #{index + 1}: {item.category}
                          </span>
                          <Badge variant="outline" className="text-[10px] rounded-none font-bold uppercase tracking-wider">
                            {item.gender} • {item.material} • Size {item.size}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Brand: {item.brand || 'Generic'} • Color: {item.color} • Weight: {item.weightKg}kg
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.inspectionResult === 'ACCEPTED' && (
                        <Badge variant="outline" className="gap-1 font-bold rounded-none bg-primary text-primary-foreground border border-black/10">
                          <CheckCircle2 className="size-3.5" /> Accepted
                        </Badge>
                      )}
                      {item.inspectionResult === 'ADJUSTED' && (
                        <Badge variant="outline" className="gap-1 font-bold rounded-none bg-foreground text-background border border-foreground">
                          <AlertTriangle className="size-3.5" /> Adjusted With Issue
                        </Badge>
                      )}
                      {item.inspectionResult === 'REJECTED' && (
                        <Badge variant="destructive" className="gap-1 font-bold rounded-none">
                          <XCircle className="size-3.5" /> Rejected (₹0)
                        </Badge>
                      )}
                      {!item.inspectionResult && (
                        <Badge variant="outline" className="text-xs rounded-none font-bold">
                          Pending Inspection
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 text-xs space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-none bg-background border-2 border-border text-xs">
                    <div>
                      <div className="text-muted-foreground">Original Estimate:</div>
                      <div className="font-bold text-foreground text-sm">₹{item.initialEstimatedValue}</div>
                    </div>

                    <div>
                      <div className="text-muted-foreground">System Recalculated:</div>
                      <div className="font-bold text-foreground text-sm">
                        ₹{item.systemRecalculatedValue ?? item.initialEstimatedValue}
                      </div>
                    </div>

                    <div>
                      <div className="text-muted-foreground">Agent Final Confirmed:</div>
                      <div className="font-extrabold text-foreground text-sm">
                        ₹{item.agentFinalValue ?? item.initialEstimatedValue}
                      </div>
                    </div>
                  </div>

                  {item.reportedIssues && item.reportedIssues.length > 0 && (
                    <div className="p-3 rounded-none bg-muted/60 border-2 border-border text-foreground space-y-1">
                      <div className="font-semibold flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="size-4 text-foreground" />
                        Reported Physical Defect / Issue: {item.reportedIssues.join(', ')} ({item.issueSeverity} Severity)
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Agent Note: &quot;{item.inspectionNotes || 'Minor fabric tear observed during manual inspection.'}&quot;
                      </p>
                    </div>
                  )}

                  {item.inspectionImages && item.inspectionImages.length > 0 && (
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-muted-foreground text-[11px] font-semibold">Agent Photo Proof:</span>
                      <div className="size-14 rounded-none overflow-hidden border-2 border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.inspectionImages[0]} alt="Agent photo" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">System Audit Trail History</h2>
        <Card className="rounded-none border-2 border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {listingAuditLogs.length === 0 ? (
                <div className="text-xs text-muted-foreground">No audit logs recorded yet.</div>
              ) : (
                listingAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 border-l-2 border-primary pl-4 py-1 text-xs">
                    <div>
                      <div className="font-semibold text-foreground">{log.action.replace(/_/g, ' ')}</div>
                      <div className="text-muted-foreground text-[11px] mt-0.5">{log.details}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        By {log.performedBy} ({log.performedByRole}) at {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Dialog open={showDisputeModal} onOpenChange={setShowDisputeModal}>
        <DialogHeader>
          <DialogTitle>Raise Inquiry or Dispute for Listing #{listing.id}</DialogTitle>
          <DialogDescription className="text-xs">
            Our Recyclo Operations team will review inspection images and notes within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {disputeSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="size-12 text-primary mx-auto" />
            <h3 className="text-lg font-bold">Dispute Submitted</h3>
            <p className="text-xs text-muted-foreground">Case assigned to Recyclo Support.</p>
          </div>
        ) : (
          <form onSubmit={handleRaiseDispute} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Dispute Category</label>
              <Select
                value={disputeIssueType}
                onChange={(e) => setDisputeIssueType(e.target.value as typeof disputeIssueType)}
                className="rounded-none border-2 border-border"
              >
                <option value="PRICE_REDUCTION">Unfair Price Reduction</option>
                <option value="INSPECTION_RESULT">Incorrect Defect / Issue Flag</option>
                <option value="ITEM_REJECTION">Item Rejection Issue</option>
                <option value="PAYMENT_ISSUE">Payment Transfer Delay</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Detailed Explanation</label>
              <Input
                placeholder="Explain why you disagree with the physical inspection or payout..."
                value={disputeExplanation}
                onChange={(e) => setDisputeExplanation(e.target.value)}
                required
                className="rounded-none border-2 border-border"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDisputeModal(false)} className="rounded-none border-2 border-foreground font-bold">
                Cancel
              </Button>
              <Button type="submit" className="font-extrabold rounded-none bg-primary text-primary-foreground border border-black/10">
                Submit Dispute Case
              </Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </div>
  );
}
