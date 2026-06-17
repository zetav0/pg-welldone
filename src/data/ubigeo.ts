/**
 * Peru location data (departamento → provincia → distrito) used by the
 * cascading selects on the Settings company form.
 *
 * This is a curated subset of the official INEI ubigeo catalogue, covering the
 * most populated departamentos. Replace `UBIGEO` with the full dataset if every
 * departamento/provincia/distrito is required — the helpers below stay the same.
 */

export interface UbigeoProvincia {
  name: string;
  distritos: string[];
}

export interface UbigeoDepartamento {
  name: string;
  provincias: UbigeoProvincia[];
}

export const UBIGEO: UbigeoDepartamento[] = [
  {
    name: "Lima",
    provincias: [
      {
        name: "Lima",
        distritos: [
          "Lima",
          "Ancón",
          "Ate",
          "Barranco",
          "Breña",
          "Carabayllo",
          "Chaclacayo",
          "Chorrillos",
          "Cieneguilla",
          "Comas",
          "El Agustino",
          "Independencia",
          "Jesús María",
          "La Molina",
          "La Victoria",
          "Lince",
          "Los Olivos",
          "Lurigancho",
          "Lurín",
          "Magdalena del Mar",
          "Miraflores",
          "Pachacámac",
          "Pucusana",
          "Pueblo Libre",
          "Puente Piedra",
          "Punta Hermosa",
          "Punta Negra",
          "Rímac",
          "San Bartolo",
          "San Borja",
          "San Isidro",
          "San Juan de Lurigancho",
          "San Juan de Miraflores",
          "San Luis",
          "San Martín de Porres",
          "San Miguel",
          "Santa Anita",
          "Santa María del Mar",
          "Santa Rosa",
          "Santiago de Surco",
          "Surquillo",
          "Villa El Salvador",
          "Villa María del Triunfo",
        ],
      },
      {
        name: "Barranca",
        distritos: ["Barranca", "Paramonga", "Pativilca", "Supe", "Supe Puerto"],
      },
      {
        name: "Cañete",
        distritos: ["San Vicente de Cañete", "Imperial", "Mala", "Nuevo Imperial", "San Luis"],
      },
      {
        name: "Huaral",
        distritos: ["Huaral", "Chancay", "Aucallama", "Sumbilca"],
      },
      {
        name: "Huarochirí",
        distritos: ["Matucana", "San Mateo", "Santa Eulalia", "Ricardo Palma"],
      },
    ],
  },
  {
    name: "Callao",
    provincias: [
      {
        name: "Callao",
        distritos: [
          "Callao",
          "Bellavista",
          "Carmen de la Legua Reynoso",
          "La Perla",
          "La Punta",
          "Mi Perú",
          "Ventanilla",
        ],
      },
    ],
  },
  {
    name: "Arequipa",
    provincias: [
      {
        name: "Arequipa",
        distritos: [
          "Arequipa",
          "Cayma",
          "Cerro Colorado",
          "Yanahuara",
          "Miraflores",
          "Mariano Melgar",
          "Paucarpata",
          "José Luis Bustamante y Rivero",
          "Sachaca",
          "Socabaya",
          "Alto Selva Alegre",
          "Hunter",
        ],
      },
      {
        name: "Camaná",
        distritos: ["Camaná", "José María Quimper", "Mariano Nicolás Valcárcel", "Samuel Pastor"],
      },
      {
        name: "Islay",
        distritos: ["Mollendo", "Cocachacra", "Mejía", "Punta de Bombón"],
      },
    ],
  },
  {
    name: "Cusco",
    provincias: [
      {
        name: "Cusco",
        distritos: [
          "Cusco",
          "Wanchaq",
          "San Sebastián",
          "San Jerónimo",
          "Santiago",
          "Saylla",
          "Poroy",
          "Ccorca",
        ],
      },
      {
        name: "La Convención",
        distritos: ["Santa Ana", "Echarati", "Maranura", "Quellouno"],
      },
      {
        name: "Urubamba",
        distritos: ["Urubamba", "Ollantaytambo", "Machupicchu", "Yucay", "Maras"],
      },
    ],
  },
  {
    name: "La Libertad",
    provincias: [
      {
        name: "Trujillo",
        distritos: [
          "Trujillo",
          "Víctor Larco Herrera",
          "La Esperanza",
          "El Porvenir",
          "Florencia de Mora",
          "Huanchaco",
          "Laredo",
          "Moche",
          "Salaverry",
        ],
      },
      {
        name: "Ascope",
        distritos: ["Ascope", "Chicama", "Chocope", "Paiján", "Casa Grande"],
      },
      {
        name: "Pacasmayo",
        distritos: ["San Pedro de Lloc", "Guadalupe", "Jequetepeque", "Pacasmayo"],
      },
    ],
  },
  {
    name: "Piura",
    provincias: [
      {
        name: "Piura",
        distritos: [
          "Piura",
          "Castilla",
          "Catacaos",
          "Veintiséis de Octubre",
          "Cura Mori",
          "La Arena",
        ],
      },
      {
        name: "Sullana",
        distritos: ["Sullana", "Bellavista", "Marcavelica", "Querecotillo"],
      },
      {
        name: "Talara",
        distritos: ["Pariñas", "La Brea", "Lobitos", "Los Órganos", "Máncora"],
      },
    ],
  },
  {
    name: "Lambayeque",
    provincias: [
      {
        name: "Chiclayo",
        distritos: [
          "Chiclayo",
          "José Leonardo Ortiz",
          "La Victoria",
          "Pimentel",
          "Monsefú",
          "Reque",
        ],
      },
      {
        name: "Lambayeque",
        distritos: ["Lambayeque", "Mochumí", "Mórrope", "Olmos", "Motupe"],
      },
      {
        name: "Ferreñafe",
        distritos: ["Ferreñafe", "Pueblo Nuevo", "Pítipo", "Manuel Antonio Mesones Muro"],
      },
    ],
  },
  {
    name: "Junín",
    provincias: [
      {
        name: "Huancayo",
        distritos: ["Huancayo", "El Tambo", "Chilca", "Pilcomayo", "San Agustín", "Sapallanga"],
      },
      {
        name: "Concepción",
        distritos: ["Concepción", "Matahuasi", "Orcotuna", "Santa Rosa de Ocopa"],
      },
      {
        name: "Tarma",
        distritos: ["Tarma", "Acobamba", "Palca", "La Unión", "Huasahuasi"],
      },
    ],
  },
  {
    name: "Áncash",
    provincias: [
      {
        name: "Huaraz",
        distritos: ["Huaraz", "Independencia", "Jangas", "Tarica"],
      },
      {
        name: "Santa",
        distritos: ["Chimbote", "Nuevo Chimbote", "Coishco", "Santa", "Samanco"],
      },
      {
        name: "Huari",
        distritos: ["Huari", "San Marcos", "Chavín de Huántar"],
      },
    ],
  },
  {
    name: "Ica",
    provincias: [
      {
        name: "Ica",
        distritos: ["Ica", "La Tinguiña", "Parcona", "Subtanjalla", "Los Aquijes", "Salas"],
      },
      {
        name: "Chincha",
        distritos: ["Chincha Alta", "Pueblo Nuevo", "Grocio Prado", "Sunampe", "Tambo de Mora"],
      },
      {
        name: "Pisco",
        distritos: ["Pisco", "San Andrés", "Túpac Amaru Inca", "Paracas", "San Clemente"],
      },
      {
        name: "Nasca",
        distritos: ["Nasca", "Vista Alegre", "Marcona", "Changuillo"],
      },
    ],
  },
  {
    name: "Puno",
    provincias: [
      {
        name: "Puno",
        distritos: ["Puno", "Acora", "Chucuito", "Paucarcolla", "Platería"],
      },
      {
        name: "San Román",
        distritos: ["Juliaca", "Cabana", "Cabanillas", "Caracoto"],
      },
      {
        name: "Azángaro",
        distritos: ["Azángaro", "Asillo", "San Antón", "Santiago de Pupuja"],
      },
    ],
  },
  {
    name: "Tacna",
    provincias: [
      {
        name: "Tacna",
        distritos: [
          "Tacna",
          "Alto de la Alianza",
          "Ciudad Nueva",
          "Pocollay",
          "Coronel Gregorio Albarracín Lanchipa",
          "Calana",
        ],
      },
      {
        name: "Tarata",
        distritos: ["Tarata", "Héroes Albarracín", "Ticaco", "Sitajara"],
      },
    ],
  },
];

/* ── Cascading helpers ───────────────────────────────── */

export const getDepartamentos = (): string[] => UBIGEO.map((d) => d.name);

export const getProvincias = (departamento: string): string[] =>
  UBIGEO.find((d) => d.name === departamento)?.provincias.map((p) => p.name) ?? [];

export const getDistritos = (departamento: string, provincia: string): string[] =>
  UBIGEO.find((d) => d.name === departamento)
    ?.provincias.find((p) => p.name === provincia)
    ?.distritos ?? [];
