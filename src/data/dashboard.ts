export type TrendType = "success" | "danger" | "neutral";
export type QueueStatus = "green" | "yellow";

export interface ExpirationRow {
  name: string;
  detail: string;
  batch: string;
  date: string;
  urgent: boolean;
  units: string;
  action: string;
}

export interface InventoryItem {
  name: string;
  qty: string;
  trend: string;
  trendType: TrendType;
  icon: string;
  critical: boolean;
}

export interface QueueEntry {
  name: string;
  time: string;
  status: QueueStatus;
}

export interface QuickAction {
  icon: string;
  label: string;
}

export interface NavItem {
  icon: string;
  label: string;
  path: string;
}

export const expirations: ExpirationRow[] = [
  {
    name: "Amoxicillin 500mg",
    detail: "Capsule • 100pk",
    batch: "#AMX-9921",
    date: "Oct 30, 2025",
    urgent: true,
    units: "42 Units",
    action: "Mark for Disposal",
  },
  {
    name: "Lisinopril 10mg",
    detail: "Tablet • 30pk",
    batch: "#LSN-8812",
    date: "Nov 12, 2025",
    urgent: false,
    units: "115 Units",
    action: "Discounted Sale",
  },
  {
    name: "Ventolin Inhaler",
    detail: "Aerosol • 100mcg",
    batch: "#VEN-0112",
    date: "Nov 15, 2025",
    urgent: false,
    units: "18 Units",
    action: "Transfer Out",
  },
];

export const inventoryItems: InventoryItem[] = [
  {
    name: "Metformin 500mg",
    qty: "1,240",
    trend: "+4%",
    trendType: "success",
    icon: "medication",
    critical: false,
  },
  {
    name: "Albuterol",
    qty: "85",
    trend: "-12%",
    trendType: "danger",
    icon: "air",
    critical: false,
  },
  {
    name: "Ibuprofen 400mg",
    qty: "12",
    trend: "CRITICAL",
    trendType: "danger",
    icon: "warning",
    critical: true,
  },
  {
    name: "Insulin Glargine",
    qty: "440",
    trend: "Stable",
    trendType: "neutral",
    icon: "vaccines",
    critical: false,
  },
];

export const patientQueue: QueueEntry[] = [
  { name: "Robert Patterson", time: "02:15 PM", status: "green" },
  { name: "Elena Gilbert", time: "02:30 PM", status: "green" },
  { name: "Marcus Wright", time: "02:45 PM", status: "yellow" },
];

export const quickActions: QuickAction[] = [
  { icon: "shopping_cart", label: "New Sale" },
  { icon: "input", label: "Stock Entry" },
  { icon: "person_add", label: "Patient Reg" },
  { icon: "receipt_long", label: "Returns" },
];

export const sidebarNavItems: NavItem[] = [
  { icon: "inventory_2",    label: "Inventory",    path: "/inventory"  },
  { icon: "receipt_long",   label: "Facturación",  path: "/invoicing"  },
  { icon: "point_of_sale",  label: "Sales",        path: "/sales"      },
  { icon: "shopping_cart",  label: "Purchases",    path: "/purchases"  },
  { icon: "group",          label: "Clientes",     path: "/customers"  },
  { icon: "analytics",      label: "Reports",      path: "#"           },
];
