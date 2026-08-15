'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wallet, ArrowDownLeft, ShieldCheck, Building, Smartphone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';

export default function WalletPage() {
  const { currentUser, walletTransactions, updateUserProfile } = useRecycloStore();

  const [upiId, setUpiId] = useState(currentUser.payoutUpiId || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ payoutUpiId: upiId });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const userTransactions = walletTransactions.filter((t) => t.userId === currentUser.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Badge variant="outline" className="bg-primary text-primary-foreground border-primary mb-1 rounded-none font-bold">
            Financial Ledger & Wallet
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">Recyclo Earnings & Payouts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            View verified inspection payouts, instant UPI transfers, and payment history.
          </p>
        </div>

        <Link href="/recycle/create">
          <Button className="gap-2 font-bold shadow-sm rounded-none border border-black/10">
            <Plus className="size-4" /> Recycle More Garments
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/15 border-2 border-primary rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Total Payouts Earned</span>
              <Wallet className="size-4 text-foreground" />
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold text-foreground">
              ₹{currentUser.totalEarnings}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            Directly transferred upon verified pickup inspection
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-foreground border-2 border-border rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              <span>Active Destination</span>
              <Smartphone className="size-4 text-foreground" />
            </CardDescription>
            <CardTitle className="text-lg font-bold text-foreground truncate">
              {currentUser.payoutUpiId || 'Not Configured'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            Instant UPI Auto-Payout enabled
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary border-2 border-border rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              <span>Bank Account Linked</span>
              <Building className="size-4 text-foreground" />
            </CardDescription>
            <CardTitle className="text-lg font-bold text-foreground">
              {currentUser.payoutBankInfo?.bankName} ({currentUser.payoutBankInfo?.accountNumber})
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-muted-foreground">
            IFSC: {currentUser.payoutBankInfo?.ifscCode}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Transaction History ({userTransactions.length})</h2>

          <div className="rounded-none border-2 border-border bg-card overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3.5">Transaction</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {userTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                      No payout transactions yet.
                    </td>
                  </tr>
                ) : (
                  userTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-none bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0 border border-black/10">
                            <ArrowDownLeft className="size-4" />
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{tx.title}</div>
                            <div className="text-[10px] text-muted-foreground">ID: {tx.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-muted-foreground">{tx.description}</td>

                      <td className="p-3.5 text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-3.5 text-right font-extrabold text-foreground text-sm">
                        +₹{tx.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 border-primary rounded-none">
            <CardHeader className="bg-primary/10 border-b pb-3">
              <CardTitle className="text-base">Configure Auto-Payout UPI</CardTitle>
              <CardDescription className="text-xs">
                Recyclo transfers funds instantly once pickup agent confirms inspection.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <form onSubmit={handleSaveUpi} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">UPI Virtual Payment Address (VPA)</label>
                  <Input
                    placeholder="e.g. mobile@okicici"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className="rounded-none border-2 border-border"
                  />
                </div>

                <Button type="submit" size="sm" className="w-full font-bold rounded-none border border-black/10">
                  {isSaved ? 'Saved Successfully!' : 'Update UPI Destination'}
                </Button>
              </form>

              <div className="p-3 rounded-none bg-muted text-[11px] text-muted-foreground space-y-1 border border-border">
                <div className="font-semibold text-foreground flex items-center gap-1">
                  <ShieldCheck className="size-3 text-primary fill-primary" /> Security Guarantee:
                </div>
                <p>All payouts are backed by Recyclo&apos;s 24-hour instant settlement guarantee.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
