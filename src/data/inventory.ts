import type { TrendType } from "./dashboard";

export type StockStatus = "healthy" | "warning" | "critical";

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  stockPct: number;
  status: StockStatus;
  expiry: string;
  batch: string;
}

export interface InventoryStat {
  label: string;
  value: string;
  trend: string;
  trendType: TrendType;
  icon: string;
  alert?: "danger" | "warning";
  iconColor?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Amoxicillin 500mg",
    category: "Antibiotics • Capsule",
    sku: "SKU-8821",
    stock: 140,
    stockPct: 75,
    status: "healthy",
    expiry: "Dec 15, 2024",
    batch: "B-2023-A88",
  },
  {
    id: "2",
    name: "Ibuprofen 200mg",
    category: "OTC • Tablet",
    sku: "SKU-1044",
    stock: 15,
    stockPct: 20,
    status: "warning",
    expiry: "Nov 20, 2023",
    batch: "B-2023-X99",
  },
  {
    id: "3",
    name: "Cetirizine 10mg",
    category: "OTC • Liquid",
    sku: "SKU-5529",
    stock: 0,
    stockPct: 5,
    status: "critical",
    expiry: "Oct 01, 2023",
    batch: "B-2023-C55",
  },
  {
    id: "4",
    name: "Vitamin C 1000mg",
    category: "Supplements • Effervescent",
    sku: "SKU-3321",
    stock: 85,
    stockPct: 90,
    status: "healthy",
    expiry: "May 10, 2025",
    batch: "B-2024-V32",
  },
  {
    id: "5",
    name: "Paracetamol 500mg",
    category: "OTC • Tablet",
    sku: "SKU-1102",
    stock: 205,
    stockPct: 60,
    status: "healthy",
    expiry: "Jul 12, 2025",
    batch: "B-2024-P11",
  },
];

export const inventoryStats: InventoryStat[] = [
  {
    label: "Total SKUs",
    value: "1,248",
    trend: "+5%",
    trendType: "success",
    icon: "category",
    iconColor: undefined,
    alert: undefined,
  },
  {
    label: "Low Stock Items",
    value: "14",
    trend: "-2%",
    trendType: "danger",
    icon: "warning",
    iconColor: "#ba1a1a",
    alert: "danger",
  },
  {
    label: "Expiring Soon",
    value: "8",
    trend: "-1%",
    trendType: "neutral",
    icon: "event_busy",
    iconColor: "#b45309",
    alert: "warning",
  },
];

export const filterCategories = [
  "All Products",
  "Antibiotics",
  "OTC",
  "Personal Care",
  "Supplements",
];

export const adjustmentReasons = [
  "Received Shipment",
  "Manual Correction",
  "Damaged Goods",
  "Expired (Return to Prov)",
];
