export type Role = 'CUSTOMER' | 'AGENT' | 'ADMIN';

export type ListingStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'AWAITING_PICKUP'
  | 'PICKUP_SCHEDULED'
  | 'AGENT_ASSIGNED'
  | 'AGENT_ON_THE_WAY'
  | 'AGENT_ARRIVED'
  | 'INSPECTION_IN_PROGRESS'
  | 'INSPECTION_COMPLETED'
  | 'PICKUP_COMPLETED'
  | 'PAYMENT_PROCESSING'
  | 'PAYMENT_COMPLETED'
  | 'PROCESSING'
  | 'RECYCLED'
  | 'COMPLETED'
  | 'CANCELLED';

export type ClothingCategory =
  | 'Shirt'
  | 'T-Shirt'
  | 'Polo'
  | 'Top'
  | 'Blouse'
  | 'Kurta'
  | 'Kurti'
  | 'Sweatshirt'
  | 'Hoodie'
  | 'Sweater'
  | 'Jacket'
  | 'Coat'
  | 'Jeans'
  | 'Trousers'
  | 'Pants'
  | 'Shorts'
  | 'Track Pants'
  | 'Skirt'
  | 'Leggings'
  | 'Saree'
  | 'Lehenga'
  | 'Sherwani'
  | 'Kids Wear'
  | 'Bedsheets'
  | 'Towels'
  | 'Curtains'
  | 'Other';

export type FabricMaterial =
  | 'Cotton'
  | 'Polyester'
  | 'Denim'
  | 'Wool'
  | 'Linen'
  | 'Silk'
  | 'Rayon'
  | 'Nylon'
  | 'Acrylic'
  | 'Mixed'
  | 'Other'
  | 'Unknown';

export type ClothingCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'UNUSABLE';

export type InspectionStatus = 'ACCEPTED' | 'ADJUSTED' | 'REJECTED';

export type InspectionIssue =
  | 'Stain'
  | 'Tear'
  | 'Hole'
  | 'Fading'
  | 'Fabric damage'
  | 'Broken zipper'
  | 'Missing button'
  | 'Heavy wear'
  | 'Incorrect material'
  | 'Incorrect category'
  | 'Incorrect size'
  | 'Incorrect condition'
  | 'Contamination'
  | 'Non-recyclable material'
  | 'Other';

export type ProcessingOutcome =
  | 'DIRECT_REUSE'
  | 'REPAIR'
  | 'UPCYCLING'
  | 'MATERIAL_RECYCLING'
  | 'TEXTILE_RECOVERY'
  | 'UNPROCESSED';

export interface ClothingItem {
  id: string;
  listingId: string;
  category: ClothingCategory;
  subcategory?: string;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  size: string;
  brand?: string;
  color: string;
  material: FabricMaterial;
  condition: ClothingCondition;
  weightKg: number;
  description?: string;
  userImages: string[];
  initialEstimatedValue: number;
  
  // Inspection Fields
  inspectionResult?: InspectionStatus;
  reportedIssues?: InspectionIssue[];
  issueSeverity?: 'Minor' | 'Moderate' | 'Severe';
  inspectionNotes?: string;
  inspectionImages?: string[];
  systemRecalculatedValue?: number;
  agentFinalValue?: number;
  rejectionReason?: string;
  processingOutcome?: ProcessingOutcome;
}

export interface PickupAddress {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface RecyclingListing {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: ClothingItem[];
  initialEstimatedTotal: number;
  systemRecalculatedTotal?: number;
  finalPayoutTotal?: number;
  pickupAddress: PickupAddress;
  pickupDate: string;
  pickupTimeSlot: string;
  pickupInstructions?: string;
  status: ListingStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  createdAt: string;
  updatedAt: string;
  inspectionCompletedAt?: string;
  paymentCompletedAt?: string;
  batchId?: string;
  paymentMethod?: 'UPI' | 'BANK_TRANSFER' | 'WALLET';
  paymentReference?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl: string;
  addresses: PickupAddress[];
  payoutUpiId?: string;
  payoutBankInfo?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  totalEarnings: number;
  totalKgRecycled: number;
  totalItemsRecycled: number;
  totalListingsCount: number;
  password?: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  city: string;
  activeStatus: 'AVAILABLE' | 'ON_JOB' | 'OFFLINE';
  rating: number;
  completedPickupsCount: number;
  assignedListingsCount: number;
}

export interface PricingRule {
  id: string;
  category: ClothingCategory;
  basePrice: number;
  materialMultipliers: Record<FabricMaterial, number>;
  conditionMultipliers: Record<ClothingCondition, number>;
  weightMultiplierPerKg: number;
  isActive: boolean;
}

export interface ProcessingBatch {
  id: string;
  batchCode: string;
  name: string;
  materialType: FabricMaterial;
  sourceListingIds: string[];
  sourceItemIds: string[];
  totalItemsCount: number;
  totalWeightKg: number;
  status: 'COLLECTED' | 'SORTING' | 'CLEANING' | 'PROCESSING' | 'COMPLETED';
  resultingOutput: string;
  createdProductsCount: number;
  createdAt: string;
  completedAt?: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  subcategory: string;
  gender?: 'Men' | 'Women' | 'Unisex';
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';
  brand?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  material: FabricMaterial;
  recycledContentPercentage: number;
  dimensions?: string;
  weightKg: number;
  color: string;
  images: string[];
  sku: string;
  batchId?: string;
  traceabilityStory: {
    originText: string;
    textileWeightRecoveredKg: number;
    co2SavedKg: number;
    waterSavedLiters: number;
    sourceBatchCode?: string;
  };
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  deliveryAddress: PickupAddress;
  paymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  title: string;
  description: string;
  relatedListingId?: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  createdAt: string;
}

export interface Dispute {
  id: string;
  listingId: string;
  itemId?: string;
  userId: string;
  userName: string;
  issueType: 'INSPECTION_RESULT' | 'PRICE_REDUCTION' | 'ITEM_REJECTION' | 'MISSING_ITEM' | 'PICKUP_ISSUE' | 'PAYMENT_ISSUE';
  explanation: string;
  userImages?: string[];
  status: 'OPEN' | 'UNDER_REVIEW' | 'MORE_INFO_REQUIRED' | 'RESOLVED' | 'REJECTED';
  adminNotes?: string;
  resolutionPayoutAdjust?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  entityType: 'LISTING' | 'ITEM' | 'PRICING' | 'PAYMENT' | 'BATCH' | 'DISPUTE';
  entityId: string;
  action: string;
  performedBy: string;
  performedByRole: Role;
  details: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  role: Role | 'ALL';
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  link?: string;
  createdAt: string;
}
