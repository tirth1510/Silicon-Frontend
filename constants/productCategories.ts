/* ---------- PRODUCT CATEGORY DEFINITIONS ---------- */

export interface ProductCategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  displayOrder: number;
}

export const PRODUCT_CATEGORIES: Record<string, ProductCategoryInfo> = {
  "0": {
    id: "0",
    name: "Operation Theater Equipment",
    slug: "operation-theater-equipment",
    description: "Essential equipment for operation theaters including surgical lights and monitoring systems",
    icon: "🏥",
    displayOrder: 0,
  },
  "1": {
    id: "1",
    name: "Surgical & Emergency Equipment",
    slug: "surgical-emergency-equipment",
    description: "Emergency and surgical care equipment including defibrillators and suction machines",
    icon: "⚕️",
    displayOrder: 1,
  },
  "2": {
    id: "2",
    name: "Maternal & Fetal Care",
    slug: "maternal-fetal-care",
    description: "Specialized equipment for maternal and fetal monitoring",
    icon: "👶",
    displayOrder: 2,
  },
  "3": {
    id: "3",
    name: "Respiratory Care Equipment",
    slug: "respiratory-care-equipment",
    description: "Complete respiratory support systems including ventilators, CPAP, and oxygen concentrators",
    icon: "🫁",
    displayOrder: 3,
  },
  "4": {
    id: "4",
    name: "Patient Monitoring Systems",
    slug: "patient-monitoring-systems",
    description: "Advanced patient monitoring solutions for ICU and general ward use",
    icon: "📊",
    displayOrder: 4,
  },
  "5": {
    id: "5",
    name: "Diagnostic Equipment",
    slug: "diagnostic-equipment",
    description: "ECG machines, Holter systems, and other diagnostic tools",
    icon: "🔬",
    displayOrder: 5,
  },
  "6": {
    id: "6",
    name: "Pulse Oximetry",
    slug: "pulse-oximetry",
    description: "Range of pulse oximeters from fingertip to tabletop models",
    icon: "💓",
    displayOrder: 6,
  },
  "7": {
    id: "7",
    name: "Infusion Systems",
    slug: "infusion-systems",
    description: "Precision infusion pumps and related equipment",
    icon: "💉",
    displayOrder: 7,
  },
};

/* ---------- PRODUCT-CATEGORY MAPPING ---------- */

export const PRODUCT_TO_CATEGORY_MAP: Record<string, string> = {
  // LED OT LIGHT
  "694ea7978a62600a878d0b13": "0",
  
  // SUCTION MACHINE
  "694ea7978a62600a878d0b17": "1",
  
  // BIPHASIC DEFIBRILLATOR
  "694ea7978a62600a878d0b20": "1",
  
  // AED
  "694ea7978a62600a878d0b26": "1",
  
  // FETAL MONITOR
  "694ea7978a62600a878d0b1a": "2",
  
  // OXYGEN CONCENTRATOR
  "694ea7978a62600a878d0b1d": "3",
  
  // C-PAP MACHINE
  "694ea7978a62600a878d0b23": "3",
  
  // BIP-PAP MACHINE
  "694ea7978a62600a878d0b28": "3",
  
  // TRANSPORT VENTILATOR
  "694ea7978a62600a878d0b2b": "3",
  
  // VENTILATOR
  "694ea7978a62600a878d0b2d": "3",
  
  // HIGH RANGE MULTIPARA PATIENT MONITOR
  "694ea7978a62600a878d0b3b": "4",
  
  // MULTIPARA PATIENT MONITOR - 12.1" SCREEN
  "694ea7978a62600a878d0b3d": "4",
  
  // MULTIPARA PATIENT MONITOR - 8" SCREEN
  "694ea7978a62600a878d0b43": "4",
  
  // AMBULATORY BLOOD PRESSURE MONITOR
  "694ea7978a62600a878d0b30": "4",
  
  // HOLTER ECG SYSTEM
  "694ea7978a62600a878d0b32": "5",
  
  // ECG MACHINE
  "694ea7978a62600a878d0b37": "5",
  
  // TABLE TOP PULSE OXIMETER
  "694ea7978a62600a878d0b46": "6",
  
  // PULSE OXIMETER WITH NIBP
  "694ea7978a62600a878d0b48": "6",
  
  // HAND HELD PULSE OXIMETER
  "694ea7978a62600a878d0b4a": "6",
  
  // FINGERTIP PULSE OXIMETER
  "694ea7978a62600a878d0b4e": "6",
  
  // INFUSION PUMP
  "694ea7978a62600a878d0b35": "7",
};

/* ---------- HELPER FUNCTIONS ---------- */

/**
 * Get category info by ID
 */
export const getCategoryInfo = (categoryId: string): ProductCategoryInfo | undefined => {
  return PRODUCT_CATEGORIES[categoryId];
};

/**
 * Get category for a product
 */
export const getProductCategory = (productId: string): ProductCategoryInfo | undefined => {
  const categoryId = PRODUCT_TO_CATEGORY_MAP[productId];
  return categoryId ? PRODUCT_CATEGORIES[categoryId] : undefined;
};

/**
 * Get all categories as array
 */
export const getAllCategories = (): ProductCategoryInfo[] => {
  return Object.values(PRODUCT_CATEGORIES).sort((a, b) => a.displayOrder - b.displayOrder);
};

/**
 * Get category name by ID
 */
export const getCategoryName = (categoryId: string): string => {
  return PRODUCT_CATEGORIES[categoryId]?.name || "Unknown Category";
};

/* ---------- TYPE EXPORTS ---------- */

export type ProductCategoryId = keyof typeof PRODUCT_CATEGORIES;

