'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';
import { recalculateItemInspectionValue } from '@/lib/pricing-engine';
import { InspectionStatus, InspectionIssue, ClothingCondition } from '@/lib/types';

export default function PhysicalInspectionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { listings, updateItemInspection, confirmListingInspection } = useRecycloStore();

  const listing = listings.find((l) => l.id === resolvedParams.id);

  const [inspectionDrafts, setInspectionDrafts] = useState<
    Record<
      string,
      {
        result: InspectionStatus;
        condition: ClothingCondition;
        issues: InspectionIssue[];
        severity: 'Minor' | 'Moderate' | 'Severe';
        notes: string;
        finalVal: number;
        rejectionReason: string;
        photoUploaded: boolean;
      }
    >
  >(() => {
    if (!listing) return {};
    const init: Record<
      string,
      {
        result: InspectionStatus;
        condition: ClothingCondition;
        issues: InspectionIssue[];
        severity: 'Minor' | 'Moderate' | 'Severe';
        notes: string;
        finalVal: number;
        rejectionReason: string;
        photoUploaded: boolean;
      }
    > = {};
    listing.items.forEach((item) => {
      init[item.id] = {
        result: item.inspectionResult || 'ACCEPTED',
        condition: item.condition || 'GOOD',
        issues: item.reportedIssues || [],
        severity: item.issueSeverity || 'Minor',
        notes: item.inspectionNotes || '',
        finalVal: item.agentFinalValue ?? item.initialEstimatedValue,
        rejectionReason: item.rejectionReason || '',
        photoUploaded: !!item.inspectionImages?.length,
      };
    });
    return init;
  });

  const [activeItemIndex, setActiveItemIndex] = useState(0);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Listing Not Found</h1>
        <Link href="/agent">
          <Button variant="outline" className="rounded-none border-2 border-foreground font-bold">Back to Agent Dashboard</Button>
        </Link>
      </div>
    );
  }

  const activeItem = listing.items[activeItemIndex];
  const activeDraft = inspectionDrafts[activeItem.id] || {
    result: 'ACCEPTED',
    condition: activeItem.condition,
    issues: [],
    severity: 'Minor',
    notes: '',
    finalVal: activeItem.initialEstimatedValue,
    rejectionReason: '',
    photoUploaded: false,
  };

  const recalcResult = recalculateItemInspectionValue(
    activeItem.initialEstimatedValue,
    activeItem.category,
    activeItem.material,
    activeDraft.condition,
    activeDraft.issues,
    activeDraft.severity
  );

  const updateDraft = (itemId: string, updates: Partial<typeof activeDraft>) => {
    setInspectionDrafts((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], ...updates },
    }));
  };

  const handleSaveItemInspection = () => {
    updateItemInspection(
      listing.id,
      activeItem.id,
      activeDraft.result,
      activeDraft.issues,
      activeDraft.severity,
      activeDraft.notes,
      activeDraft.result === 'REJECTED' ? 0 : activeDraft.finalVal,
      activeDraft.rejectionReason
    );

    if (activeItemIndex < listing.items.length - 1) {
      setActiveItemIndex(activeItemIndex + 1);
    }
  };

  const containerFinalTotal = listing.items.reduce((acc, item) => {
    const d = inspectionDrafts[item.id];
    if (!d) return acc + item.initialEstimatedValue;
    if (d.result === 'REJECTED') return acc;
    return acc + (d.finalVal ?? item.initialEstimatedValue);
  }, 0);

  const handleCompletePickup = () => {
    listing.items.forEach((item) => {
      const d = inspectionDrafts[item.id];
      if (d) {
        updateItemInspection(
          listing.id,
          item.id,
          d.result,
          d.issues,
          d.severity,
          d.notes,
          d.result === 'REJECTED' ? 0 : d.finalVal,
          d.rejectionReason
        );
      }
    });

    confirmListingInspection(listing.id, containerFinalTotal);
    router.push(`/listings/${listing.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/agent">
            <Button variant="ghost" size="icon" className="rounded-none">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-extrabold rounded-none border border-black/10">
                AGENT INSPECTION PORTAL
              </Badge>
              <Badge variant="outline" className="rounded-none border-2 border-border font-bold">Listing #{listing.id}</Badge>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">
              Physical Inspection — {listing.userName} ({listing.items.length} garments)
            </h1>
          </div>
        </div>

        <div className="text-right text-xs">
          <div className="text-muted-foreground">Original Estimate: <b>₹{listing.initialEstimatedTotal}</b></div>
          <div className="text-base font-extrabold text-foreground">
            Confirmed Payout: ₹{containerFinalTotal}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-base font-bold">Select Garment to Inspect</h2>

          <div className="space-y-3">
            {listing.items.map((item, idx) => {
              const draft = inspectionDrafts[item.id];
              const isSelected = activeItemIndex === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItemIndex(idx)}
                  className={`p-4 rounded-none border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-xs'
                      : 'border-border bg-card hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-none overflow-hidden bg-muted border-2 border-border shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.userImages[0]} alt={item.category} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">
                          Item #{idx + 1}: {item.category}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Est: ₹{item.initialEstimatedValue}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {draft?.result === 'ACCEPTED' && (
                        <Badge variant="outline" className="text-[10px] rounded-none bg-primary text-primary-foreground font-bold border border-black/10">
                          Accepted (₹{draft.finalVal})
                        </Badge>
                      )}
                      {draft?.result === 'ADJUSTED' && (
                        <Badge variant="outline" className="text-[10px] rounded-none bg-foreground text-background font-bold border border-foreground">
                          Adjusted (₹{draft.finalVal})
                        </Badge>
                      )}
                      {draft?.result === 'REJECTED' && (
                        <Badge variant="destructive" className="text-[10px] rounded-none font-bold">
                          Rejected (₹0)
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Card className="border-2 border-border bg-muted/40 rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-1.5 font-extrabold text-foreground">
                <FileCheck className="size-5 text-foreground" /> Inspection Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs pt-0">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Original Estimate:</span>
                <span className="font-bold text-foreground">₹{listing.initialEstimatedTotal}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Confirmed Final Total:</span>
                <span className="font-extrabold text-foreground text-sm">
                  ₹{containerFinalTotal}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-foreground">
                <span>Net Inspection Adjustment:</span>
                <span>-₹{listing.initialEstimatedTotal - containerFinalTotal}</span>
              </div>

              <Button
                onClick={handleCompletePickup}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-xs h-11 shadow-xs gap-1.5 mt-2 rounded-none border border-black/10"
              >
                <CheckCircle2 className="size-4" /> Confirm Pickup & Trigger Payout
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="border-2 border-border rounded-none overflow-hidden">
            <CardHeader className="bg-primary/10 border-b border-primary/30 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="bg-primary text-primary-foreground font-bold mb-1 rounded-none border border-black/10">
                    Inspecting Garment #{activeItemIndex + 1}
                  </Badge>
                  <CardTitle className="text-xl font-extrabold">
                    {activeItem.category} ({activeItem.gender}) — Size {activeItem.size}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Compare physical garment against user description: &quot;{activeItem.description || 'No special note'}&quot;
                  </CardDescription>
                </div>

                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Original Estimate</div>
                  <div className="text-2xl font-extrabold text-foreground">₹{activeItem.initialEstimatedValue}</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Step 1: Set Inspection Outcome for Item #{activeItemIndex + 1}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => updateDraft(activeItem.id, { result: 'ACCEPTED', finalVal: activeItem.initialEstimatedValue, issues: [] })}
                    className={`p-3 rounded-none border-2 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      activeDraft.result === 'ACCEPTED'
                        ? 'border-primary bg-primary/20 text-foreground shadow-xs font-extrabold'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <CheckCircle2 className="size-5 text-foreground" />
                    <span>Accepted (Full Price)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateDraft(activeItem.id, {
                        result: 'ADJUSTED',
                        issues: ['Tear'],
                        finalVal: recalcResult.systemRecalculated,
                      })
                    }
                    className={`p-3 rounded-none border-2 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      activeDraft.result === 'ADJUSTED'
                        ? 'border-foreground bg-foreground/10 text-foreground font-extrabold shadow-xs'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <AlertTriangle className="size-5 text-foreground" />
                    <span>Accepted With Adjustment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateDraft(activeItem.id, { result: 'REJECTED', finalVal: 0 })}
                    className={`p-3 rounded-none border-2 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      activeDraft.result === 'REJECTED'
                        ? 'border-destructive bg-destructive/10 text-destructive font-extrabold shadow-xs'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <XCircle className="size-5 text-destructive" />
                    <span>Reject Item (₹0)</span>
                  </button>
                </div>
              </div>

              {activeDraft.result === 'ADJUSTED' && (
                <div className="p-4 rounded-none border-2 border-border bg-muted/40 space-y-4 text-xs">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="size-4 text-foreground" /> Select Defect / Issue & Severity
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Reported Defect</label>
                      <Select
                        value={activeDraft.issues[0] || 'Tear'}
                        onChange={(e) => updateDraft(activeItem.id, { issues: [e.target.value as InspectionIssue] })}
                        className="rounded-none border-2 border-border"
                      >
                        <option value="Tear">Tear / Ripped seam</option>
                        <option value="Stain">Visible Stain / Discoloration</option>
                        <option value="Hole">Hole in fabric</option>
                        <option value="Heavy wear">Heavy wear & tear</option>
                        <option value="Fading">Color fading</option>
                        <option value="Broken zipper">Broken Zipper / Button</option>
                        <option value="Incorrect material">Incorrect Material</option>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Issue Severity</label>
                      <Select
                        value={activeDraft.severity}
                        onChange={(e) => updateDraft(activeItem.id, { severity: e.target.value as 'Minor' | 'Moderate' | 'Severe' })}
                        className="rounded-none border-2 border-border"
                      >
                        <option value="Minor">Minor (-20% adjustment)</option>
                        <option value="Moderate">Moderate (-40% adjustment)</option>
                        <option value="Severe">Severe (-70% adjustment)</option>
                      </Select>
                    </div>
                  </div>

                  <div className="p-3 rounded-none bg-background border-2 border-border flex items-center justify-between">
                    <div>
                      <div className="text-muted-foreground text-[11px]">Formula Recalculated Item Value:</div>
                      <div className="font-bold text-foreground">₹{recalcResult.systemRecalculated}</div>
                    </div>
                    <div className="text-foreground font-bold text-xs">
                      {recalcResult.explanation}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                      Agent Confirmed Final Value (₹) — *Rule 8 Enforced: Cannot exceed initial estimate (₹{activeItem.initialEstimatedValue})
                    </label>
                    <Input
                      type="number"
                      max={activeItem.initialEstimatedValue}
                      value={activeDraft.finalVal}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const cappedVal = Math.min(val, activeItem.initialEstimatedValue);
                        updateDraft(activeItem.id, { finalVal: cappedVal });
                      }}
                      className="rounded-none border-2 border-border"
                    />
                  </div>
                </div>
              )}

              {activeDraft.result === 'REJECTED' && (
                <div className="p-4 rounded-none border-2 border-destructive/40 bg-destructive/10 space-y-3 text-xs">
                  <div className="font-bold text-destructive flex items-center gap-1.5">
                    <XCircle className="size-4 text-destructive" /> Rejection Reason Required
                  </div>
                  <Input
                    placeholder="e.g. Unusable hazardous contamination or non-textile material"
                    value={activeDraft.rejectionReason}
                    onChange={(e) => updateDraft(activeItem.id, { rejectionReason: e.target.value })}
                    className="rounded-none border-2 border-border"
                  />
                </div>
              )}

              <div className="space-y-3 border-t border-border pt-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Agent Physical Inspection Notes</label>
                  <Input
                    placeholder="Add observations for the customer..."
                    value={activeDraft.notes}
                    onChange={(e) => updateDraft(activeItem.id, { notes: e.target.value })}
                    className="rounded-none border-2 border-border"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Photographic Inspection Proof</label>
                  <button
                    type="button"
                    onClick={() => updateDraft(activeItem.id, { photoUploaded: true })}
                    className="h-14 px-4 w-full rounded-none border-2 border-dashed border-border hover:border-foreground flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Camera className="size-4 text-foreground" />
                    <span>
                      {activeDraft.photoUploaded
                        ? 'Photo Uploaded (Verified)'
                        : 'Simulate Photo Capture (Inspection Proof)'}
                    </span>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-muted border-t-2 border-border flex justify-between p-4 sm:p-6">
              <Button
                variant="outline"
                disabled={activeItemIndex === 0}
                onClick={() => setActiveItemIndex(activeItemIndex - 1)}
                className="h-11 px-6 font-bold text-xs border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none disabled:opacity-40"
              >
                Previous Item
              </Button>

              <Button
                onClick={handleSaveItemInspection}
                className="h-11 px-6 font-extrabold text-xs rounded-none bg-primary text-primary-foreground border border-black/10 hover:bg-primary/90 shadow-xs flex items-center gap-1.5"
              >
                Save & Continue <CheckCircle2 className="size-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
