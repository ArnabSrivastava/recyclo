'use client';

import React, { useState } from 'react';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Smartphone,
  Building,
  ShieldCheck,
  Wallet,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';
import { PickupAddress } from '@/lib/types';

export default function UserProfilePage() {
  const {
    currentUser,
    updateUserProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useRecycloStore();

  // Profile Form state
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [upiId, setUpiId] = useState(currentUser.payoutUpiId || '');
  const [isSaved, setIsSaved] = useState(false);

  // New Address modal form state
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newFullName, setNewFullName] = useState(currentUser.name);
  const [newPhone, setNewPhone] = useState(currentUser.phone);
  const [newStreetAddress, setNewStreetAddress] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newState] = useState('Karnataka');
  const [newPincode, setNewPincode] = useState('560001');
  const [newIsDefault, setNewIsDefault] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      payoutUpiId: upiId,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreetAddress || !newCity || !newPincode) return;

    addAddress({
      fullName: newFullName,
      phone: newPhone,
      streetAddress: newStreetAddress,
      landmark: newLandmark,
      city: newCity,
      state: newState,
      pincode: newPincode,
      isDefault: newIsDefault,
    });

    // Reset form
    setNewStreetAddress('');
    setNewLandmark('');
    setShowAddAddressModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="p-6 sm:p-8 rounded-none bg-foreground text-background shadow-xl border-2 border-foreground flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="size-20 rounded-none overflow-hidden border-2 border-primary shrink-0 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-bold text-xs rounded-none border border-black/10">
                Role: {currentUser.role}
              </Badge>
              <Badge variant="outline" className="bg-background text-foreground text-xs rounded-none border border-border">
                ID: #{currentUser.id}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-background">{currentUser.name}</h1>
            <div className="text-xs opacity-80">
              {currentUser.email} • {currentUser.phone}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 rounded-none bg-background/10 border border-background/20">
            <div className="text-xl font-extrabold text-background">{currentUser.totalListingsCount}</div>
            <div className="opacity-80 text-[10px]">Listings</div>
          </div>

          <div className="p-3 rounded-none bg-background/10 border border-background/20">
            <div className="text-xl font-extrabold text-background">{currentUser.totalKgRecycled} kg</div>
            <div className="opacity-80 text-[10px]">Recycled</div>
          </div>

          <div className="p-3 rounded-none bg-background/10 border border-background/20">
            <div className="text-xl font-extrabold text-background">₹{currentUser.totalEarnings}</div>
            <div className="opacity-80 text-[10px]">Earned</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full space-y-6">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full max-w-xl rounded-none border-2 border-border bg-muted">
          <TabsTrigger value="details" className="text-xs font-bold rounded-none gap-1.5">
            <User className="size-3.5" /> Personal Details
          </TabsTrigger>
          <TabsTrigger value="addresses" className="text-xs font-bold rounded-none gap-1.5">
            <MapPin className="size-3.5" /> Address Book ({currentUser.addresses.length})
          </TabsTrigger>
          <TabsTrigger value="payouts" className="text-xs font-bold rounded-none gap-1.5">
            <Wallet className="size-3.5" /> Payout Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="border-2 border-border rounded-none max-w-3xl">
            <CardHeader className="bg-muted/40 border-b">
              <CardTitle className="text-lg">Edit Account & Contact Info</CardTitle>
              <CardDescription className="text-xs">
                Update your primary contact details used for pickup notifications.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {isSaved && (
                <div className="p-3 rounded-none bg-primary/20 border-2 border-primary text-xs font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-foreground" /> Profile details saved successfully!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-none border-2 border-border"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Phone Number</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="rounded-none border-2 border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-none border-2 border-border"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="font-bold rounded-none border border-black/10 gap-1.5">
                    <Edit2 className="size-4" /> Save Account Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Saved Household Pickup Addresses</h2>
              <p className="text-xs text-muted-foreground">Manage locations for doorstep garment verification.</p>
            </div>

            <Button
              onClick={() => setShowAddAddressModal(true)}
              className="bg-primary text-primary-foreground font-bold text-xs gap-1.5 rounded-none border border-black/10"
            >
              <Plus className="size-4" /> Add New Address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentUser.addresses.map((addr: PickupAddress) => (
              <Card
                key={addr.id}
                className={`rounded-none border-2 transition-all ${
                  addr.isDefault ? 'border-primary bg-primary/10' : 'border-border bg-card'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-base text-foreground">{addr.fullName}</div>
                    {addr.isDefault ? (
                      <Badge className="bg-primary text-primary-foreground font-bold text-[10px] rounded-none border border-black/10">
                        DEFAULT PICKUP
                      </Badge>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="text-xs space-y-3 pt-0">
                  <div className="text-muted-foreground leading-relaxed">
                    {addr.streetAddress}{addr.landmark ? `, ${addr.landmark}` : ''}<br />
                    {addr.city}, {addr.state} - <b>{addr.pincode}</b>
                  </div>
                  <div className="text-foreground text-[11px]">Phone: {addr.phone}</div>

                  {currentUser.addresses.length > 1 && (
                    <div className="pt-2 border-t border-border flex justify-end">
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-destructive hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {showAddAddressModal && (
            <Card className="border-2 border-primary rounded-none p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-bold">Add New Pickup Location</h3>
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-muted-foreground mb-1 block">Full Contact Name</label>
                    <Input
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      required
                      className="rounded-none border-2 border-border"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-muted-foreground mb-1 block">Phone Number</label>
                    <Input
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      required
                      className="rounded-none border-2 border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground mb-1 block">Street Address / House No / Apartment</label>
                  <Input
                    placeholder="e.g. Flat 402, Sunshine Apartments, 12th Main Road"
                    value={newStreetAddress}
                    onChange={(e) => setNewStreetAddress(e.target.value)}
                    required
                    className="rounded-none border-2 border-border"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-muted-foreground mb-1 block">Landmark (Optional)</label>
                    <Input
                      placeholder="e.g. Near Metro Station"
                      value={newLandmark}
                      onChange={(e) => setNewLandmark(e.target.value)}
                      className="rounded-none border-2 border-border"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-muted-foreground mb-1 block">City</label>
                    <Input
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      required
                      className="rounded-none border-2 border-border"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-muted-foreground mb-1 block">Pincode</label>
                    <Input
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      required
                      className="rounded-none border-2 border-border"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDef"
                    checked={newIsDefault}
                    onChange={(e) => setNewIsDefault(e.target.checked)}
                    className="size-4 rounded-none accent-primary cursor-pointer"
                  />
                  <label htmlFor="isDef" className="font-semibold cursor-pointer">
                    Set as my default pickup address
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="font-bold rounded-none border border-black/10">
                    Save Address
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddAddressModal(false)}
                    className="font-bold rounded-none border-2 border-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payouts">
          <Card className="border-2 border-border rounded-none max-w-3xl">
            <CardHeader className="bg-muted/40 border-b">
              <CardTitle className="text-lg">Auto-Payout Destination Setup</CardTitle>
              <CardDescription className="text-xs">
                Recyclo transfers your verified garment payout directly into your UPI or bank account within 24h.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block items-center gap-1">
                    <Smartphone className="size-3.5 text-foreground" /> Primary UPI ID (VPA)
                  </label>
                  <Input
                    placeholder="e.g. mobile@okicici"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className="rounded-none border-2 border-border"
                  />
                </div>

                {currentUser.payoutBankInfo && (
                  <div className="p-4 rounded-none border-2 border-border bg-card space-y-2 text-xs">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <Building className="size-4 text-foreground" /> Linked Bank Account:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                      <div>Bank: <b>{currentUser.payoutBankInfo.bankName}</b></div>
                      <div>Account: <b>{currentUser.payoutBankInfo.accountNumber}</b></div>
                      <div>IFSC Code: <b>{currentUser.payoutBankInfo.ifscCode}</b></div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="font-bold rounded-none border border-black/10">
                  Update Payout Credentials
                </Button>
              </form>

              <div className="p-4 rounded-none bg-primary/10 border-2 border-primary text-xs space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <ShieldCheck className="size-4 text-foreground" /> Instant Transfer Guarantee:
                </div>
                <p className="text-muted-foreground">
                  Recyclo verifies items on-site and locks final payout. Funds are dispatched instantly upon customer sign-off.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
