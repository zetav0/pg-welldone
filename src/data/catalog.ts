import { products } from "./inventory";

export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  unitPrice: number;
  unit: string;
}

const PRICE_MAP: Record<string, { unitPrice: number; unit: string }> = {
  "1": { unitPrice: 15.50, unit: "caja x100" },
  "2": { unitPrice:  8.00, unit: "caja x20"  },
  "3": { unitPrice: 12.00, unit: "frasco"     },
  "4": { unitPrice:  6.50, unit: "tubo x10"   },
  "5": { unitPrice:  4.20, unit: "caja x20"   },
};

export const catalogProducts: CatalogProduct[] = products.map((p) => ({
  id:        p.id,
  name:      p.name,
  sku:       p.sku,
  category:  p.category,
  stock:     p.stock,
  unitPrice: PRICE_MAP[p.id]?.unitPrice ?? 10.00,
  unit:      PRICE_MAP[p.id]?.unit      ?? "unidad",
}));
