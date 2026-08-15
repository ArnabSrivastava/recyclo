"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Plus, Search, Eye, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRecycloStore } from "@/lib/store/use-recyclo-store"
import {
  CATEGORY_BASE_PRICES,
  MATERIAL_MULTIPLIERS,
} from "@/lib/pricing-engine"
import { FabricMaterial } from "@/lib/types"

export default function AdminControlCenterPage() {
  const {
    listings,
    agentsList,
    batches,
    disputes,
    auditLogs,
    assignAgentToListing,
    createProcessingBatch,
    updatePricingRules,
    resolveDispute,
  } = useRecycloStore()

  const [activeTab, setActiveTab] = useState("overview")

  const [listingSearch, setListingSearch] = useState("")
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(
    null
  )
  const [disputeNotes, setDisputeNotes] = useState("")
  const [disputeExtraPayout, setDisputeExtraPayout] = useState(0)

  const [newBatchName, setNewBatchName] = useState("")
  const [newBatchMaterial, setNewBatchMaterial] =
    useState<FabricMaterial>("Denim")

  const [categoryPrices, setCategoryPrices] = useState<Record<string, number>>({
    ...CATEGORY_BASE_PRICES,
  })
  const [materialMultipliers, setMaterialMultipliers] = useState<
    Record<string, number>
  >({ ...MATERIAL_MULTIPLIERS })

  const filteredListings = listings.filter(
    (l) =>
      l.id.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.userName.toLowerCase().includes(listingSearch.toLowerCase())
  )

  const pendingDisputes = disputes.filter(
    (d) => d.status === "OPEN" || d.status === "UNDER_REVIEW"
  )

  const handleCreateBatch = () => {
    if (!newBatchName) return
    createProcessingBatch({
      batchCode: `PB102${batches.length + 6}`,
      name: newBatchName,
      materialType: newBatchMaterial,
      sourceListingIds: ["RC10045"],
      sourceItemIds: ["RC10045-ITEM1", "RC10045-ITEM2"],
      totalItemsCount: 3,
      totalWeightKg: 18.5,
      status: "PROCESSING",
      resultingOutput: "Upcycled Denim Tote Bags & Sleeves",
      createdProductsCount: 15,
    })
    setNewBatchName("")
  }

  const handleSavePricingConfig = () => {
    updatePricingRules(categoryPrices, materialMultipliers)
  }

  const handleResolveDispute = (
    disputeId: string,
    status: "RESOLVED" | "REJECTED"
  ) => {
    resolveDispute(
      disputeId,
      status,
      disputeNotes,
      status === "RESOLVED" ? disputeExtraPayout : 0
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 rounded-none border-2 border-foreground bg-foreground p-6 text-background shadow-xl sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="rounded-none border border-black/10 bg-primary text-xs font-bold text-primary-foreground">
              Recyclo Operations Control Center
            </Badge>
            <span className="text-xs opacity-80">
              Platform Admin Portal
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-background">
            Platform Operations Dashboard
          </h1>
          <p className="mt-0.5 text-xs opacity-80">
            Full management over recycling listings, pickup agents, pricing
            rules, processing batches, upcycled inventory, and disputes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleCreateBatch}
            size="sm"
            className="gap-1.5 rounded-none border border-black/10 bg-primary text-xs font-bold text-primary-foreground"
          >
            <Plus className="size-4" /> Create Processing Batch
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none border-2 border-border bg-muted md:grid-cols-6">
          <TabsTrigger
            value="overview"
            className="rounded-none text-xs font-bold"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="listings"
            className="rounded-none text-xs font-bold"
          >
            Listings & Pickups
          </TabsTrigger>
          <TabsTrigger
            value="batches"
            className="rounded-none text-xs font-bold"
          >
            Processing Batches
          </TabsTrigger>
          <TabsTrigger
            value="pricing"
            className="rounded-none text-xs font-bold"
          >
            Pricing Engine
          </TabsTrigger>
          <TabsTrigger
            value="disputes"
            className="rounded-none text-xs font-bold"
          >
            Disputes ({pendingDisputes.length})
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-none text-xs font-bold">
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-none border-2 border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-semibold">
                  Total Recycling Listings
                </CardDescription>
                <CardTitle className="text-3xl font-extrabold">
                  {listings.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[11px] text-muted-foreground">
                Across Bengaluru operating zone
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-semibold text-foreground">
                  Active Processing Batches
                </CardDescription>
                <CardTitle className="text-3xl font-extrabold">
                  {batches.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[11px] text-muted-foreground">
                Recovered fabrics undergoing upcycling
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 border-border">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-semibold text-foreground">
                  Active Pickup Agents
                </CardDescription>
                <CardTitle className="text-3xl font-extrabold">
                  {agentsList.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[11px] text-muted-foreground">
                Assigned to physical item verification
              </CardContent>
            </Card>

            <Card className="rounded-none border-2 border-primary bg-primary/10">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-bold text-foreground">
                  Pending Disputes / Inquiries
                </CardDescription>
                <CardTitle className="text-3xl font-extrabold">
                  {pendingDisputes.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[11px] text-muted-foreground">
                Requires admin review & resolution
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-none border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg">
                Recent Recycling Requests Pending Assignment
              </CardTitle>
              <CardDescription className="text-xs">
                Assign pickup agents to incoming household recycling listings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-none border-2 border-border">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted font-semibold text-muted-foreground">
                    <tr>
                      <th className="p-3">Listing ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Est. Value</th>
                      <th className="p-3">Assigned Agent</th>
                      <th className="p-3 text-right">Assign Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {listings.map((l) => (
                      <tr key={l.id} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-foreground">
                          #{l.id}
                        </td>
                        <td className="p-3 font-semibold">{l.userName}</td>
                        <td className="p-3">{l.items.length} garments</td>
                        <td className="p-3 font-bold text-foreground">
                          ₹{l.initialEstimatedTotal}
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className="rounded-none text-[10px]"
                          >
                            {l.assignedAgentName || "Unassigned"}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Select
                            value={l.assignedAgentId || ""}
                            onChange={(e) =>
                              assignAgentToListing(l.id, e.target.value)
                            }
                            className="h-8 w-40 rounded-none border-2 border-border text-xs"
                          >
                            <option value="">Select Agent...</option>
                            {agentsList.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.name} ({a.city})
                              </option>
                            ))}
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="space-y-4 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h2 className="text-xl font-bold">
              Manage All Recycling Listings ({listings.length})
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search listing # or customer..."
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                className="rounded-none border-2 border-border pl-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredListings.map((l) => (
              <Card
                key={l.id}
                className="rounded-none border-2 border-border transition-colors hover:border-primary"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-none border border-black/10 bg-primary font-bold text-primary-foreground">
                        #{l.id}
                      </div>
                      <div>
                        <div className="text-base font-bold">
                          {l.userName} ({l.userPhone})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Address: {l.pickupAddress.streetAddress},{" "}
                          {l.pickupAddress.city} • Slot: {l.pickupDate} (
                          {l.pickupTimeSlot})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-none text-xs font-semibold"
                      >
                        Status: {l.status}
                      </Badge>

                      <Link href={`/listings/${l.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 rounded-none border-2 border-foreground text-xs font-bold"
                        >
                          <Eye className="size-3.5" /> Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  <div className="grid grid-cols-1 gap-3 rounded-none border border-border bg-muted p-3 sm:grid-cols-3">
                    <div>
                      <span className="text-muted-foreground">
                        Original Estimate:
                      </span>
                      <div className="font-bold text-foreground">
                        ₹{l.initialEstimatedTotal}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Final Payout:
                      </span>
                      <div className="font-extrabold text-foreground">
                        ₹{l.finalPayoutTotal ?? l.initialEstimatedTotal}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Assigned Agent:
                      </span>
                      <div className="font-semibold">
                        {l.assignedAgentName || "Unassigned"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-6 pt-6">
          <Card className="rounded-none border-2 border-primary">
            <CardHeader className="border-b bg-primary/10">
              <CardTitle className="text-lg">
                Create New Upcycling Processing Batch
              </CardTitle>
              <CardDescription className="text-xs">
                Group recovered textiles from completed pickups into a traceable
                batch for store product manufacturing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Batch Name
                  </label>
                  <Input
                    placeholder="e.g. PB1026 — Cotton & Silk Recovery"
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    className="rounded-none border-2 border-border"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                    Fabric Material Type
                  </label>
                  <Select
                    value={newBatchMaterial}
                    onChange={(e) =>
                      setNewBatchMaterial(e.target.value as FabricMaterial)
                    }
                    className="rounded-none border-2 border-border"
                  >
                    <option value="Denim">Denim Fabrics</option>
                    <option value="Cotton">Pure Cotton</option>
                    <option value="Silk">Silk & Brocade</option>
                    <option value="Wool">Woolen Blends</option>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleCreateBatch}
                className="gap-1 rounded-none border border-black/10 bg-primary text-xs font-bold text-primary-foreground"
              >
                <Plus className="size-4" /> Create & Initialize Batch
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {batches.map((b) => (
              <Card key={b.id} className="rounded-none border-2 border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="rounded-none border-primary bg-primary font-bold text-primary-foreground"
                    >
                      #{b.batchCode || b.id}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-none bg-foreground text-[10px] font-bold text-background"
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-1 text-base">{b.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 text-xs">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">
                      Material Type:
                    </span>
                    <span className="font-semibold">{b.materialType}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">
                      Total Weight Recovered:
                    </span>
                    <span className="font-semibold">{b.totalWeightKg} kg</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">
                      Source Listings:
                    </span>
                    <span>
                      {b.sourceListingIds.length} listings
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">
                    {b.resultingOutput}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6 pt-6">
          <Card className="rounded-none border-2 border-border">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">
                Formula-Driven Pricing Engine Settings
              </CardTitle>
              <CardDescription className="text-xs">
                Configure baseline category rates (₹) and material multipliers.
                Changes reflect immediately across new user estimates!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold">
                  1. Category Base Prices (₹)
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.entries(categoryPrices).map(([cat, price]) => (
                    <div
                      key={cat}
                      className="flex items-center justify-between rounded-none border-2 border-border bg-card p-3 text-xs"
                    >
                      <span className="font-semibold">{cat}:</span>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) =>
                          setCategoryPrices({
                            ...categoryPrices,
                            [cat]: Number(e.target.value),
                          })
                        }
                        className="h-7 w-20 rounded-none border text-right text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <h3 className="text-sm font-bold">2. Material Multipliers</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.entries(materialMultipliers).map(([mat, mult]) => (
                    <div
                      key={mat}
                      className="flex items-center justify-between rounded-none border-2 border-border bg-card p-3 text-xs"
                    >
                      <span className="font-semibold">{mat}:</span>
                      <Input
                        type="number"
                        step="0.05"
                        value={mult}
                        onChange={(e) =>
                          setMaterialMultipliers({
                            ...materialMultipliers,
                            [mat]: Number(e.target.value),
                          })
                        }
                        className="h-7 w-20 rounded-none border text-right text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSavePricingConfig}
                className="gap-1 rounded-none border border-black/10 bg-primary text-xs font-bold text-primary-foreground"
              >
                <ShieldCheck className="size-4" /> Save Updated Pricing Engine
                Config
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4 pt-6">
          <h2 className="text-xl font-bold">
            Customer Inquiry & Dispute Cases
          </h2>

          <div className="space-y-4">
            {disputes.map((dispute) => (
              <Card
                key={dispute.id}
                className="rounded-none border-2 border-primary"
              >
                <CardHeader className="bg-primary/10 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="rounded-none border border-black/10 bg-primary text-xs text-primary-foreground">
                        Case #{dispute.id}
                      </Badge>
                      <Badge variant="outline" className="rounded-none text-xs">
                        Listing #{dispute.listingId}
                      </Badge>
                    </div>

                    <Badge
                      variant={
                        dispute.status === "RESOLVED"
                          ? "success"
                          : "destructive"
                      }
                      className="rounded-none text-xs font-bold"
                    >
                      {dispute.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-base">
                    {dispute.issueType.replace(/_/g, " ")} — by{" "}
                    {dispute.userName}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-xs">
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      User Explanation:
                    </span>
                    <div className="mt-1 rounded-none border-2 border-border bg-background p-2 font-semibold text-foreground">
                      &quot;{dispute.explanation}&quot;
                    </div>
                  </div>

                  {dispute.status !== "RESOLVED" &&
                    dispute.status !== "REJECTED" && (
                      <div className="space-y-3 rounded-none border-2 border-border bg-muted p-3">
                        <div className="font-bold">Admin Resolution Panel</div>
                        <div>
                          <label className="mb-1 block text-[11px] text-muted-foreground">
                            Resolution Notes
                          </label>
                          <Input
                            placeholder="State resolution rationale..."
                            value={
                              selectedDisputeId === dispute.id
                                ? disputeNotes
                                : ""
                            }
                            onChange={(e) => {
                              setSelectedDisputeId(dispute.id)
                              setDisputeNotes(e.target.value)
                            }}
                            className="rounded-none border-2 border-border"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] text-muted-foreground">
                            Extra Adjusted Compensation Payout (₹)
                          </label>
                          <Input
                            type="number"
                            value={
                              selectedDisputeId === dispute.id
                                ? disputeExtraPayout
                                : 0
                            }
                            onChange={(e) => {
                              setSelectedDisputeId(dispute.id)
                              setDisputeExtraPayout(Number(e.target.value))
                            }}
                            className="w-32 rounded-none border-2 border-border"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleResolveDispute(dispute.id, "RESOLVED")
                            }
                            className="rounded-none border border-black/10 bg-primary text-xs font-bold text-primary-foreground"
                          >
                            Approve Resolution & Adjust Payout
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleResolveDispute(dispute.id, "REJECTED")
                            }
                            className="rounded-none text-xs font-bold"
                          >
                            Reject Dispute
                          </Button>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4 pt-6">
          <h2 className="text-xl font-bold">System Operations Audit Trail</h2>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col justify-between gap-2 rounded-none border-2 border-border bg-card p-3 text-xs sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Badge
                      variant="outline"
                      className="rounded-none border-none bg-primary text-[10px] font-bold text-primary-foreground"
                    >
                      {log.entityType} #{log.entityId}
                    </Badge>
                    <span>{log.action}</span>
                  </div>
                  <div className="mt-0.5 text-muted-foreground">
                    {log.details}
                  </div>
                </div>

                <div className="text-right text-[10px] text-muted-foreground">
                  By {log.performedBy} ({log.performedByRole}) <br />
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
