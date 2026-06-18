import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ajax } from "rxjs/ajax";
import { useApp } from "./AppContext";

export interface Company {
  id: number;
  ruc: string;
  razon_social: string;
  nombre_comercial?: string;
}

interface CompanyContextValue {
  companies: Company[];
  activeCompanyId: number | null;
  setActiveCompanyId: (id: number) => void;
  loading: boolean;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { token } = useApp();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    const baseUrl = import.meta.env.VITE_BACKOFFICE_BASE_URL as string;
    setLoading(true);
    const sub = ajax
      .getJSON<{ success: boolean; data: Company[] }>(`${baseUrl}/api/v1/companies`, {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      })
      .subscribe({
        next: (res) => {
          const list = res.data ?? [];
          setCompanies(list);
          if (list.length > 0 && activeCompanyId === null) {
            setActiveCompanyId(list[0].id);
          }
          setLoading(false);
        },
        error: () => setLoading(false),
      });
    return () => sub.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <CompanyContext.Provider value={{ companies, activeCompanyId, setActiveCompanyId, loading }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany debe usarse dentro de CompanyProvider");
  return ctx;
}
