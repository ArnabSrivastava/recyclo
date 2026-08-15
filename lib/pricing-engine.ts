import { ClothingCategory, FabricMaterial, ClothingCondition, InspectionIssue } from './types';

export interface CategoryBaseRate {
  category: ClothingCategory;
  basePrice: number;
}

export const CATEGORY_BASE_PRICES: Record<ClothingCategory, number> = {
  Kurta: 180,
  Kurti: 160,
  Saree: 240,
  Lehenga: 320,
  Sherwani: 350,
  Jacket: 220,
  Coat: 250,
  Jeans: 160,
  Sweater: 180,
  Sweatshirt: 150,
  Hoodie: 160,
  Shirt: 140,
  Polo: 120,
  'T-Shirt': 90,
  Top: 110,
  Blouse: 120,
  Trousers: 140,
  Pants: 140,
  Shorts: 80,
  'Track Pants': 110,
  Skirt: 130,
  Leggings: 70,
  'Kids Wear': 80,
  Bedsheets: 150,
  Towels: 60,
  Curtains: 140,
  Other: 70,
};

export const MATERIAL_MULTIPLIERS: Record<FabricMaterial, number> = {
  Silk: 1.35,
  Wool: 1.25,
  Denim: 1.2,
  Linen: 1.15,
  Cotton: 1.1,
  Rayon: 1.0,
  Polyester: 0.9,
  Nylon: 0.9,
  Acrylic: 0.85,
  Mixed: 0.8,
  Other: 0.75,
  Unknown: 0.7,
};

export const CONDITION_MULTIPLIERS: Record<ClothingCondition, number> = {
  EXCELLENT: 1.25,
  GOOD: 1.0,
  FAIR: 0.7,
  POOR: 0.4,
  UNUSABLE: 0.1,
};

export const ISSUE_DEDUCTION_PERCENTAGES: Record<InspectionIssue, number> = {
  Stain: 0.2,
  Tear: 0.25,
  Hole: 0.25,
  Fading: 0.15,
  'Fabric damage': 0.3,
  'Broken zipper': 0.15,
  'Missing button': 0.1,
  'Heavy wear': 0.35,
  'Incorrect material': 0.1,
  'Incorrect category': 0.05,
  'Incorrect size': 0.0,
  'Incorrect condition': 0.2,
  Contamination: 0.5,
  'Non-recyclable material': 0.8,
  Other: 0.15,
};

export interface PriceCalculationResult {
  basePrice: number;
  materialMultiplier: number;
  conditionMultiplier: number;
  weightBonus: number;
  estimatedValue: number;
  explanation: string[];
}

export function calculateEstimatedItemValue(
  category: ClothingCategory,
  material: FabricMaterial,
  condition: ClothingCondition,
  weightKg: number = 0.3
): PriceCalculationResult {
  const base = CATEGORY_BASE_PRICES[category] || 100;
  const matMult = MATERIAL_MULTIPLIERS[material] || 1.0;
  const condMult = CONDITION_MULTIPLIERS[condition] || 1.0;
  const weightBonus = Math.max(0, Math.round((weightKg - 0.2) * 40));

  const rawValue = base * matMult * condMult + weightBonus;
  const finalEstimate = Math.max(10, Math.round(rawValue / 5) * 5);

  const explanation = [
    `Category Base (${category}): ₹${base}`,
    `Material Factor (${material}): ${matMult}x`,
    `Condition Rating (${condition}): ${condMult}x`,
    weightBonus > 0 ? `Weight Factor (${weightKg}kg): +₹${weightBonus}` : `Standard Weight Factor`,
  ];

  return {
    basePrice: base,
    materialMultiplier: matMult,
    conditionMultiplier: condMult,
    weightBonus,
    estimatedValue: finalEstimate,
    explanation,
  };
}

export function recalculateItemInspectionValue(
  initialEstimate: number,
  category: ClothingCategory,
  material: FabricMaterial,
  inspectionCondition: ClothingCondition,
  reportedIssues: InspectionIssue[] = [],
  issueSeverity: 'Minor' | 'Moderate' | 'Severe' = 'Minor',
  isAdminOverride: boolean = false
): { systemRecalculated: number; totalDeductionPercent: number; explanation: string } {
  const baseRecalc = calculateEstimatedItemValue(category, material, inspectionCondition);
  let value = baseRecalc.estimatedValue;

  let totalDeduction = 0;
  for (const issue of reportedIssues) {
    const rate = ISSUE_DEDUCTION_PERCENTAGES[issue] || 0.15;
    totalDeduction += rate;
  }

  const severityFactor = issueSeverity === 'Severe' ? 1.5 : issueSeverity === 'Moderate' ? 1.2 : 1.0;
  const netDeduction = Math.min(0.9, totalDeduction * severityFactor);

  if (netDeduction > 0) {
    value = Math.round((value * (1 - netDeduction)) / 5) * 5;
  }

  let finalValue = value;
  if (!isAdminOverride && finalValue > initialEstimate) {
    finalValue = initialEstimate;
  }

  return {
    systemRecalculated: finalValue,
    totalDeductionPercent: Math.round(netDeduction * 100),
    explanation:
      reportedIssues.length > 0
        ? `Adjusted due to ${reportedIssues.join(', ')} (${issueSeverity} severity). -${Math.round(netDeduction * 100)}% adjustment.`
        : `Adjusted based on physical condition inspection (${inspectionCondition}).`,
  };
}

export function calculateEnvironmentalImpact(itemsCount: number, weightKg: number) {
  const co2SavedKg = Math.round(weightKg * 14.5 * 10) / 10;
  const waterSavedLiters = Math.round(weightKg * 2700);
  const wasteDivertedKg = Math.round(weightKg * 10) / 10;

  return {
    itemsCount,
    weightKg: Math.round(weightKg * 10) / 10,
    co2SavedKg,
    waterSavedLiters,
    wasteDivertedKg,
  };
}
