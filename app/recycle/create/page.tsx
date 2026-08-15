'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Trash2,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Recycle,
  Sparkles,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useRecycloStore } from '@/lib/store/use-recyclo-store';
import { calculateEstimatedItemValue } from '@/lib/pricing-engine';
import {
  ClothingCategory,
  FabricMaterial,
  ClothingCondition,
  ClothingItem,
} from '@/lib/types';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542272604-780c36856842?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
];

interface FormClothingItem {
  category: ClothingCategory;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  size: string;
  brand: string;
  color: string;
  material: FabricMaterial;
  condition: ClothingCondition;
  weightKg: number;
  description: string;
  userImages: string[];
}

function CreateListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, addListing } = useRecycloStore();

  const initialCat = (searchParams.get('category') as ClothingCategory) || 'Shirt';
  const initialMat = (searchParams.get('material') as FabricMaterial) || 'Cotton';

  // Multi-item container state
  const [items, setItems] = useState<FormClothingItem[]>([
    {
      category: initialCat,
      gender: 'Men',
      size: 'L',
      brand: 'FabIndia',
      color: 'Blue',
      material: initialMat,
      condition: 'GOOD',
      weightKg: 0.35,
      description: 'Cotton casual button shirt',
      userImages: [SAMPLE_IMAGES[0]],
    },
  ]);

  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [step, setStep] = useState<'ITEMS' | 'PICKUP' | 'REVIEW'>('ITEMS');

  // Pickup Scheduling state
  const [selectedAddress, setSelectedAddress] = useState(currentUser.addresses[0]);
  const [pickupDate, setPickupDate] = useState('2026-08-17');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [pickupInstructions, setPickupInstructions] = useState('');

  const handleAddItem = () => {
    const newItem: FormClothingItem = {
      category: 'T-Shirt',
      gender: 'Unisex',
      size: 'M',
      brand: '',
      color: 'Black',
      material: 'Cotton',
      condition: 'GOOD',
      weightKg: 0.25,
      description: '',
      userImages: [SAMPLE_IMAGES[(items.length + 1) % SAMPLE_IMAGES.length]],
    };
    setItems([...items, newItem]);
    setActiveItemIndex(items.length);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    const filtered = items.filter((_, idx) => idx !== index);
    setItems(filtered);
    setActiveItemIndex(Math.max(0, index - 1));
  };

  const handleUpdateActiveItem = <K extends keyof FormClothingItem>(
    field: K,
    value: FormClothingItem[K]
  ) => {
    const updated = [...items];
    updated[activeItemIndex] = {
      ...updated[activeItemIndex],
      [field]: value,
    };
    setItems(updated);
  };

  // Calculate container totals
  const itemsWithEstimates = items.map((item) => {
    const est = calculateEstimatedItemValue(
      item.category,
      item.material,
      item.condition,
      item.weightKg
    );
    return {
      ...item,
      estimatedValue: est.estimatedValue,
    };
  });

  const totalEstimatedValue = itemsWithEstimates.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const handleSubmitListing = () => {
    const newListingItems: Partial<ClothingItem>[] = itemsWithEstimates.map(
      (item) => ({
        category: item.category,
        gender: item.gender,
        size: item.size,
        brand: item.brand,
        color: item.color,
        material: item.material,
        condition: item.condition,
        weightKg: item.weightKg,
        description: item.description,
        userImages: item.userImages,
        initialEstimatedValue: item.estimatedValue,
      })
    );

    const listingId = addListing({
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      items: newListingItems as ClothingItem[],
      initialEstimatedTotal: totalEstimatedValue,
      pickupAddress: selectedAddress,
      pickupDate,
      pickupTimeSlot,
      pickupInstructions,
      status: 'AWAITING_PICKUP',
    });

    router.push(`/listings/${listingId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Badge variant="outline" className="bg-primary text-primary-foreground border-primary mb-1 rounded-none font-bold">
            Recycling Request Container
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight">Create Recycling Request</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Add all your unwanted garments in one request. Each item gets an independent estimate and inspection.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-none border ${step === 'ITEMS' ? 'bg-primary text-primary-foreground border-black/10 font-bold' : 'bg-muted border-border'}`}>
            <span>1. Clothes ({items.length})</span>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-none border ${step === 'PICKUP' ? 'bg-primary text-primary-foreground border-black/10 font-bold' : 'bg-muted border-border'}`}>
            <span>2. Schedule</span>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-none border ${step === 'REVIEW' ? 'bg-primary text-primary-foreground border-black/10 font-bold' : 'bg-muted border-border'}`}>
            <span>3. Review</span>
          </div>
        </div>
      </div>

      {step === 'ITEMS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Items in Container ({items.length})</h2>
              <Button
                type="button"
                onClick={handleAddItem}
                size="sm"
                variant="outline"
                className="gap-1 text-xs font-bold text-foreground border-2 border-foreground hover:bg-foreground hover:text-background rounded-none"
              >
                <Plus className="size-3.5" /> Add Another Item
              </Button>
            </div>

            <div className="space-y-3 max-h-150 overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const est = calculateEstimatedItemValue(
                  item.category,
                  item.material,
                  item.condition,
                  item.weightKg
                );
                const isSelected = activeItemIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveItemIndex(idx)}
                    className={`p-4 rounded-none border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-xs'
                        : 'border-border bg-card hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-none overflow-hidden bg-muted shrink-0 border-2 border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.userImages[0]} alt={item.category} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">
                            Item #{idx + 1}: {item.category}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                            {item.gender} • {item.material} • {item.condition}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">₹{est.estimatedValue}</div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(idx);
                            }}
                            className="text-[10px] text-destructive hover:underline flex items-center justify-end gap-0.5 mt-1 cursor-pointer font-bold"
                          >
                            <Trash2 className="size-3" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-none bg-card border-2 border-border space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Total Items:</span>
                <span className="font-semibold text-foreground">{items.length} garments</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                <span>Estimated Container Total:</span>
                <span className="text-foreground text-xl font-extrabold">₹{totalEstimatedValue}</span>
              </div>
            </div>

            <Button
              onClick={() => setStep('PICKUP')}
              className="w-full h-11 font-bold text-sm gap-2 shadow-md rounded-none border border-black/10"
            >
              Proceed to Schedule Pickup <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="lg:col-span-8">
            <Card className="border-2 border-border rounded-none">
              <CardHeader className="bg-primary/10 border-b border-primary/30 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-extrabold">
                      Editing Item #{activeItemIndex + 1}: {items[activeItemIndex].category}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Enter detailed attributes for accurate estimated pricing.
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-extrabold text-sm rounded-none border border-black/10">
                    Est. ₹
                    {
                      calculateEstimatedItemValue(
                        items[activeItemIndex].category,
                        items[activeItemIndex].material,
                        items[activeItemIndex].condition,
                        items[activeItemIndex].weightKg
                      ).estimatedValue
                    }
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Clothing Category *</label>
                    <Select
                      value={items[activeItemIndex].category}
                      onChange={(e) => handleUpdateActiveItem('category', e.target.value as ClothingCategory)}
                      className="rounded-none border-2 border-border"
                    >
                      <option value="Shirt">Shirt</option>
                      <option value="T-Shirt">T-Shirt / Polo</option>
                      <option value="Kurta">Kurta / Ethnic Wear</option>
                      <option value="Kurti">Kurti</option>
                      <option value="Jeans">Jeans / Denim</option>
                      <option value="Jacket">Jacket / Coat</option>
                      <option value="Sweater">Sweater / Sweatshirt</option>
                      <option value="Saree">Saree / Traditional</option>
                      <option value="Lehenga">Lehenga</option>
                      <option value="Trousers">Trousers / Pants</option>
                      <option value="Kids Wear">Kids Clothing</option>
                      <option value="Bedsheets">Bedsheets / Home Textile</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Gender / Fit</label>
                    <Select
                      value={items[activeItemIndex].gender}
                      onChange={(e) => handleUpdateActiveItem('gender', e.target.value as 'Men' | 'Women' | 'Unisex' | 'Kids')}
                      className="rounded-none border-2 border-border"
                    >
                      <option value="Men">Men&apos;s Wear</option>
                      <option value="Women">Women&apos;s Wear</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Kids">Kids</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Fabric Material *</label>
                    <Select
                      value={items[activeItemIndex].material}
                      onChange={(e) => handleUpdateActiveItem('material', e.target.value as FabricMaterial)}
                      className="rounded-none border-2 border-border"
                    >
                      <option value="Cotton">Cotton (1.1x multiplier)</option>
                      <option value="Denim">Denim (1.2x multiplier)</option>
                      <option value="Silk">Silk (1.35x multiplier)</option>
                      <option value="Wool">Wool (1.25x multiplier)</option>
                      <option value="Linen">Linen (1.15x multiplier)</option>
                      <option value="Polyester">Polyester (0.9x multiplier)</option>
                      <option value="Mixed">Mixed Fabrics (0.8x multiplier)</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Condition Rating *</label>
                    <Select
                      value={items[activeItemIndex].condition}
                      onChange={(e) => handleUpdateActiveItem('condition', e.target.value as ClothingCondition)}
                      className="rounded-none border-2 border-border"
                    >
                      <option value="EXCELLENT">Excellent (Like new, minimal wear)</option>
                      <option value="GOOD">Good (Gently used, standard wear)</option>
                      <option value="FAIR">Fair (Visible wear, minor fading)</option>
                      <option value="POOR">Poor (Heavy wear or small tear)</option>
                      <option value="UNUSABLE">Unusable (Recyclable fiber only)</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Size</label>
                    <Select
                      value={items[activeItemIndex].size}
                      onChange={(e) => handleUpdateActiveItem('size', e.target.value)}
                      className="rounded-none border-2 border-border"
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="Free Size">Free Size</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Brand (Optional)</label>
                    <Input
                      placeholder="e.g. FabIndia, Zara, Puma"
                      value={items[activeItemIndex].brand}
                      onChange={(e) => handleUpdateActiveItem('brand', e.target.value)}
                      className="rounded-none border-2 border-border"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Color</label>
                    <Input
                      placeholder="e.g. Blue, Black"
                      value={items[activeItemIndex].color}
                      onChange={(e) => handleUpdateActiveItem('color', e.target.value)}
                      className="rounded-none border-2 border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Description & Known Wear</label>
                  <Input
                    placeholder="e.g. Blue casual cotton shirt with light wear on collar"
                    value={items[activeItemIndex].description}
                    onChange={(e) => handleUpdateActiveItem('description', e.target.value)}
                    className="rounded-none border-2 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground block">Item Photographs</label>
                  <div className="flex items-center gap-3">
                    <div className="size-20 rounded-none overflow-hidden border-2 border-primary bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={items[activeItemIndex].userImages[0]}
                        alt="Item photo"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nextImg = SAMPLE_IMAGES[(items[activeItemIndex].userImages.length + 1) % SAMPLE_IMAGES.length];
                        handleUpdateActiveItem('userImages', [nextImg]);
                      }}
                      className="h-20 px-4 rounded-none border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Upload className="size-5 mb-1 text-foreground" />
                      <span>Simulate Photo Upload</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-none bg-primary/10 border-2 border-primary text-xs space-y-1">
                  <div className="font-semibold text-foreground flex items-center gap-1">
                    <Sparkles className="size-3 text-foreground" /> Pricing Breakdown Explanation:
                  </div>
                  <ul className="text-[11px] text-muted-foreground space-y-0.5 pl-4 list-disc">
                    {calculateEstimatedItemValue(
                      items[activeItemIndex].category,
                      items[activeItemIndex].material,
                      items[activeItemIndex].condition,
                      items[activeItemIndex].weightKg
                    ).explanation.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="bg-muted border-t-2 border-border flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddItem}
                  className="w-full sm:w-auto h-11 px-6 gap-1.5 font-bold text-xs border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none"
                >
                  <Plus className="size-4" /> Add Another Clothing Item
                </Button>

                <Button
                  onClick={() => setStep('PICKUP')}
                  className="w-full sm:w-auto h-11 px-6 gap-1.5 font-extrabold text-xs rounded-none bg-primary text-primary-foreground border border-black/10 hover:bg-primary/90 shadow-xs"
                >
                  Next: Schedule Pickup <ArrowRight className="size-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {step === 'PICKUP' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-2 border-border rounded-none">
            <CardHeader className="bg-primary/10 border-b border-primary/30">
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="size-5 text-foreground" /> Select Pickup Location & Time Slot
              </CardTitle>
              <CardDescription className="text-xs">
                Our assigned Recyclo agent will visit your address for item verification.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground block">Select Saved Address</label>
                <div className="grid grid-cols-1 gap-3">
                  {currentUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-4 rounded-none border-2 cursor-pointer transition-all ${
                        selectedAddress.id === addr.id
                          ? 'border-primary bg-primary/10 shadow-xs'
                          : 'border-border hover:border-border/80'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5 text-xs">
                          <div className="font-bold text-sm text-foreground">{addr.fullName}</div>
                          <div>{addr.streetAddress}, {addr.landmark}</div>
                          <div className="text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</div>
                          <div className="text-muted-foreground mt-1">Phone: {addr.phone}</div>
                        </div>

                        {selectedAddress.id === addr.id && (
                          <Badge className="bg-primary text-primary-foreground rounded-none font-bold">Selected</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Pickup Date *</label>
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min="2026-08-16"
                    className="rounded-none border-2 border-border"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Preferred Time Slot *</label>
                  <Select
                    value={pickupTimeSlot}
                    onChange={(e) => setPickupTimeSlot(e.target.value)}
                    className="rounded-none border-2 border-border"
                  >
                    <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM (Morning)</option>
                    <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM (Midday)</option>
                    <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM (Afternoon)</option>
                    <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM (Evening)</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Optional Instructions for Pickup Agent</label>
                <Input
                  placeholder="e.g. Ring doorbell twice, or leave with security gate"
                  value={pickupInstructions}
                  onChange={(e) => setPickupInstructions(e.target.value)}
                  className="rounded-none border-2 border-border"
                />
              </div>
            </CardContent>

            <CardFooter className="bg-muted border-t-2 border-border flex justify-between p-4 sm:p-6">
              <Button
                variant="outline"
                onClick={() => setStep('ITEMS')}
                className="w-full sm:w-auto h-11 px-6 gap-1.5 font-bold text-xs border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none"
              >
                <ArrowLeft className="size-4" /> Back to Clothes
              </Button>

              <Button
                onClick={() => setStep('REVIEW')}
                className="w-full sm:w-auto h-11 px-6 gap-1.5 font-extrabold text-xs rounded-none bg-primary text-primary-foreground border border-black/10 hover:bg-primary/90 shadow-xs"
              >
                Review & Confirm <ArrowRight className="size-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {step === 'REVIEW' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="border-2 border-primary rounded-none">
            <CardHeader className="bg-primary/10 border-b border-primary/30">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary text-primary-foreground border-primary rounded-none font-bold">
                  Ready to Submit
                </Badge>
                <span className="text-xs text-muted-foreground">{items.length} Clothing Items</span>
              </div>
              <CardTitle className="text-xl mt-1">Review Recycling Request</CardTitle>
              <CardDescription className="text-xs">
                Confirm your clothing items, estimated values, and pickup schedule.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold">Clothing Items in Container</h3>
                <div className="rounded-none border-2 border-border overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted text-muted-foreground font-semibold border-b border-border">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Fabric / Material</th>
                        <th className="p-3">Condition</th>
                        <th className="p-3 text-right">Est. Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {itemsWithEstimates.map((item, i) => (
                        <tr key={i} className="hover:bg-muted/30">
                          <td className="p-3 text-muted-foreground">{i + 1}</td>
                          <td className="p-3 font-bold text-foreground">
                            {item.category} ({item.gender})
                          </td>
                          <td className="p-3">{item.material}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-[10px] rounded-none font-semibold">
                              {item.condition}
                            </Badge>
                          </td>
                          <td className="p-3 text-right font-bold text-foreground">
                            ₹{item.estimatedValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 rounded-none bg-primary/10 border-2 border-primary flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Total Estimated Payout</div>
                  <div className="text-2xl font-extrabold text-foreground">₹{totalEstimatedValue}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Pickup Date: <b>{pickupDate}</b></div>
                  <div>Time Slot: <b>{pickupTimeSlot}</b></div>
                </div>
              </div>

              <div className="p-3.5 rounded-none border-2 border-border bg-card text-xs space-y-1">
                <div className="font-semibold text-foreground flex items-center gap-1">
                  <MapPin className="size-3.5 text-foreground" /> Pickup Location:
                </div>
                <div>{selectedAddress.fullName} — {selectedAddress.streetAddress}, {selectedAddress.city} ({selectedAddress.pincode})</div>
                <div className="text-muted-foreground">Contact Phone: {selectedAddress.phone}</div>
              </div>

              <div className="p-3 rounded-none bg-primary/10 border-2 border-primary text-xs text-foreground flex items-start gap-2">
                <ShieldCheck className="size-4 shrink-0 mt-0.5" />
                <span>
                  Our pickup agent will inspect items individually. You will receive payout directly to your wallet or UPI after physical verification!
                </span>
              </div>
            </CardContent>

            <CardFooter className="bg-muted border-t-2 border-border flex justify-between p-4 sm:p-6">
              <Button
                variant="outline"
                onClick={() => setStep('PICKUP')}
                className="w-full sm:w-auto h-11 px-6 gap-1.5 font-bold text-xs border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none"
              >
                <ArrowLeft className="size-4" /> Back to Schedule
              </Button>

              <Button
                onClick={handleSubmitListing}
                className="w-full sm:w-auto h-11 px-8 gap-2 font-extrabold text-xs rounded-none bg-primary text-primary-foreground border border-black/10 hover:bg-primary/90 shadow-xs"
              >
                <Recycle className="size-5" /> Submit Recycling Request Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-muted-foreground">Loading container...</div>}>
      <CreateListingContent />
    </Suspense>
  );
}
