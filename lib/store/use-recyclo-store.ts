import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
  Role,
  UserProfile,
  AgentProfile,
  RecyclingListing,
  ClothingItem,
  InspectionIssue,
  InspectionStatus,
  ProcessingBatch,
  StoreProduct,
  CartItem,
  Order,
  WalletTransaction,
  Dispute,
  AuditLog,
  Notification,
  PickupAddress,
} from "../types"
import { recalculateItemInspectionValue } from "../pricing-engine"

// Mock Seed Users
const MOCK_CUSTOMER: UserProfile = {
  id: "usr_arav99",
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98765 43210",
  role: "CUSTOMER",
  avatarUrl:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  addresses: [
    {
      id: "addr_1",
      fullName: "Aarav Sharma",
      phone: "+91 98765 43210",
      streetAddress: "Flat 402, Green Valley Apartments, Indiranagar",
      landmark: "Near Metro Station",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      isDefault: true,
    },
    {
      id: "addr_2",
      fullName: "Aarav Sharma (Office)",
      phone: "+91 98765 43210",
      streetAddress: "9th Floor, Tech Hub Tower B, Koramangala",
      landmark: "Opposite Forum Mall",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560095",
      isDefault: false,
    },
  ],
  payoutUpiId: "aarav.sharma@okicici",
  payoutBankInfo: {
    accountNumber: "XXXX-XXXX-4819",
    ifscCode: "HDFC0001234",
    bankName: "HDFC Bank",
  },
  totalEarnings: 2450,
  totalKgRecycled: 14.8,
  totalItemsRecycled: 22,
  totalListingsCount: 5,
}

const MOCK_AGENT: AgentProfile = {
  id: "ag_vikram08",
  name: "Vikram Singh",
  phone: "+91 91234 56789",
  email: "vikram.agent@recyclo.in",
  avatarUrl:
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  city: "Bengaluru",
  activeStatus: "AVAILABLE",
  rating: 4.9,
  completedPickupsCount: 142,
  assignedListingsCount: 3,
}

const MOCK_AGENTS_LIST: AgentProfile[] = [
  MOCK_AGENT,
  {
    id: "ag_rohit02",
    name: "Rohit Kumar",
    phone: "+91 98111 22334",
    email: "rohit.k@recyclo.in",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    city: "Bengaluru",
    activeStatus: "AVAILABLE",
    rating: 4.8,
    completedPickupsCount: 98,
    assignedListingsCount: 1,
  },
  {
    id: "ag_sneha04",
    name: "Sneha Patel",
    phone: "+91 97222 33445",
    email: "sneha.p@recyclo.in",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    city: "Bengaluru",
    activeStatus: "ON_JOB",
    rating: 4.95,
    completedPickupsCount: 184,
    assignedListingsCount: 4,
  },
]

// Seed Listing RC10045 (Prompt exact scenario!)
const SEED_LISTINGS: RecyclingListing[] = [
  {
    id: "RC10045",
    userId: "usr_arav99",
    userName: "Aarav Sharma",
    userPhone: "+91 98765 43210",
    initialEstimatedTotal: 450,
    systemRecalculatedTotal: 410,
    finalPayoutTotal: 400,
    pickupAddress: MOCK_CUSTOMER.addresses[0],
    pickupDate: "2026-08-16",
    pickupTimeSlot: "10:00 AM - 01:00 PM",
    pickupInstructions: "Ring doorbell twice. Handle with care.",
    status: "INSPECTION_IN_PROGRESS",
    assignedAgentId: "ag_vikram08",
    assignedAgentName: "Vikram Singh",
    createdAt: "2026-08-14T10:30:00Z",
    updatedAt: "2026-08-15T09:15:00Z",
    items: [
      {
        id: "ITEM-10045-1",
        listingId: "RC10045",
        category: "Shirt",
        subcategory: "Casual Shirt",
        gender: "Men",
        size: "L",
        brand: "FabIndia",
        color: "Blue",
        material: "Cotton",
        condition: "GOOD",
        weightKg: 0.35,
        description: "Cotton blue casual button shirt in good shape",
        userImages: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&auto=format&fit=crop&q=80",
        ],
        initialEstimatedValue: 150,
        inspectionResult: "ACCEPTED",
        systemRecalculatedValue: 150,
        agentFinalValue: 150,
        processingOutcome: "DIRECT_REUSE",
      },
      {
        id: "ITEM-10045-2",
        listingId: "RC10045",
        category: "T-Shirt",
        subcategory: "Graphic Tee",
        gender: "Men",
        size: "M",
        brand: "Puma",
        color: "Black",
        material: "Cotton",
        condition: "GOOD",
        weightKg: 0.25,
        description: "Black cotton t-shirt with minor logo print",
        userImages: [
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80",
        ],
        initialEstimatedValue: 100,
        inspectionResult: "ACCEPTED",
        systemRecalculatedValue: 100,
        agentFinalValue: 100,
        processingOutcome: "MATERIAL_RECYCLING",
      },
      {
        id: "ITEM-10045-3",
        listingId: "RC10045",
        category: "Kurta",
        subcategory: "Ethnic Wear",
        gender: "Women",
        size: "M",
        brand: "Biba",
        color: "Green",
        material: "Cotton",
        condition: "GOOD",
        weightKg: 0.4,
        description: "Handblock printed cotton kurta",
        userImages: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80",
        ],
        initialEstimatedValue: 200,
        inspectionResult: "ADJUSTED",
        reportedIssues: ["Tear"],
        issueSeverity: "Minor",
        inspectionNotes:
          "Discovered a small minor tear near the left sleeve seam.",
        inspectionImages: [
          "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=400&auto=format&fit=crop&q=80",
        ],
        systemRecalculatedValue: 160,
        agentFinalValue: 150,
        processingOutcome: "UPCYCLING",
      },
    ],
  },
  {
    id: "RC10042",
    userId: "usr_arav99",
    userName: "Aarav Sharma",
    userPhone: "+91 98765 43210",
    initialEstimatedTotal: 650,
    systemRecalculatedTotal: 650,
    finalPayoutTotal: 650,
    pickupAddress: MOCK_CUSTOMER.addresses[0],
    pickupDate: "2026-08-10",
    pickupTimeSlot: "02:00 PM - 05:00 PM",
    status: "PAYMENT_COMPLETED",
    assignedAgentId: "ag_vikram08",
    assignedAgentName: "Vikram Singh",
    createdAt: "2026-08-08T14:00:00Z",
    updatedAt: "2026-08-10T16:30:00Z",
    inspectionCompletedAt: "2026-08-10T15:45:00Z",
    paymentCompletedAt: "2026-08-10T16:00:00Z",
    batchId: "PB1024",
    paymentMethod: "UPI",
    paymentReference: "UPI/62910482910/RC10042",
    items: [
      {
        id: "ITEM-10042-1",
        listingId: "RC10042",
        category: "Jeans",
        gender: "Men",
        size: "32",
        brand: "Levi's",
        color: "Blue",
        material: "Denim",
        condition: "GOOD",
        weightKg: 0.7,
        userImages: [
          "https://images.unsplash.com/photo-1542272604-780c36856d67?w=400&auto=format&fit=crop&q=80",
        ],
        initialEstimatedValue: 350,
        inspectionResult: "ACCEPTED",
        systemRecalculatedValue: 350,
        agentFinalValue: 350,
        processingOutcome: "UPCYCLING",
      },
      {
        id: "ITEM-10042-2",
        listingId: "RC10042",
        category: "Jacket",
        gender: "Women",
        size: "S",
        brand: "Zara",
        color: "Beige",
        material: "Cotton",
        condition: "GOOD",
        weightKg: 0.6,
        userImages: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=80",
        ],
        initialEstimatedValue: 300,
        inspectionResult: "ACCEPTED",
        systemRecalculatedValue: 300,
        agentFinalValue: 300,
        processingOutcome: "REPAIR",
      },
    ],
  },
]

// Seed Processing Batches
const SEED_BATCHES: ProcessingBatch[] = [
  {
    id: "PB1024",
    batchCode: "PB1024",
    name: "100% Recycled Cotton & Denim Batch",
    materialType: "Denim",
    sourceListingIds: ["RC10042", "RC10038"],
    sourceItemIds: ["ITEM-10042-1", "ITEM-10042-2", "ITEM-10038-3"],
    totalItemsCount: 18,
    totalWeightKg: 12.4,
    status: "COMPLETED",
    resultingOutput: "High-grade Recycled Denim Fiber & Upcycled Fabric Rolls",
    createdProductsCount: 15,
    createdAt: "2026-08-11T09:00:00Z",
    completedAt: "2026-08-13T16:00:00Z",
  },
  {
    id: "PB1025",
    batchCode: "PB1025",
    name: "Handblock & Printed Cotton Upcycling Batch",
    materialType: "Cotton",
    sourceListingIds: ["RC10045"],
    sourceItemIds: ["ITEM-10045-3"],
    totalItemsCount: 12,
    totalWeightKg: 8.6,
    status: "PROCESSING",
    resultingOutput: "Upcycled Patchwork Fabric & Accessories Material",
    createdProductsCount: 8,
    createdAt: "2026-08-15T08:00:00Z",
  },
]

// Seed Store Products with Traceability Stories
const SEED_PRODUCTS: StoreProduct[] = [
  {
    id: "prod_polo_oxford_shirt",
    name: "Upcycled Polo Ralph Lauren Oxford Shirt",
    tagline:
      "Classic tailored button-down shirt reconstructed from 100% upcycled Ralph Lauren oxfords.",
    description:
      "Repurposed from vintage pre-loved Ralph Lauren cotton oxford shirts. Features signature chest pony embroidery, button-down collar, and relaxed fit tailored for all-day comfort.",
    category: "Men's Wear",
    subcategory: "Shirts & Polos",
    gender: "Men",
    size: "L",
    brand: "Polo Ralph Lauren",
    price: 1599,
    originalPrice: 2299,
    stock: 15,
    material: "Cotton",
    recycledContentPercentage: 94,
    weightKg: 0.35,
    color: "Blue",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-POL-MEN-006",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Restructured from sanitized 100% cotton Ralph Lauren shirts collected during Recyclo home pickups.",
      textileWeightRecoveredKg: 0.45,
      co2SavedKg: 6.8,
      waterSavedLiters: 1400,
      sourceBatchCode: "PB1025",
    },
    rating: 4.93,
    reviewsCount: 34,
    isFeatured: true,
  },
  {
    id: "prod_patagonia_fleece",
    name: "Upcycled Patagonia Synchilla Fleece Pullover",
    tagline:
      "Ultra-warm high-pile fleece snap-T pullover built from recycled outdoor garments.",
    description:
      "Re-engineered outdoors fleece pullover constructed from upcycled Patagonia Synchilla sweaters. Includes chest flap pocket, nylon stand-up collar, and elasticated cuffs.",
    category: "Unisex Wear",
    subcategory: "Sweaters & Knitwear",
    gender: "Unisex",
    size: "M",
    brand: "Patagonia",
    price: 1899,
    originalPrice: 2799,
    stock: 10,
    material: "Wool",
    recycledContentPercentage: 100,
    weightKg: 0.6,
    color: "Multicolor",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-PAT-UNI-007",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "100% repurposed Patagonia fleece garments sanitized and reconstructed in Recyclo Batch PB1024.",
      textileWeightRecoveredKg: 0.75,
      co2SavedKg: 11.8,
      waterSavedLiters: 2300,
      sourceBatchCode: "PB1024",
    },
    rating: 4.97,
    reviewsCount: 41,
    isFeatured: true,
  },
  {
    id: "prod_gucci_silk_shirt",
    name: "Repurposed Gucci Monogram Silk Panel Shirt",
    tagline:
      "Luxe limited-edition upcycled silk resort shirt featuring restored floral panelling.",
    description:
      "Exclusive statement silk resort shirt hand-assembled from upcycled Gucci silk scarves and vintage shirts. Features mother-of-pearl buttons and breathable Cuban collar.",
    category: "Unisex Wear",
    subcategory: "Shirts & Polos",
    gender: "Unisex",
    size: "L",
    brand: "Gucci",
    price: 2499,
    originalPrice: 3899,
    stock: 5,
    material: "Silk",
    recycledContentPercentage: 100,
    weightKg: 0.3,
    color: "Multicolor",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-GUC-UNI-008",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Handcrafted from rare upcycled designer silk garments recovered in specialized recycling drives.",
      textileWeightRecoveredKg: 0.4,
      co2SavedKg: 7.2,
      waterSavedLiters: 1500,
      sourceBatchCode: "PB1025",
    },
    rating: 5.0,
    reviewsCount: 19,
    isFeatured: true,
  },
  {
    id: "prod_underarmour_shorts",
    name: "Upcycled Under Armour Tech Mesh Training Shorts",
    tagline:
      "Lightweight moisture-wicking athletic shorts built from upcycled sportswear.",
    description:
      "High-performance gym training shorts constructed from upcycled Under Armour polyester mesh garments. Features internal drawstring and quick-drying tech weave.",
    category: "Men's Wear",
    subcategory: "Shorts & Activewear",
    gender: "Men",
    size: "M",
    brand: "Under Armour",
    price: 999,
    originalPrice: 1499,
    stock: 20,
    material: "Polyester",
    recycledContentPercentage: 95,
    weightKg: 0.25,
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-UAR-MEN-009",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Repurposed from inspect-passed Under Armour performance wear in Recyclo Batch PB1024.",
      textileWeightRecoveredKg: 0.3,
      co2SavedKg: 4.5,
      waterSavedLiters: 900,
      sourceBatchCode: "PB1024",
    },
    rating: 4.88,
    reviewsCount: 27,
    isFeatured: false,
  },
  {
    id: "prod_uniqlo_down_vest",
    name: "Upcycled Uniqlo Ultra Light Down Patchwork Vest",
    tagline:
      "Packable insulated down vest restored with contrast nylon outerwear panels.",
    description:
      "Sleek quilted sleeveless down vest rebuilt from post-consumer Uniqlo outerwear. Provides exceptional warmth without bulk, featuring full-zip closure and side zip pockets.",
    category: "Unisex Wear",
    subcategory: "Vests & Outerwear",
    gender: "Unisex",
    size: "L",
    brand: "Uniqlo",
    price: 1499,
    originalPrice: 2199,
    stock: 12,
    material: "Nylon",
    recycledContentPercentage: 92,
    weightKg: 0.35,
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-UNQ-UNI-010",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Restored from sanitized Uniqlo light outerwear collected during Recyclo winter drives.",
      textileWeightRecoveredKg: 0.45,
      co2SavedKg: 7.9,
      waterSavedLiters: 1600,
      sourceBatchCode: "PB1024",
    },
    rating: 4.91,
    reviewsCount: 32,
    isFeatured: true,
  },
  {
    id: "prod_fabindia_khadi_kurta",
    name: "Upcycled FabIndia Organic Khadi Short Kurta",
    tagline:
      "Hand-spun organic khadi cotton kurta embellished with traditional wooden buttons.",
    description:
      "Breathable short casual kurta remade from upcycled FabIndia khadi shirts. Features mandarin collar, side slits, and artisanal handblock detail.",
    category: "Ethnic & Traditional",
    subcategory: "Kurtas",
    gender: "Men",
    size: "L",
    brand: "FabIndia",
    price: 1199,
    originalPrice: 1699,
    stock: 14,
    material: "Cotton",
    recycledContentPercentage: 98,
    weightKg: 0.3,
    color: "Beige",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-FAB-MEN-011",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Handcrafted from inspect-passed FabIndia organic khadi garments collected in Bengaluru.",
      textileWeightRecoveredKg: 0.4,
      co2SavedKg: 6.2,
      waterSavedLiters: 1250,
      sourceBatchCode: "PB1025",
    },
    rating: 4.94,
    reviewsCount: 26,
    isFeatured: true,
  },
  {
    id: "prod_adidas_track_jacket",
    name: "Upcycled Adidas Trefoil Windbreaker Track Jacket",
    tagline:
      "Restored retro Adidas athletic track jacket crafted from repurposed activewear.",
    description:
      "Reconstructed from 100% post-consumer Adidas vintage tracksuits collected during Recyclo city drives. Features classic 3-stripe sleeve panelling, breathable mesh lining, and zip pockets.",
    category: "Men's Wear",
    subcategory: "Tracksuits & Jackets",
    gender: "Men",
    size: "L",
    brand: "Adidas",
    price: 1699,
    originalPrice: 2499,
    stock: 14,
    material: "Polyester",
    recycledContentPercentage: 98,
    weightKg: 0.55,
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-ADI-MEN-001",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Upcycled from 100% recycled Adidas performance wear collected in Recyclo Batch PB1024.",
      textileWeightRecoveredKg: 0.7,
      co2SavedKg: 10.5,
      waterSavedLiters: 1950,
      sourceBatchCode: "PB1024",
    },
    rating: 4.95,
    reviewsCount: 38,
    isFeatured: true,
  },
  {
    id: "prod_nike_fleece_hoodie",
    name: "Upcycled Nike Sportswear Colorblock Hoodie",
    tagline:
      "Ultra-cozy fleece pullover hoodie built from repurposed Nike sweatshirts.",
    description:
      "Handcrafted colorblock fleece hoodie remade from upcycled Nike athletic wear. Features kangaroo pocket, drawstring hood, and signature embroidered chest patch.",
    category: "Unisex Wear",
    subcategory: "Hoodies & Sweatshirts",
    gender: "Unisex",
    size: "M",
    brand: "Nike",
    price: 1599,
    originalPrice: 2299,
    stock: 16,
    material: "Cotton",
    recycledContentPercentage: 92,
    weightKg: 0.65,
    color: "Grey",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-NKE-UNI-002",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Restructured from sanitized Nike heavy-fleece sweatshirts collected during household drives.",
      textileWeightRecoveredKg: 0.8,
      co2SavedKg: 12.1,
      waterSavedLiters: 2200,
      sourceBatchCode: "PB1025",
    },
    rating: 4.9,
    reviewsCount: 45,
    isFeatured: true,
  },
  {
    id: "prod_puma_t7_joggers",
    name: "Upcycled Puma T7 Athletic Jogger Pants",
    tagline:
      "Reconditioned iconic Puma track pants with vintage contrast side stripes.",
    description:
      "Slim-fit athletic track pants reconstructed from post-consumer Puma fleece joggers. Features elastic waistband with drawstring, side zip pockets, and rib-knit cuffs.",
    category: "Men's Wear",
    subcategory: "Track Pants & Joggers",
    gender: "Men",
    size: "M",
    brand: "Puma",
    price: 1299,
    originalPrice: 1899,
    stock: 18,
    material: "Cotton",
    recycledContentPercentage: 90,
    weightKg: 0.5,
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-PUM-MEN-003",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Upcycled from inspect-passed Puma sportswear garments from Recyclo batch PB1024.",
      textileWeightRecoveredKg: 0.6,
      co2SavedKg: 9.2,
      waterSavedLiters: 1750,
      sourceBatchCode: "PB1024",
    },
    rating: 4.85,
    reviewsCount: 29,
    isFeatured: true,
  },
  {
    id: "prod_zara_silk_wrap_top",
    name: "Repurposed Zara Floral Silk Wrap Blouse",
    tagline:
      "Elegant floor-drape floral wrap blouse created from upcycled Zara silk tops.",
    description:
      "Hand-tailored V-neck wrap top with balloon sleeves crafted from upcycled pre-loved Zara silk blouses. Soft, breathable, and versatile for festive or casual styling.",
    category: "Women's Wear",
    subcategory: "Tops & Blouses",
    gender: "Women",
    size: "S",
    brand: "Zara",
    price: 1399,
    originalPrice: 1999,
    stock: 11,
    material: "Silk",
    recycledContentPercentage: 96,
    weightKg: 0.25,
    color: "Red",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-ZAR-WMN-004",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Repurposed from vintage Zara floral silk blouses recovered during Recyclo home pickups.",
      textileWeightRecoveredKg: 0.35,
      co2SavedKg: 5.4,
      waterSavedLiters: 1200,
      sourceBatchCode: "PB1025",
    },
    rating: 4.92,
    reviewsCount: 23,
    isFeatured: true,
  },
  {
    id: "prod_levis_501_patchwork",
    name: "Upcycled Levi's 501 Sashiko Patchwork Jeans",
    tagline:
      "Hand-rebuilt classic Levi's 501 jeans with Japanese sashiko denim patching.",
    description:
      "Custom straight-leg denim jeans meticulously restored from vintage Levi's 501 denims using hand-stitched sashiko embroidery and contrasting indigo knee patches.",
    category: "Unisex Wear",
    subcategory: "Jeans & Pants",
    gender: "Unisex",
    size: "L",
    brand: "Levi's",
    price: 1799,
    originalPrice: 2599,
    stock: 9,
    material: "Denim",
    recycledContentPercentage: 100,
    weightKg: 0.75,
    color: "Indigo Blue",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-LEV-UNI-005",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Hand-restored using 100% authentic post-consumer Levi's denim jeans.",
      textileWeightRecoveredKg: 0.95,
      co2SavedKg: 14.8,
      waterSavedLiters: 2700,
      sourceBatchCode: "PB1024",
    },
    rating: 4.98,
    reviewsCount: 51,
    isFeatured: true,
  },
  {
    id: "prod_denim_jacket_01",
    name: "Upcycled Patchwork Denim Trucker Jacket",
    tagline:
      "Heavyweight restored indigo denim jacket with handcrafted sashiko stitching.",
    description:
      "Reconstructed from 3 post-consumer denim jeans recovered during household pickups. Features reinforced brass hardware, custom patchwork sleeve paneling, and interior stash pockets.",
    category: "Men's Wear",
    subcategory: "Outerwear & Jackets",
    gender: "Men",
    size: "L",
    price: 1499,
    originalPrice: 2199,
    stock: 12,
    material: "Denim",
    recycledContentPercentage: 95,
    weightKg: 0.85,
    color: "Indigo Blue",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-MEN-001",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Repurposed from inspect-passed denim jeans from Recyclo batch PB1024.",
      textileWeightRecoveredKg: 1.1,
      co2SavedKg: 16.2,
      waterSavedLiters: 2900,
      sourceBatchCode: "PB1024",
    },
    rating: 4.9,
    reviewsCount: 42,
    isFeatured: true,
  },
  {
    id: "prod_silk_kimono_02",
    name: "Repurposed Banarasi Silk Kimono Shrug",
    tagline:
      "Luxe floor-length open shrug crafted from vintage Banarasi silk brocade.",
    description:
      "Hand-tailored open cardigan jacket created from upcycled heirloom Banarasi silk sarees. Features contrast piping and subtle gold zari embroidery.",
    category: "Ethnic & Traditional",
    subcategory: "Kimonos & Shrugs",
    gender: "Women",
    size: "Free Size",
    price: 1899,
    originalPrice: 2699,
    stock: 8,
    material: "Silk",
    recycledContentPercentage: 100,
    weightKg: 0.4,
    color: "Multicolor",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ETH-002",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Handcrafted using upcycled heritage silk sarees sorted from household recycling drives.",
      textileWeightRecoveredKg: 0.55,
      co2SavedKg: 8.5,
      waterSavedLiters: 1600,
      sourceBatchCode: "PB1025",
    },
    rating: 4.95,
    reviewsCount: 28,
    isFeatured: true,
  },
  {
    id: "prod_cotton_kurta_03",
    name: "Handblock Print Upcycled Cotton Kurta",
    tagline:
      "Breathable pure cotton casual kurta with traditional Ajrakh block prints.",
    description:
      "Relaxed fit mandarin collar kurta remade from 100% organic cotton shirts. Features wooden buttons and side pockets.",
    category: "Ethnic & Traditional",
    subcategory: "Kurtas",
    gender: "Men",
    size: "XL",
    price: 899,
    originalPrice: 1299,
    stock: 15,
    material: "Cotton",
    recycledContentPercentage: 90,
    weightKg: 0.3,
    color: "Blue",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ETH-003",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Upcycled from 100% cotton garments collected from Bengaluru households.",
      textileWeightRecoveredKg: 0.4,
      co2SavedKg: 5.8,
      waterSavedLiters: 1100,
      sourceBatchCode: "PB1025",
    },
    rating: 4.8,
    reviewsCount: 31,
    isFeatured: true,
  },
  {
    id: "prod_wool_cardigan_04",
    name: "Recycled Woolen Patchwork Cardigan",
    tagline:
      "Cozy knit button-down cardigan built from upcycled wool yarn & sweater panels.",
    description:
      "Chunk knit winter cardigan using recycled wool fiber blends. Features horn buttons and rib-knit cuffs.",
    category: "Winter & Outerwear",
    subcategory: "Sweaters & Knitwear",
    gender: "Unisex",
    size: "M",
    price: 1299,
    originalPrice: 1899,
    stock: 10,
    material: "Wool",
    recycledContentPercentage: 88,
    weightKg: 0.65,
    color: "Multicolor",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WNT-004",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Spun from sanitized woolen garments collected during Winter Recyclo Drives.",
      textileWeightRecoveredKg: 0.8,
      co2SavedKg: 11.2,
      waterSavedLiters: 2100,
      sourceBatchCode: "PB1024",
    },
    rating: 4.85,
    reviewsCount: 19,
    isFeatured: true,
  },
  {
    id: "prod_denim_jeans_05",
    name: "Upcycled Two-Tone Refitted Denim Jeans",
    tagline:
      "Modern straight-leg denim jeans crafted with dual-wash upcycled denim panels.",
    description:
      "Tailored straight-fit denim jeans with contrast side panels made from two complementary pairs of recycled jeans.",
    category: "Men's Wear",
    subcategory: "Bottomwear & Pants",
    gender: "Men",
    size: "M",
    price: 1199,
    originalPrice: 1699,
    stock: 14,
    material: "Denim",
    recycledContentPercentage: 92,
    weightKg: 0.7,
    color: "Blue",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-MEN-005",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Refitted from reclaimed denim trousers processed in batch PB1024.",
      textileWeightRecoveredKg: 0.9,
      co2SavedKg: 13.1,
      waterSavedLiters: 2450,
      sourceBatchCode: "PB1024",
    },
    rating: 4.75,
    reviewsCount: 22,
  },
  {
    id: "prod_cotton_dress_06",
    name: "Boho Upcycled Patchwork Midi Dress",
    tagline:
      "Tiered A-line summer dress handcrafted from floral cotton remnants.",
    description:
      "Flowy bohemian midi dress featuring adjustable shoulder straps, elasticated back waist, and side seam pockets.",
    category: "Women's Wear",
    subcategory: "Dresses & Skirts",
    gender: "Women",
    size: "S",
    price: 1399,
    originalPrice: 1999,
    stock: 9,
    material: "Cotton",
    recycledContentPercentage: 94,
    weightKg: 0.45,
    color: "Green",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WOM-006",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Stitched from premium cotton dress fabrics recovered through Recyclo.",
      textileWeightRecoveredKg: 0.6,
      co2SavedKg: 8.7,
      waterSavedLiters: 1650,
      sourceBatchCode: "PB1025",
    },
    rating: 4.9,
    reviewsCount: 37,
    isFeatured: true,
  },
  {
    id: "prod_hoodie_07",
    name: "Oversized Upcycled Fleece Hoodie",
    tagline:
      "Ultra-soft streetwear hoodie made from 100% recycled cotton fleece.",
    description:
      "Relaxed unisex hoodie featuring kangaroo pocket, double-lined hood, and ribbed hems made from upcycled sweatshirt material.",
    category: "Unisex Wear",
    subcategory: "Sweatshirts & Hoodies",
    gender: "Unisex",
    size: "XL",
    price: 999,
    originalPrice: 1499,
    stock: 20,
    material: "Cotton",
    recycledContentPercentage: 85,
    weightKg: 0.6,
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-UNI-007",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Made from recycled fleece sweatshirts sorted in Recyclo facility.",
      textileWeightRecoveredKg: 0.75,
      co2SavedKg: 10.5,
      waterSavedLiters: 1900,
      sourceBatchCode: "PB1024",
    },
    rating: 4.8,
    reviewsCount: 54,
  },
  {
    id: "prod_nehru_jacket_08",
    name: "Upcycled Khadi Cotton Nehru Vest Jacket",
    tagline:
      "Sleek ethnic waist-coat tailored from handwoven upcycled khadi cotton.",
    description:
      "Formal sleeveless Nehru jacket featuring brass buttons, pocket square slot, and satin lining made from upcycled lining fabric.",
    category: "Ethnic & Traditional",
    subcategory: "Vests & Nehru Jackets",
    gender: "Men",
    size: "L",
    price: 1099,
    originalPrice: 1599,
    stock: 11,
    material: "Cotton",
    recycledContentPercentage: 100,
    weightKg: 0.35,
    color: "Beige",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ETH-008",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Crafted from handloom khadi garments collected from Eco households.",
      textileWeightRecoveredKg: 0.5,
      co2SavedKg: 7.2,
      waterSavedLiters: 1350,
      sourceBatchCode: "PB1025",
    },
    rating: 4.9,
    reviewsCount: 23,
  },
  {
    id: "prod_linen_shirt_09",
    name: "Upcycled Linen Blend Casual Summer Shirt",
    tagline: "Lightweight breathable linen shirt with relaxed camp collar.",
    description:
      "Summer short-sleeve shirt reconstructed from upcycled linen-cotton trousers and shirts. Soft washed finish.",
    category: "Men's Wear",
    subcategory: "Shirts",
    gender: "Men",
    size: "M",
    price: 799,
    originalPrice: 1199,
    stock: 16,
    material: "Linen",
    recycledContentPercentage: 80,
    weightKg: 0.25,
    color: "White",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-MEN-009",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Rebuilt using pure linen textiles collected in summer drives.",
      textileWeightRecoveredKg: 0.35,
      co2SavedKg: 5.1,
      waterSavedLiters: 950,
      sourceBatchCode: "PB1025",
    },
    rating: 4.7,
    reviewsCount: 16,
  },
  {
    id: "prod_silk_scarf_10",
    name: "Artisan Hand-Stitched Silk Dupatta Scarf",
    tagline:
      "Vibrant lightweight scarf with kantha hand-stitching along edges.",
    description:
      "Statement scarf repurposed from silk sarees. Can be styled as a neck wrap, headscarf, or waist sash.",
    category: "Accessories & Scarves",
    subcategory: "Scarves & Stoles",
    gender: "Women",
    size: "Free Size",
    price: 499,
    originalPrice: 799,
    stock: 25,
    material: "Silk",
    recycledContentPercentage: 100,
    weightKg: 0.15,
    color: "Red",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ACC-010",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Upcycled from 100% natural silk fabrics recovered by Recyclo.",
      textileWeightRecoveredKg: 0.2,
      co2SavedKg: 3.1,
      waterSavedLiters: 600,
      sourceBatchCode: "PB1025",
    },
    rating: 4.85,
    reviewsCount: 40,
  },
  {
    id: "prod_patchwork_skirt_11",
    name: "Upcycled Flared Denim & Cotton Skirt",
    tagline:
      "High-waisted midi skirt with contrasting denim and cotton panels.",
    description:
      "Swishy A-line skirt with button-down front, belt loops, and side pockets made from post-consumer garments.",
    category: "Women's Wear",
    subcategory: "Dresses & Skirts",
    gender: "Women",
    size: "M",
    price: 999,
    originalPrice: 1499,
    stock: 11,
    material: "Denim",
    recycledContentPercentage: 90,
    weightKg: 0.5,
    color: "Blue",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WOM-011",
    batchId: "PB1024",
    traceabilityStory: {
      originText: "Stitched from upcycled denim jeans and cotton skirts.",
      textileWeightRecoveredKg: 0.65,
      co2SavedKg: 9.4,
      waterSavedLiters: 1750,
      sourceBatchCode: "PB1024",
    },
    rating: 4.75,
    reviewsCount: 21,
  },
  {
    id: "prod_denim_vest_12",
    name: "Sleeveless Distressed Denim Biker Vest",
    tagline: "Edgy unisex denim vest with raw frayed edges and metal studs.",
    description:
      "Rugged sleeveless trucker vest with button closure, flap chest pockets, and raw armhole cutouts.",
    category: "Unisex Wear",
    subcategory: "Outerwear & Vests",
    gender: "Unisex",
    size: "L",
    price: 849,
    originalPrice: 1249,
    stock: 13,
    material: "Denim",
    recycledContentPercentage: 95,
    weightKg: 0.55,
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-UNI-012",
    batchId: "PB1024",
    traceabilityStory: {
      originText: "Customized from black denim jackets collected via Recyclo.",
      textileWeightRecoveredKg: 0.7,
      co2SavedKg: 10.2,
      waterSavedLiters: 1900,
      sourceBatchCode: "PB1024",
    },
    rating: 4.8,
    reviewsCount: 29,
  },
  {
    id: "prod_wool_coat_13",
    name: "Recycled Wool Blend Overcoat Trench",
    tagline:
      "Elegant double-breasted long trench coat made from upcycled woolen coats.",
    description:
      "Structured winter overcoat featuring storm flap, waist belt tie, and deep welt pockets. Fully lined.",
    category: "Winter & Outerwear",
    subcategory: "Coats & Trench",
    gender: "Women",
    size: "L",
    price: 2499,
    originalPrice: 3499,
    stock: 6,
    material: "Wool",
    recycledContentPercentage: 86,
    weightKg: 1.2,
    color: "Beige",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WNT-013",
    batchId: "PB1024",
    traceabilityStory: {
      originText: "Reconstructed from heavy woolen overcoats in batch PB1024.",
      textileWeightRecoveredKg: 1.4,
      co2SavedKg: 20.3,
      waterSavedLiters: 3800,
      sourceBatchCode: "PB1024",
    },
    rating: 4.95,
    reviewsCount: 15,
    isFeatured: true,
  },
  {
    id: "prod_cotton_tee_14",
    name: "Repurposed Graphic Patch Pocket Cotton Tee",
    tagline: "Soft organic cotton t-shirt with upcycled printed fabric pocket.",
    description:
      "Classic crewneck tee made from 100% recycled cotton yarn with a contrasting handblock print pocket.",
    category: "Unisex Wear",
    subcategory: "T-Shirts",
    gender: "Unisex",
    size: "S",
    price: 449,
    originalPrice: 699,
    stock: 30,
    material: "Cotton",
    recycledContentPercentage: 75,
    weightKg: 0.2,
    color: "White",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-UNI-014",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Spun from 100% recovered cotton fibers sorted at Recyclo center.",
      textileWeightRecoveredKg: 0.25,
      co2SavedKg: 3.6,
      waterSavedLiters: 680,
      sourceBatchCode: "PB1025",
    },
    rating: 4.65,
    reviewsCount: 33,
  },
  {
    id: "prod_bandana_hat_15",
    name: "Upcycled Denim Bucket Hat & Scarf Combo",
    tagline:
      "Matching eco-streetwear bucket hat and bandana set made from denim scraps.",
    description:
      "Reversible denim bucket hat paired with a lightweight cotton neck bandana. Sturdy stitching.",
    category: "Accessories & Scarves",
    subcategory: "Hats & Bandanas",
    gender: "Unisex",
    size: "Free Size",
    price: 399,
    originalPrice: 599,
    stock: 22,
    material: "Cotton",
    recycledContentPercentage: 98,
    weightKg: 0.2,
    color: "Indigo Blue",
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ACC-015",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Crafted zero-waste from cutting scrap remnants of denim jeans.",
      textileWeightRecoveredKg: 0.25,
      co2SavedKg: 3.6,
      waterSavedLiters: 680,
      sourceBatchCode: "PB1024",
    },
    rating: 4.8,
    reviewsCount: 26,
  },
  {
    id: "prod_brocade_jacket_16",
    name: "Reversible Vintage Silk Brocade Evening Blazer",
    tagline: "Statement tailored blazer with intricate zari woven silk motifs.",
    description:
      "Dual-sided luxury evening blazer featuring silk brocade on one side and sleek upcycled cotton satin on the reverse.",
    category: "Women's Wear",
    subcategory: "Outerwear & Blazers",
    gender: "Women",
    size: "M",
    price: 2199,
    originalPrice: 3199,
    stock: 5,
    material: "Silk",
    recycledContentPercentage: 100,
    weightKg: 0.5,
    color: "Multicolor",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WOM-016",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Upcycled from heirloom silk brocade sarees collected in Bengaluru.",
      textileWeightRecoveredKg: 0.6,
      co2SavedKg: 9.2,
      waterSavedLiters: 1700,
      sourceBatchCode: "PB1025",
    },
    rating: 4.95,
    reviewsCount: 18,
    isFeatured: true,
  },
  {
    id: "prod_denim_overalls_17",
    name: "Upcycled Patchwork Denim Dungaree Overalls",
    tagline:
      "Relaxed-fit utility denim dungarees with contrast front bib pocket.",
    description:
      "Handcrafted bib overalls made from durable post-consumer denim jeans. Features adjustable shoulder straps, side button closures, and utility tool loops.",
    category: "Women's Wear",
    subcategory: "Overalls & Dungarees",
    gender: "Women",
    size: "M",
    price: 1599,
    originalPrice: 2299,
    stock: 10,
    material: "Denim",
    recycledContentPercentage: 96,
    weightKg: 0.8,
    color: "Indigo Blue",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WOM-017",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Stitched using heavy indigo denim from Recyclo batch PB1024.",
      textileWeightRecoveredKg: 1.0,
      co2SavedKg: 14.8,
      waterSavedLiters: 2750,
      sourceBatchCode: "PB1024",
    },
    rating: 4.85,
    reviewsCount: 22,
    isFeatured: true,
  },
  {
    id: "prod_silk_choli_18",
    name: "Repurposed Brocade Silk Padded Crop Blouse",
    tagline:
      "Ethnic padded blouse top crafted from vintage Zari silk brocade saree fabric.",
    description:
      "Sleeveless cropped blouse with back tie detailing, sweetheart neck, and cotton lining remade from upcycled Banarasi sarees.",
    category: "Ethnic & Traditional",
    subcategory: "Tops & Blouses",
    gender: "Women",
    size: "S",
    price: 749,
    originalPrice: 1099,
    stock: 14,
    material: "Silk",
    recycledContentPercentage: 100,
    weightKg: 0.2,
    color: "Red",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ETH-018",
    batchId: "PB1025",
    traceabilityStory: {
      originText:
        "Upcycled from pure brocade silk saree pallus collected in drives.",
      textileWeightRecoveredKg: 0.25,
      co2SavedKg: 3.8,
      waterSavedLiters: 700,
      sourceBatchCode: "PB1025",
    },
    rating: 4.9,
    reviewsCount: 35,
  },
  {
    id: "prod_cotton_workshirt_19",
    name: "Vintage Upcycled Indigo Chambray Workshirt",
    tagline: "Heavy-duty button-down indigo shirt with dual chest pockets.",
    description:
      "Durable casual workshirt tailored from reclaimed cotton chambray garments. Triple-stitched seams and marbleized shell buttons.",
    category: "Men's Wear",
    subcategory: "Shirts",
    gender: "Men",
    size: "L",
    price: 899,
    originalPrice: 1299,
    stock: 18,
    material: "Cotton",
    recycledContentPercentage: 88,
    weightKg: 0.4,
    color: "Blue",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-MEN-019",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "Reconstructed from cotton chambray shirts in batch PB1025.",
      textileWeightRecoveredKg: 0.5,
      co2SavedKg: 7.2,
      waterSavedLiters: 1350,
      sourceBatchCode: "PB1025",
    },
    rating: 4.75,
    reviewsCount: 19,
  },
  {
    id: "prod_linen_trousers_20",
    name: "Relaxed Fit Upcycled Linen Drawstring Trousers",
    tagline:
      "Breezy linen-blend summer trousers with elastic drawstring waistband.",
    description:
      "Comfortable wide-leg pants crafted from upcycled pure linen fabric. Features side slash pockets and rear welt pocket.",
    category: "Unisex Wear",
    subcategory: "Bottomwear & Pants",
    gender: "Unisex",
    size: "L",
    price: 1099,
    originalPrice: 1599,
    stock: 15,
    material: "Linen",
    recycledContentPercentage: 85,
    weightKg: 0.45,
    color: "Beige",
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-UNI-020",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "Tailored using reclaimed linen fabric offcuts from Recyclo.",
      textileWeightRecoveredKg: 0.55,
      co2SavedKg: 8.0,
      waterSavedLiters: 1500,
      sourceBatchCode: "PB1025",
    },
    rating: 4.8,
    reviewsCount: 27,
  },
  {
    id: "prod_wool_poncho_21",
    name: "Fringe Recycled Wool Shawl Poncho",
    tagline:
      "Boho knit wrap poncho with tassel fringes made from recycled wool.",
    description:
      "Layerable winter poncho cape featuring asymmetric hemline and fringed border. Warm, soft, and light weight.",
    category: "Winter & Outerwear",
    subcategory: "Ponchos & Capes",
    gender: "Women",
    size: "Free Size",
    price: 1349,
    originalPrice: 1899,
    stock: 8,
    material: "Wool",
    recycledContentPercentage: 90,
    weightKg: 0.55,
    color: "Multicolor",
    images: [
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WNT-021",
    batchId: "PB1024",
    traceabilityStory: {
      originText: "Crafted from upcycled woolen knit scarves and shawls.",
      textileWeightRecoveredKg: 0.7,
      co2SavedKg: 10.2,
      waterSavedLiters: 1900,
      sourceBatchCode: "PB1024",
    },
    rating: 4.9,
    reviewsCount: 14,
  },
  {
    id: "prod_khadi_shacket_22",
    name: "Upcycled Khadi Cotton Utility Shacket",
    tagline: "Over-shirt jacket hybrid remade from handwoven khadi cotton.",
    description:
      "Versatile shacket featuring button front, military chest pockets, and relaxed fit ideal for spring and autumn layering.",
    category: "Men's Wear",
    subcategory: "Outerwear & Jackets",
    gender: "Men",
    size: "XL",
    price: 1199,
    originalPrice: 1699,
    stock: 12,
    material: "Cotton",
    recycledContentPercentage: 95,
    weightKg: 0.6,
    color: "Green",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-MEN-022",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "Upcycled from heavy handloom khadi cotton jackets.",
      textileWeightRecoveredKg: 0.75,
      co2SavedKg: 10.9,
      waterSavedLiters: 2000,
      sourceBatchCode: "PB1025",
    },
    rating: 4.85,
    reviewsCount: 20,
  },
  {
    id: "prod_denim_mini_skirt_23",
    name: "Refitted Two-Tone Denim Mini Skirt",
    tagline:
      "Trendy high-rise A-line denim skirt crafted from upcycled denim jeans.",
    description:
      "Flattering mini skirt with raw hem and contrast back pockets. Built from post-consumer denim pant legs.",
    category: "Women's Wear",
    subcategory: "Dresses & Skirts",
    gender: "Women",
    size: "S",
    price: 699,
    originalPrice: 999,
    stock: 16,
    material: "Denim",
    recycledContentPercentage: 92,
    weightKg: 0.35,
    color: "Blue",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WOM-023",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Refitted zero-waste from denim legs recovered in batch PB1024.",
      textileWeightRecoveredKg: 0.45,
      co2SavedKg: 6.5,
      waterSavedLiters: 1200,
      sourceBatchCode: "PB1024",
    },
    rating: 4.7,
    reviewsCount: 18,
  },
  {
    id: "prod_cotton_pyjama_set_24",
    name: "Block-Printed Upcycled Lounge Pyjama Set",
    tagline: "Ultra-comfy unisex nightwear set in soft Ajrakh printed cotton.",
    description:
      "Includes relaxed button-down top and elastic waistband pyjama trousers made from 100% upcycled organic cotton.",
    category: "Unisex Wear",
    subcategory: "Lounge & Sleepwear",
    gender: "Unisex",
    size: "M",
    price: 949,
    originalPrice: 1399,
    stock: 18,
    material: "Cotton",
    recycledContentPercentage: 90,
    weightKg: 0.4,
    color: "Indigo Blue",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-UNI-024",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "Made from soft cotton apparel collected in Recyclo drives.",
      textileWeightRecoveredKg: 0.5,
      co2SavedKg: 7.2,
      waterSavedLiters: 1350,
      sourceBatchCode: "PB1025",
    },
    rating: 4.85,
    reviewsCount: 25,
  },
  {
    id: "prod_silk_scarf_men_25",
    name: "Men's Upcycled Raw Silk Pocket Square & Cravat Set",
    tagline:
      "Dapper formal pocket square & cravat tie crafted from silk sarees.",
    description:
      "Elegant formal accessory set featuring rolled hems and rich textured raw silk upcycled from handloom sarees.",
    category: "Accessories & Scarves",
    subcategory: "Scarves & Ties",
    gender: "Men",
    size: "Free Size",
    price: 349,
    originalPrice: 499,
    stock: 28,
    material: "Silk",
    recycledContentPercentage: 100,
    weightKg: 0.1,
    color: "Red",
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ACC-025",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "100% zero-waste silk scrap conversion from PB1025.",
      textileWeightRecoveredKg: 0.12,
      co2SavedKg: 1.8,
      waterSavedLiters: 350,
      sourceBatchCode: "PB1025",
    },
    rating: 4.9,
    reviewsCount: 30,
  },
  {
    id: "prod_cropped_denim_jacket_26",
    name: "Women's Frayed Cropped Denim Biker Jacket",
    tagline: "Chic cropped biker jacket constructed from vintage black denim.",
    description:
      "Features metal zip closure, lapel collar, and raw cut hem. Made from post-consumer black denim jackets.",
    category: "Women's Wear",
    subcategory: "Outerwear & Jackets",
    gender: "Women",
    size: "S",
    price: 1299,
    originalPrice: 1799,
    stock: 11,
    material: "Denim",
    recycledContentPercentage: 94,
    weightKg: 0.6,
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WOM-026",
    batchId: "PB1024",
    traceabilityStory: {
      originText: "Cropped and tailored from black denim coats in PB1024.",
      textileWeightRecoveredKg: 0.75,
      co2SavedKg: 11.1,
      waterSavedLiters: 2050,
      sourceBatchCode: "PB1024",
    },
    rating: 4.8,
    reviewsCount: 22,
  },
  {
    id: "prod_recycled_fleece_vest_27",
    name: "Zip-Up Recycled Fleece Gilet Vest",
    tagline: "Lightweight sleeveless fleece vest with chest zip pocket.",
    description:
      "Perfect mid-layer vest made from 100% recycled polyester/cotton fleece garments. Elasticated armholes.",
    category: "Winter & Outerwear",
    subcategory: "Vests & Outerwear",
    gender: "Unisex",
    size: "L",
    price: 799,
    originalPrice: 1099,
    stock: 17,
    material: "Mixed",
    recycledContentPercentage: 88,
    weightKg: 0.35,
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WNT-027",
    batchId: "PB1024",
    traceabilityStory: {
      originText: "Recycled fleece offcuts processed at Recyclo center.",
      textileWeightRecoveredKg: 0.45,
      co2SavedKg: 6.5,
      waterSavedLiters: 1200,
      sourceBatchCode: "PB1024",
    },
    rating: 4.75,
    reviewsCount: 16,
  },
  {
    id: "prod_embroidered_anarkali_28",
    name: "Upcycled Chanderi Silk Tiered Kurti Dress",
    tagline: "Graceful festive silk kurti dress with fine zari embroidery.",
    description:
      "Tiered Anarkali style tunic remade from vintage Chanderi silk sarees. Breathable cotton lining.",
    category: "Ethnic & Traditional",
    subcategory: "Kurtas & Dresses",
    gender: "Women",
    size: "M",
    price: 1699,
    originalPrice: 2399,
    stock: 7,
    material: "Silk",
    recycledContentPercentage: 100,
    weightKg: 0.4,
    color: "Green",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ETH-028",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "Upcycled from inspect-passed silk sarees in PB1025.",
      textileWeightRecoveredKg: 0.5,
      co2SavedKg: 7.7,
      waterSavedLiters: 1450,
      sourceBatchCode: "PB1025",
    },
    rating: 4.95,
    reviewsCount: 29,
    isFeatured: true,
  },
  {
    id: "prod_cotton_shorts_29",
    name: "Patchwork Denim & Cotton Summer Shorts",
    tagline: "Relaxed casual bermuda shorts built from upcycled fabric panels.",
    description:
      "Features elastic drawstring waist, deep side pockets, and durable reinforced stitching.",
    category: "Men's Wear",
    subcategory: "Bottomwear & Shorts",
    gender: "Men",
    size: "M",
    price: 599,
    originalPrice: 849,
    stock: 20,
    material: "Denim",
    recycledContentPercentage: 90,
    weightKg: 0.3,
    color: "Blue",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-MEN-029",
    batchId: "PB1024",
    traceabilityStory: {
      originText: "Made from denim and cotton trouser remnants.",
      textileWeightRecoveredKg: 0.4,
      co2SavedKg: 5.8,
      waterSavedLiters: 1100,
      sourceBatchCode: "PB1024",
    },
    rating: 4.65,
    reviewsCount: 14,
  },
  {
    id: "prod_boho_kimono_robe_30",
    name: "Printed Cotton Boho Bathrobe / Duster Coat",
    tagline:
      "Floor-length printed cotton wrap coat with fabric belt waist tie.",
    description:
      "Multi-functional lightweight duster coat or lougewear robe remade from soft handblock printed cotton sheets.",
    category: "Women's Wear",
    subcategory: "Kimonos & Robes",
    gender: "Women",
    size: "Free Size",
    price: 1149,
    originalPrice: 1649,
    stock: 12,
    material: "Cotton",
    recycledContentPercentage: 96,
    weightKg: 0.45,
    color: "Multicolor",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WOM-030",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "Repurposed from pure cotton block-print textiles.",
      textileWeightRecoveredKg: 0.55,
      co2SavedKg: 8.0,
      waterSavedLiters: 1500,
      sourceBatchCode: "PB1025",
    },
    rating: 4.9,
    reviewsCount: 31,
  },
  {
    id: "prod_upcycled_beanie_31",
    name: "Recycled Wool Ribbed Beanie & Wrist Warmer Set",
    tagline: "Cozy eco-knit winter cap and fingerless wrist warmers.",
    description:
      "Knit from 100% recycled woolen yarn. Soft touch, itch-free, and snug winter fit.",
    category: "Accessories & Scarves",
    subcategory: "Hats & Gloves",
    gender: "Unisex",
    size: "Free Size",
    price: 349,
    originalPrice: 499,
    stock: 25,
    material: "Wool",
    recycledContentPercentage: 98,
    weightKg: 0.2,
    color: "Black",
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ACC-031",
    batchId: "PB1024",
    traceabilityStory: {
      originText:
        "Spun from woolen sweaters collected during Winter Recyclo Drives.",
      textileWeightRecoveredKg: 0.25,
      co2SavedKg: 3.6,
      waterSavedLiters: 680,
      sourceBatchCode: "PB1024",
    },
    rating: 4.8,
    reviewsCount: 22,
  },
  {
    id: "prod_unisex_linen_kurta_32",
    name: "Minimalist Off-White Upcycled Linen Short Kurta",
    tagline: "Casual short kurta top crafted from pure upcycled linen fabric.",
    description:
      "Modern short kurta tunic with side slits, wooden button placket, and breathable finish.",
    category: "Ethnic & Traditional",
    subcategory: "Kurtas",
    gender: "Unisex",
    size: "XL",
    price: 849,
    originalPrice: 1199,
    stock: 14,
    material: "Linen",
    recycledContentPercentage: 85,
    weightKg: 0.3,
    color: "White",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ETH-032",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "Stitched from 100% linen offcuts in batch PB1025.",
      textileWeightRecoveredKg: 0.4,
      co2SavedKg: 5.8,
      waterSavedLiters: 1100,
      sourceBatchCode: "PB1025",
    },
    rating: 4.75,
    reviewsCount: 19,
  },
  {
    id: "prod_saree_fusion_gown_33",
    name: "Repurposed Zari Silk Fusion Maxi Gown",
    tagline:
      "Floor-length evening gown created from upcycled Kanjeevaram silk saree.",
    description:
      "Elegant flared gown with subtle gold zari border accents and structured bodice lining.",
    category: "Ethnic & Traditional",
    subcategory: "Dresses & Gowns",
    gender: "Women",
    size: "L",
    price: 2299,
    originalPrice: 3299,
    stock: 4,
    material: "Silk",
    recycledContentPercentage: 100,
    weightKg: 0.65,
    color: "Red",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-ETH-033",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "Repurposed from heritage Kanjeevaram silk sarees.",
      textileWeightRecoveredKg: 0.8,
      co2SavedKg: 11.5,
      waterSavedLiters: 2200,
      sourceBatchCode: "PB1025",
    },
    rating: 4.98,
    reviewsCount: 37,
    isFeatured: true,
  },
  {
    id: "prod_denim_cargo_pants_34",
    name: "Upcycled Multi-Pocket Denim Cargo Pants",
    tagline:
      "Streetwear utility cargo trousers made from upcycled denim paneling.",
    description:
      "Relaxed-fit cargo pants featuring 6 flap pockets, drawstring ankles, and sturdy brass zip fly.",
    category: "Men's Wear",
    subcategory: "Bottomwear & Pants",
    gender: "Men",
    size: "L",
    price: 1399,
    originalPrice: 1999,
    stock: 12,
    material: "Denim",
    recycledContentPercentage: 94,
    weightKg: 0.75,
    color: "Indigo Blue",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-MEN-034",
    batchId: "PB1024",
    traceabilityStory: {
      originText: "Reconstructed from indigo denim jeans in batch PB1024.",
      textileWeightRecoveredKg: 0.95,
      co2SavedKg: 14.0,
      waterSavedLiters: 2600,
      sourceBatchCode: "PB1024",
    },
    rating: 4.85,
    reviewsCount: 26,
  },
  {
    id: "prod_wool_tweed_blazer_35",
    name: "Upcycled Handspun Wool Tweed Tailored Blazer",
    tagline:
      "Classic structured winter blazer remade from recycled woolen tweed.",
    description:
      "Refined single-breasted blazer with notch lapel, elbow patches, and soft inner lining.",
    category: "Winter & Outerwear",
    subcategory: "Outerwear & Blazers",
    gender: "Men",
    size: "L",
    price: 2199,
    originalPrice: 3199,
    stock: 6,
    material: "Wool",
    recycledContentPercentage: 88,
    weightKg: 0.9,
    color: "Beige",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WNT-035",
    batchId: "PB1024",
    traceabilityStory: {
      originText: "Spun from reclaimed woolen suit jackets and coats.",
      textileWeightRecoveredKg: 1.1,
      co2SavedKg: 16.0,
      waterSavedLiters: 3000,
      sourceBatchCode: "PB1024",
    },
    rating: 4.92,
    reviewsCount: 17,
  },
  {
    id: "prod_cotton_kaftan_36",
    name: "Ajrakh Printed Cotton Summer Kaftan Dress",
    tagline: "Flowy breezy kaftan dress with drawstring waist tie.",
    description:
      "Relaxed bohemian dress with kimono sleeves, side slits, and handblock Ajrakh print motifs.",
    category: "Women's Wear",
    subcategory: "Dresses & Kaftans",
    gender: "Women",
    size: "Free Size",
    price: 1049,
    originalPrice: 1499,
    stock: 15,
    material: "Cotton",
    recycledContentPercentage: 95,
    weightKg: 0.35,
    color: "Multicolor",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
    ],
    sku: "REC-CLO-WOM-036",
    batchId: "PB1025",
    traceabilityStory: {
      originText: "Upcycled from soft handblock printed cotton sheets.",
      textileWeightRecoveredKg: 0.45,
      co2SavedKg: 6.5,
      waterSavedLiters: 1200,
      sourceBatchCode: "PB1025",
    },
    rating: 4.88,
    reviewsCount: 24,
  },
]

// Seed Notifications
const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    userId: "usr_arav99",
    role: "CUSTOMER",
    title: "Pickup Agent Assigned!",
    message:
      "Vikram Singh (#AG809) has been assigned to your pickup RC10045 scheduled for tomorrow.",
    type: "INFO",
    read: false,
    link: "/listings/RC10045",
    createdAt: "2026-08-15T09:15:00Z",
  },
  {
    id: "notif_2",
    userId: "usr_arav99",
    role: "CUSTOMER",
    title: "Payment Credited ₹650",
    message:
      "Payout for Listing RC10042 has been successfully transferred to your UPI ID.",
    type: "SUCCESS",
    read: true,
    link: "/wallet",
    createdAt: "2026-08-10T16:05:00Z",
  },
  {
    id: "notif_3",
    userId: "ag_vikram08",
    role: "AGENT",
    title: "New Pickup Task",
    message: "Pickup RC10045 assigned in Indiranagar (3 items, Est. ₹450).",
    type: "INFO",
    read: false,
    link: "/agent/inspect/RC10045",
    createdAt: "2026-08-15T09:15:00Z",
  },
]

// Seed Wallet Transactions
const SEED_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "tx_9901",
    userId: "usr_arav99",
    type: "CREDIT",
    amount: 650,
    title: "Recycling Payout RC10042",
    description: "Direct UPI transfer for 2 verified clothing items",
    relatedListingId: "RC10042",
    status: "SUCCESS",
    createdAt: "2026-08-10T16:00:00Z",
  },
  {
    id: "tx_9898",
    userId: "usr_arav99",
    type: "CREDIT",
    amount: 1800,
    title: "Recycling Payout RC10038",
    description: "Bank Transfer for 7 verified clothing items",
    relatedListingId: "RC10038",
    status: "SUCCESS",
    createdAt: "2026-07-28T11:30:00Z",
  },
]

interface RecycloState {
  // Auth & Roles
  activeRole: Role
  currentUser: UserProfile
  activeAgent: AgentProfile
  agentsList: AgentProfile[]
  isAuthenticated: boolean
  registeredUsers: UserProfile[]
  setActiveRole: (role: Role) => void
  updateUserProfile: (data: Partial<UserProfile>) => void
  login: (email: string, password?: string, preferredRole?: Role) => boolean
  signup: (
    name: string,
    email: string,
    phone: string,
    password?: string,
    role?: Role
  ) => boolean
  logout: () => void
  addAddress: (address: Omit<PickupAddress, "id">) => void
  deleteAddress: (addressId: string) => void
  setDefaultAddress: (addressId: string) => void

  // Listings & Recycling
  listings: RecyclingListing[]
  addListing: (
    newListing: Omit<RecyclingListing, "id" | "createdAt" | "updatedAt">
  ) => string
  updateListingStatus: (
    listingId: string,
    status: RecyclingListing["status"],
    extra?: Partial<RecyclingListing>
  ) => void
  updateItemInspection: (
    listingId: string,
    itemId: string,
    result: InspectionStatus,
    issues: InspectionIssue[],
    severity: "Minor" | "Moderate" | "Severe",
    notes: string,
    agentFinalVal: number,
    rejectionReason?: string
  ) => void
  confirmListingInspection: (listingId: string, agentFinalTotal: number) => void
  assignAgentToListing: (listingId: string, agentId: string) => void

  // Wallet & Payouts
  walletTransactions: WalletTransaction[]
  processPayoutForListing: (listingId: string) => void

  // Processing & Batches
  batches: ProcessingBatch[]
  createProcessingBatch: (
    batchData: Omit<ProcessingBatch, "id" | "createdAt">
  ) => void

  // Store & Shopping Cart
  products: StoreProduct[]
  cart: CartItem[]
  orders: Order[]
  addToCart: (product: StoreProduct, qty?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  placeOrder: (
    deliveryAddress: PickupAddress,
    paymentMethod: Order["paymentMethod"]
  ) => Order
  updateOrderStatus: (orderId: string, status: Order["orderStatus"]) => void

  // Disputes & Audit Logs
  disputes: Dispute[]
  createDispute: (
    disputeData: Omit<Dispute, "id" | "createdAt" | "updatedAt" | "status">
  ) => void
  resolveDispute: (
    disputeId: string,
    status: Dispute["status"],
    adminNotes: string,
    extraPayout?: number
  ) => void
  auditLogs: AuditLog[]
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void

  // Pricing Rules
  updatePricingRules: (
    categoryPrices: Record<string, number>,
    materialMultipliers: Record<string, number>
  ) => void

  // Notifications
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  addNotification: (
    notif: Omit<Notification, "id" | "createdAt" | "read">
  ) => void
}

export const useRecycloStore = create<RecycloState>()(
  persist(
    (set, get) => ({
      activeRole: "CUSTOMER",
      currentUser: MOCK_CUSTOMER,
      activeAgent: MOCK_AGENT,
      agentsList: MOCK_AGENTS_LIST,
      listings: SEED_LISTINGS,
      batches: SEED_BATCHES,
      products: SEED_PRODUCTS,
      cart: [],
      orders: [],
      walletTransactions: SEED_TRANSACTIONS,
      disputes: [],
      auditLogs: [
        {
          id: "log_1",
          entityType: "LISTING",
          entityId: "RC10045",
          action: "LISTING_CREATED",
          performedBy: "Aarav Sharma",
          performedByRole: "CUSTOMER",
          details:
            "Recycling listing created with 3 clothing items (Est. ₹450)",
          timestamp: "2026-08-14T10:30:00Z",
        },
        {
          id: "log_2",
          entityType: "LISTING",
          entityId: "RC10045",
          action: "AGENT_ASSIGNED",
          performedBy: "Priya Nair (System Ops)",
          performedByRole: "ADMIN",
          details: "Assigned agent Vikram Singh (#AG809) to pickup",
          timestamp: "2026-08-15T09:15:00Z",
        },
      ],
      notifications: SEED_NOTIFICATIONS,

      isAuthenticated: true,
      registeredUsers: [
        { ...MOCK_CUSTOMER, password: "password123" },
        {
          id: "usr_priya_admin",
          name: "Priya Nair",
          email: "priya.nair@recyclo.in",
          phone: "+91 98765 00001",
          role: "ADMIN",
          avatarUrl:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          addresses: [MOCK_CUSTOMER.addresses[0]],
          payoutUpiId: "priya@okicici",
          totalEarnings: 0,
          totalKgRecycled: 0,
          totalItemsRecycled: 0,
          totalListingsCount: 0,
          password: "password123",
        },
      ],

      // Role & Profile Actions
      setActiveRole: (role) => set({ activeRole: role }),

      updateUserProfile: (data) =>
        set((state) => ({
          currentUser: { ...state.currentUser, ...data },
        })),

      login: (email, _password, preferredRole) => {
        const state = get()
        const user = state.registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )
        if (user) {
          set({
            currentUser: user,
            activeRole: preferredRole || user.role,
            isAuthenticated: true,
          })
          return true
        }
        if (
          email.toLowerCase().includes("aarav") ||
          email.toLowerCase().includes("customer")
        ) {
          set({
            currentUser: MOCK_CUSTOMER,
            activeRole: "CUSTOMER",
            isAuthenticated: true,
          })
          return true
        }
        if (
          email.toLowerCase().includes("vikram") ||
          email.toLowerCase().includes("agent")
        ) {
          set({
            activeRole: "AGENT",
            isAuthenticated: true,
          })
          return true
        }
        if (
          email.toLowerCase().includes("priya") ||
          email.toLowerCase().includes("admin")
        ) {
          set({
            activeRole: "ADMIN",
            isAuthenticated: true,
          })
          return true
        }
        return false
      },

      signup: (name, email, phone, password, role = "CUSTOMER") => {
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          name,
          email,
          phone,
          role,
          avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          addresses: [
            {
              id: `addr_${Date.now()}`,
              fullName: name,
              phone,
              streetAddress: "123 Green Park Colony",
              city: "Bengaluru",
              state: "Karnataka",
              pincode: "560001",
              isDefault: true,
            },
          ],
          payoutUpiId: `${phone.replace(/\D/g, "")}@upi`,
          totalEarnings: 0,
          totalKgRecycled: 0,
          totalItemsRecycled: 0,
          totalListingsCount: 0,
          password: password || "password123",
        }

        set((state) => ({
          registeredUsers: [newUser, ...state.registeredUsers],
          currentUser: newUser,
          activeRole: role,
          isAuthenticated: true,
        }))
        return true
      },

      logout: () => set({ isAuthenticated: false }),

      addAddress: (addressData) => {
        const newAddress: PickupAddress = {
          ...addressData,
          id: `addr_${Date.now()}`,
        }
        set((state) => {
          const addresses = addressData.isDefault
            ? state.currentUser.addresses.map((a) => ({
                ...a,
                isDefault: false,
              }))
            : [...state.currentUser.addresses]
          return {
            currentUser: {
              ...state.currentUser,
              addresses: [newAddress, ...addresses],
            },
          }
        })
      },

      deleteAddress: (addressId) => {
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            addresses: state.currentUser.addresses.filter(
              (a) => a.id !== addressId
            ),
          },
        }))
      },

      setDefaultAddress: (addressId) => {
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            addresses: state.currentUser.addresses.map((a) => ({
              ...a,
              isDefault: a.id === addressId,
            })),
          },
        }))
      },

      // Recycling Actions
      addListing: (data) => {
        const newId = `RC${Math.floor(10000 + Math.random() * 90000)}`
        const timestamp = new Date().toISOString()
        const itemsWithIds: ClothingItem[] = data.items.map((item, idx) => ({
          ...item,
          id: `ITEM-${newId}-${idx + 1}`,
          listingId: newId,
        }))

        const newListing: RecyclingListing = {
          ...data,
          id: newId,
          items: itemsWithIds,
          createdAt: timestamp,
          updatedAt: timestamp,
          status: "AWAITING_PICKUP",
        }

        set((state) => ({
          listings: [newListing, ...state.listings],
          currentUser: {
            ...state.currentUser,
            totalListingsCount: state.currentUser.totalListingsCount + 1,
          },
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              entityType: "LISTING",
              entityId: newId,
              action: "LISTING_SUBMITTED",
              performedBy: state.currentUser.name,
              performedByRole: "CUSTOMER",
              details: `Submitted recycling listing #${newId} with ${itemsWithIds.length} items (Est. Total ₹${newListing.initialEstimatedTotal})`,
              timestamp,
            },
            ...state.auditLogs,
          ],
          notifications: [
            {
              id: `notif_${Date.now()}`,
              userId: state.currentUser.id,
              role: "CUSTOMER",
              title: "Recycling Request Submitted!",
              message: `Listing #${newId} created with ${itemsWithIds.length} items. Estimated payout ₹${newListing.initialEstimatedTotal}.`,
              type: "SUCCESS",
              read: false,
              link: `/listings/${newId}`,
              createdAt: timestamp,
            },
            ...state.notifications,
          ],
        }))

        return newId
      },

      updateListingStatus: (listingId, status, extra = {}) => {
        const timestamp = new Date().toISOString()
        set((state) => {
          const updatedListings = state.listings.map((l) =>
            l.id === listingId
              ? { ...l, status, updatedAt: timestamp, ...extra }
              : l
          )

          return {
            listings: updatedListings,
            auditLogs: [
              {
                id: `log_${Date.now()}`,
                entityType: "LISTING",
                entityId: listingId,
                action: `STATUS_CHANGED_${status}`,
                performedBy: state.currentUser.name,
                performedByRole: state.activeRole,
                details: `Listing status updated to ${status}`,
                timestamp,
              },
              ...state.auditLogs,
            ],
          }
        })
      },

      updateItemInspection: (
        listingId,
        itemId,
        result,
        issues,
        severity,
        notes,
        agentFinalVal,
        rejectionReason
      ) => {
        set((state) => {
          const listing = state.listings.find((l) => l.id === listingId)
          if (!listing) return state

          const updatedItems = listing.items.map((item) => {
            if (item.id !== itemId) return item

            // Recalculate system value based on inspection condition/issues
            const recalc = recalculateItemInspectionValue(
              item.initialEstimatedValue,
              item.category,
              item.material,
              item.condition,
              issues,
              severity
            )

            return {
              ...item,
              inspectionResult: result,
              reportedIssues: issues,
              issueSeverity: severity,
              inspectionNotes: notes,
              systemRecalculatedValue: recalc.systemRecalculated,
              agentFinalValue: result === "REJECTED" ? 0 : agentFinalVal,
              rejectionReason,
            }
          })

          // Calculate new total
          const newFinalTotal = updatedItems.reduce(
            (acc, curr) =>
              acc + (curr.agentFinalValue ?? curr.initialEstimatedValue),
            0
          )
          const newSystemTotal = updatedItems.reduce(
            (acc, curr) =>
              acc +
              (curr.systemRecalculatedValue ?? curr.initialEstimatedValue),
            0
          )

          const updatedListings = state.listings.map((l) =>
            l.id === listingId
              ? {
                  ...l,
                  items: updatedItems,
                  systemRecalculatedTotal: newSystemTotal,
                  finalPayoutTotal: newFinalTotal,
                  status: "INSPECTION_IN_PROGRESS" as const,
                  updatedAt: new Date().toISOString(),
                }
              : l
          )

          return { listings: updatedListings }
        })
      },

      confirmListingInspection: (listingId, agentFinalTotal) => {
        const timestamp = new Date().toISOString()
        set((state) => {
          const listing = state.listings.find((l) => l.id === listingId)
          if (!listing) return state

          const updatedListings = state.listings.map((l) =>
            l.id === listingId
              ? {
                  ...l,
                  finalPayoutTotal: agentFinalTotal,
                  status: "PICKUP_COMPLETED" as const,
                  inspectionCompletedAt: timestamp,
                  updatedAt: timestamp,
                }
              : l
          )

          return {
            listings: updatedListings,
            auditLogs: [
              {
                id: `log_${Date.now()}`,
                entityType: "LISTING",
                entityId: listingId,
                action: "INSPECTION_COMPLETED",
                performedBy: state.activeAgent.name,
                performedByRole: "AGENT",
                details: `Physical inspection completed for #${listingId}. Initial estimate: ₹${listing.initialEstimatedTotal}, Final payout confirmed: ₹${agentFinalTotal}.`,
                previousValue: `₹${listing.initialEstimatedTotal}`,
                newValue: `₹${agentFinalTotal}`,
                timestamp,
              },
              ...state.auditLogs,
            ],
            notifications: [
              {
                id: `notif_${Date.now()}`,
                userId: listing.userId,
                role: "CUSTOMER",
                title: "Inspection Completed!",
                message: `Your pickup #${listingId} inspection is finished. Final confirmed payout: ₹${agentFinalTotal}. Payment is processing.`,
                type: "SUCCESS",
                read: false,
                link: `/listings/${listingId}`,
                createdAt: timestamp,
              },
              ...state.notifications,
            ],
          }
        })

        // Trigger payment processing automatically after inspection
        get().processPayoutForListing(listingId)
      },

      assignAgentToListing: (listingId, agentId) => {
        const agent = get().agentsList.find((a) => a.id === agentId)
        const timestamp = new Date().toISOString()
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === listingId
              ? {
                  ...l,
                  assignedAgentId: agentId,
                  assignedAgentName: agent ? agent.name : "Recyclo Agent",
                  status: "AGENT_ASSIGNED",
                  updatedAt: timestamp,
                }
              : l
          ),
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              entityType: "LISTING",
              entityId: listingId,
              action: "AGENT_ASSIGNED",
              performedBy: state.currentUser.name,
              performedByRole: "ADMIN",
              details: `Assigned agent ${agent?.name || agentId} to listing #${listingId}`,
              timestamp,
            },
            ...state.auditLogs,
          ],
        }))
      },

      processPayoutForListing: (listingId) => {
        const timestamp = new Date().toISOString()
        set((state) => {
          const listing = state.listings.find((l) => l.id === listingId)
          if (!listing) return state

          const payoutAmount =
            listing.finalPayoutTotal ?? listing.initialEstimatedTotal

          const newTransaction: WalletTransaction = {
            id: `tx_${Math.floor(1000 + Math.random() * 9000)}`,
            userId: listing.userId,
            type: "CREDIT",
            amount: payoutAmount,
            title: `Recycling Payout #${listingId}`,
            description: `Final payout for ${listing.items.length} verified clothing items`,
            relatedListingId: listingId,
            status: "SUCCESS",
            createdAt: timestamp,
          }

          const totalWeight = listing.items.reduce(
            (acc, i) => acc + i.weightKg,
            0
          )

          const updatedListings = state.listings.map((l) =>
            l.id === listingId
              ? {
                  ...l,
                  status: "PAYMENT_COMPLETED" as const,
                  paymentCompletedAt: timestamp,
                  paymentMethod: "UPI" as const,
                  paymentReference: `UPI/${Math.floor(10000000000 + Math.random() * 90000000000)}/${listingId}`,
                  updatedAt: timestamp,
                }
              : l
          )

          return {
            listings: updatedListings,
            walletTransactions: [newTransaction, ...state.walletTransactions],
            currentUser: {
              ...state.currentUser,
              totalEarnings: state.currentUser.totalEarnings + payoutAmount,
              totalKgRecycled:
                Math.round(
                  (state.currentUser.totalKgRecycled + totalWeight) * 10
                ) / 10,
              totalItemsRecycled:
                state.currentUser.totalItemsRecycled + listing.items.length,
            },
            auditLogs: [
              {
                id: `log_${Date.now()}`,
                entityType: "PAYMENT",
                entityId: listingId,
                action: "PAYMENT_COMPLETED",
                performedBy: "System Payment Gateway",
                performedByRole: "ADMIN",
                details: `Transferred ₹${payoutAmount} to ${listing.userName} via UPI for #${listingId}`,
                timestamp,
              },
              ...state.auditLogs,
            ],
            notifications: [
              {
                id: `notif_${Date.now()}`,
                userId: listing.userId,
                role: "CUSTOMER",
                title: `Payment Received! ₹${payoutAmount}`,
                message: `Payout for recycling listing #${listingId} has been deposited to your account.`,
                type: "SUCCESS",
                read: false,
                link: "/wallet",
                createdAt: timestamp,
              },
              ...state.notifications,
            ],
          }
        })
      },

      // Operations & Batches
      createProcessingBatch: (batchData) => {
        const timestamp = new Date().toISOString()
        const batchId = `PB${Math.floor(1000 + Math.random() * 9000)}`

        const newBatch: ProcessingBatch = {
          ...batchData,
          id: batchId,
          batchCode: batchId,
          createdAt: timestamp,
        }

        set((state) => ({
          batches: [newBatch, ...state.batches],
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              entityType: "BATCH",
              entityId: batchId,
              action: "BATCH_CREATED",
              performedBy: state.currentUser.name,
              performedByRole: "ADMIN",
              details: `Created processing ${batchId} with ${batchData.totalItemsCount} items (${batchData.totalWeightKg}kg)`,
              timestamp,
            },
            ...state.auditLogs,
          ],
        }))
      },

      // Shopping & Store
      addToCart: (product, qty = 1) => {
        set((state) => {
          const existing = state.cart.find((c) => c.product.id === product.id)
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.product.id === product.id
                  ? { ...c, quantity: c.quantity + qty }
                  : c
              ),
            }
          }
          return { cart: [...state.cart, { product, quantity: qty }] }
        })
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((c) => c.product.id !== productId),
        }))
      },

      updateCartQuantity: (productId, quantity) => {
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((c) => c.product.id !== productId)
              : state.cart.map((c) =>
                  c.product.id === productId ? { ...c, quantity } : c
                ),
        }))
      },

      clearCart: () => set({ cart: [] }),

      placeOrder: (deliveryAddress, paymentMethod) => {
        const state = get()
        const subtotal = state.cart.reduce(
          (acc, c) => acc + c.product.price * c.quantity,
          0
        )
        const shippingFee = subtotal > 999 ? 0 : 79
        const tax = Math.round(subtotal * 0.05)
        const total = subtotal + shippingFee + tax
        const timestamp = new Date().toISOString()
        const orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`

        const newOrder: Order = {
          id: orderId,
          userId: state.currentUser.id,
          userName: state.currentUser.name,
          userEmail: state.currentUser.email,
          items: [...state.cart],
          subtotal,
          shippingFee,
          tax,
          total,
          deliveryAddress,
          paymentMethod,
          paymentStatus: "PAID",
          orderStatus: "PLACED",
          trackingNumber: `TRK-REC-${Math.floor(10000000 + Math.random() * 90000000)}`,
          createdAt: timestamp,
          updatedAt: timestamp,
        }

        set((s) => ({
          orders: [newOrder, ...s.orders],
          cart: [],
          notifications: [
            {
              id: `notif_${Date.now()}`,
              userId: s.currentUser.id,
              role: "CUSTOMER",
              title: "Order Placed Successfully!",
              message: `Order #${orderId} for ₹${total} has been confirmed and is being processed.`,
              type: "SUCCESS",
              read: false,
              link: `/orders`,
              createdAt: timestamp,
            },
            ...s.notifications,
          ],
        }))

        return newOrder
      },

      updateOrderStatus: (orderId, status) => {
        const timestamp = new Date().toISOString()
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, orderStatus: status, updatedAt: timestamp }
              : o
          ),
        }))
      },

      // Disputes & Logs
      createDispute: (disputeData) => {
        const timestamp = new Date().toISOString()
        const disputeId = `DSP${Math.floor(1000 + Math.random() * 9000)}`

        const newDispute: Dispute = {
          ...disputeData,
          id: disputeId,
          status: "OPEN",
          createdAt: timestamp,
          updatedAt: timestamp,
        }

        set((state) => ({
          disputes: [newDispute, ...state.disputes],
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              entityType: "DISPUTE",
              entityId: disputeId,
              action: "DISPUTE_RAISED",
              performedBy: state.currentUser.name,
              performedByRole: "CUSTOMER",
              details: `Raised dispute for listing #${disputeData.listingId}: ${disputeData.explanation}`,
              timestamp,
            },
            ...state.auditLogs,
          ],
        }))
      },

      resolveDispute: (disputeId, status, adminNotes, extraPayout = 0) => {
        const timestamp = new Date().toISOString()
        set((state) => {
          const dispute = state.disputes.find((d) => d.id === disputeId)
          if (!dispute) return state

          const updatedDisputes = state.disputes.map((d) =>
            d.id === disputeId
              ? {
                  ...d,
                  status,
                  adminNotes,
                  resolutionPayoutAdjust: extraPayout,
                  updatedAt: timestamp,
                }
              : d
          )

          let updatedTransactions = state.walletTransactions
          if (extraPayout > 0) {
            updatedTransactions = [
              {
                id: `tx_${Math.floor(1000 + Math.random() * 9000)}`,
                userId: dispute.userId,
                type: "CREDIT",
                amount: extraPayout,
                title: `Dispute Resolution Payout #${dispute.listingId}`,
                description: `Adjusted payout following review: ${adminNotes}`,
                relatedListingId: dispute.listingId,
                status: "SUCCESS",
                createdAt: timestamp,
              },
              ...state.walletTransactions,
            ]
          }

          return {
            disputes: updatedDisputes,
            walletTransactions: updatedTransactions,
            auditLogs: [
              {
                id: `log_${Date.now()}`,
                entityType: "DISPUTE",
                entityId: disputeId,
                action: `DISPUTE_${status}`,
                performedBy: state.currentUser.name,
                performedByRole: "ADMIN",
                details: `Dispute #${disputeId} marked as ${status}. ${adminNotes} ${extraPayout > 0 ? `(Payout adjustment +₹${extraPayout})` : ""}`,
                timestamp,
              },
              ...state.auditLogs,
            ],
            notifications: [
              {
                id: `notif_${Date.now()}`,
                userId: dispute.userId,
                role: "CUSTOMER",
                title: `Dispute ${status}`,
                message: `Your dispute for #${dispute.listingId} has been resolved. Note: ${adminNotes}`,
                type: status === "RESOLVED" ? "SUCCESS" : "ALERT",
                read: false,
                link: `/listings/${dispute.listingId}`,
                createdAt: timestamp,
              },
              ...state.notifications,
            ],
          }
        })
      },

      addAuditLog: (log) =>
        set((state) => ({
          auditLogs: [
            {
              ...log,
              id: `log_${Date.now()}`,
              timestamp: new Date().toISOString(),
            },
            ...state.auditLogs,
          ],
        })),

      updatePricingRules: (categoryPrices, materialMultipliers) => {
        set((state) => ({
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              entityType: "PRICING",
              entityId: "PRICING_ENGINE",
              action: "PRICING_CONFIG_UPDATED",
              performedBy: "Priya Nair (System Ops)",
              performedByRole: "ADMIN",
              details: `Updated ${Object.keys(categoryPrices).length} category prices & ${Object.keys(materialMultipliers).length} multipliers`,
              timestamp: new Date().toISOString(),
            },
            ...state.auditLogs,
          ],
        }))
      },

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: `notif_${Date.now()}`,
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),
    }),
    {
      name: "recyclo-storage-v4",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const pState = (persistedState as typeof currentState) || {}
        return {
          ...currentState,
          ...pState,
          products: SEED_PRODUCTS,
        }
      },
    }
  )
)
