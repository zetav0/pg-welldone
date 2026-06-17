export type ClientSegment = "vip" | "recurrente" | "nuevo";
export type ClientStatus  = "al_dia" | "con_deuda";
export type ClientType    = "empresa" | "persona";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  rucDni: string;
  type: ClientType;
  segment: ClientSegment;
  status: ClientStatus;
  lastPurchase: string;
  totalDebt: number;
  address: string;
}

export const clients: Client[] = [
  { id: "1",  name: "Inversiones La Luna S.A.C",        email: "ventas@laluna.pe",          phone: "01-4521890", rucDni: "20601293847", type: "empresa",  segment: "vip",        status: "al_dia",    lastPurchase: "12 May 2024", totalDebt: 0,      address: "Av. Javier Prado 1234, San Isidro, Lima" },
  { id: "2",  name: "Tecnologías del Pacífico E.I.R.L", email: "admin@tecpacifico.com",      phone: "01-3389201", rucDni: "20554839201", type: "empresa",  segment: "recurrente", status: "con_deuda", lastPurchase: "08 May 2024", totalDebt: 4800,   address: "Jr. Lampa 543, Cercado de Lima, Lima" },
  { id: "3",  name: "Alejandro Mendoza Quispe",          email: "amendoza@gmail.com",         phone: "987654321",  rucDni: "10459382041", type: "persona",  segment: "nuevo",      status: "al_dia",    lastPurchase: "02 May 2024", totalDebt: 0,      address: "Calle Los Álamos 210, Miraflores, Lima" },
  { id: "4",  name: "Construcciones del Sur S.A.",       email: "logistica@consur.com.pe",    phone: "01-6123890", rucDni: "20104859302", type: "empresa",  segment: "vip",        status: "con_deuda", lastPurchase: "28 Apr 2024", totalDebt: 12500,  address: "Av. Industrial 789, Ate, Lima" },
  { id: "5",  name: "Gastronomía Moderna S.R.L.",        email: "contacto@gastromod.pe",      phone: "01-4459203", rucDni: "20495827301", type: "empresa",  segment: "recurrente", status: "al_dia",    lastPurchase: "25 Apr 2024", totalDebt: 0,      address: "Av. Larco 891, Miraflores, Lima" },
  { id: "6",  name: "Carmen Rosa Villanueva Torres",     email: "cvillanueva@outlook.com",    phone: "964321789",  rucDni: "10328194720", type: "persona",  segment: "recurrente", status: "al_dia",    lastPurchase: "20 Apr 2024", totalDebt: 0,      address: "Jr. Arequipa 456, San Miguel, Lima" },
  { id: "7",  name: "Distribuidora Norte S.A.C.",        email: "ventas@distnorte.com",       phone: "044-512890", rucDni: "20601928374", type: "empresa",  segment: "vip",        status: "al_dia",    lastPurchase: "18 Apr 2024", totalDebt: 0,      address: "Av. España 1023, Trujillo" },
  { id: "8",  name: "Farmacia Salud Total E.I.R.L.",    email: "info@saludtotal.pe",          phone: "01-2748391", rucDni: "20503928471", type: "empresa",  segment: "recurrente", status: "con_deuda", lastPurchase: "15 Apr 2024", totalDebt: 2200,   address: "Av. Brasil 2340, Breña, Lima" },
  { id: "9",  name: "Jorge Luis Paredes Huanca",         email: "jparedes@hotmail.com",       phone: "972811234",  rucDni: "10719283041", type: "persona",  segment: "nuevo",      status: "al_dia",    lastPurchase: "12 Apr 2024", totalDebt: 0,      address: "Calle Unión 87, Surquillo, Lima" },
  { id: "10", name: "Importaciones Andinas S.A.",        email: "compras@impandinas.com",     phone: "01-7192830", rucDni: "20102938471", type: "empresa",  segment: "vip",        status: "al_dia",    lastPurchase: "10 Apr 2024", totalDebt: 0,      address: "Av. Argentina 3456, Callao" },
  { id: "11", name: "María Eugenia Soto Ríos",           email: "mesoto@yahoo.es",            phone: "954789123",  rucDni: "10293847102", type: "persona",  segment: "nuevo",      status: "al_dia",    lastPurchase: "08 Apr 2024", totalDebt: 0,      address: "Urb. Los Ficus 34, San Borja, Lima" },
  { id: "12", name: "Soluciones Empresariales Perú SAC", email: "sistemas@soleperu.com",      phone: "01-5839201", rucDni: "20598374102", type: "empresa",  segment: "recurrente", status: "con_deuda", lastPurchase: "05 Apr 2024", totalDebt: 7800,   address: "Av. Paseo de la República 5678, Surco, Lima" },
  { id: "13", name: "Clínica San Rafael S.A.C.",         email: "admision@clinicasanrafael.pe", phone: "01-3948201", rucDni: "20487291038", type: "empresa", segment: "vip",       status: "al_dia",    lastPurchase: "02 Apr 2024", totalDebt: 0,      address: "Av. El Sol 234, La Molina, Lima" },
  { id: "14", name: "Roberto Carlos Apaza Mamani",       email: "rapaza.ing@gmail.com",       phone: "987001234",  rucDni: "10483920174", type: "persona",  segment: "nuevo",      status: "al_dia",    lastPurchase: "30 Mar 2024", totalDebt: 0,      address: "Jr. Puno 789, San Martín de Porres, Lima" },
  { id: "15", name: "Corporación Buen Vivir S.A.",       email: "gerencia@buenvivir.pe",      phone: "01-4829310", rucDni: "20601029384", type: "empresa",  segment: "vip",        status: "con_deuda", lastPurchase: "28 Mar 2024", totalDebt: 15200,  address: "Calle Las Flores 456, San Isidro, Lima" },
  { id: "16", name: "Agro Exportaciones Lima S.R.L.",    email: "exportaciones@agrolima.com", phone: "01-6572910", rucDni: "20391028475", type: "empresa",  segment: "recurrente", status: "al_dia",    lastPurchase: "25 Mar 2024", totalDebt: 0,      address: "Av. Óscar Benavides 1890, Magdalena, Lima" },
  { id: "17", name: "Luciana Beatriz Flores Paredes",    email: "lflores.b@gmail.com",        phone: "942378901",  rucDni: "10293847561", type: "persona",  segment: "recurrente", status: "al_dia",    lastPurchase: "22 Mar 2024", totalDebt: 0,      address: "Calle Bolognesi 123, Barranco, Lima" },
  { id: "18", name: "Tech Innovations Group S.A.C.",     email: "hello@tig.pe",               phone: "01-2019384", rucDni: "20610293847", type: "empresa",  segment: "nuevo",      status: "al_dia",    lastPurchase: "18 Mar 2024", totalDebt: 0,      address: "Av. Javier Prado Oeste 567, San Isidro, Lima" },
  { id: "19", name: "Transportes Veloz S.A.C.",          email: "ops@transveloz.com.pe",      phone: "044-893201", rucDni: "20401928374", type: "empresa",  segment: "recurrente", status: "con_deuda", lastPurchase: "15 Mar 2024", totalDebt: 3400,   address: "Parque Industrial Los Cedros 789, Trujillo" },
  { id: "20", name: "Ana Sofía Gutiérrez Vega",          email: "asgutierrez@icloud.com",     phone: "998123456",  rucDni: "10839201745", type: "persona",  segment: "nuevo",      status: "al_dia",    lastPurchase: "10 Mar 2024", totalDebt: 0,      address: "Av. Comandante Espinar 890, Miraflores, Lima" },
];

export const customerKpis = {
  totalActive: 1284,
  totalDebt:   42500,
  debtorCount: 24,
  vipCount:    156,
  compliance:  99.8,
};
