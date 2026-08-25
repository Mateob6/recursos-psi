export type ResourceCategory =
  | "psicosocial"
  | "salud"
  | "atencion_primaria"
  | "capacitacion"
  | "interactivas"
  | "albergues"
  | "acopio"
  | "funerarios"
  | "lineas_emergencia";

export type Section =
  | "apoyo-emocional"
  | "salud"
  | "refugio"
  | "donaciones"
  | "guias"
  | "funerarios";

export interface ContactInfo {
  phones?: string[];
  whatsapp?: string[];
  emails?: string[];
  urls?: string[];
  instagram?: string[];
  raw: string;
}

export interface ResourceTags {
  urgencia?: "ahora" | "agendar";
  canales?: string[];
  cobertura?: string;
  poblacion?: string[];
  tipo?: string;
  estado?: string;
  audiencia?: string;
  formato?: string;
}

export interface Resource {
  id: string;
  category: ResourceCategory;
  section?: Section;
  tags?: ResourceTags;
  subcategory?: string;
  name: string;
  center?: string;
  description?: string;
  modality?: string;
  department?: string;
  city?: string;
  address?: string;
  contact?: ContactInfo;
  cost?: string;
  condition?: string;
  serviceType?: string;
  targetPopulation?: string;
  source?: string;
  recommendation?: string;
  status?: string;
  requirements?: string;
  phone?: string;
  email?: string;
  url?: string;
  userNote?: string;
  coordinates?: { lat: number; lng: number };
}

export interface SectionMeta {
  key: Section;
  label: string;
  question: string;
  icon: string;
  color: string;
  description: string;
  count?: number;
  highlight?: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    key: "apoyo-emocional",
    label: "Apoyo Emocional",
    question: "Necesito hablar con alguien",
    icon: "/assets/icon-salud-mental.svg",
    color: "#532888",
    description: "Atención psicológica, acompañamiento emocional, primeros auxilios psicológicos y líneas de emergencia",
    highlight: "Línea 106 disponible 24/7",
  },
  {
    key: "salud",
    label: "Salud",
    question: "Necesito atención médica",
    icon: "/assets/icon-corazon.svg",
    color: "#C20E1A",
    description: "Consulta tu EPS, encuentra urgencias, puntos de atención cercanos y regímenes especiales",
    highlight: "Marca 123 para emergencias médicas",
  },
  {
    key: "refugio",
    label: "Refugio",
    question: "Necesito un lugar donde quedarme",
    icon: "/assets/icon-construccion.svg",
    color: "#AA087C",
    description: "Albergues oficiales habilitados por la Alcaldía y refugios comunitarios en Cali",
  },
  {
    key: "donaciones",
    label: "Donaciones",
    question: "Quiero donar o recibir ayuda material",
    icon: "/assets/icon-donacion.svg",
    color: "#DC9122",
    description: "Puntos de acopio activos en Cali para recibir y entregar donaciones",
  },
  {
    key: "guias",
    label: "Guías y Recursos",
    question: "Quiero aprender a ayudar",
    icon: "/assets/icon-manos.svg",
    color: "#2D5AA2",
    description: "Manuales, guías prácticas y plataformas para profesionales, comunidades y personas afectadas",
  },
  {
    key: "funerarios",
    label: "Servicios Funerarios",
    question: "Necesito servicios funerarios",
    icon: "/assets/icon-familia.svg",
    color: "#599876",
    description: "Servicios funerarios solidarios para víctimas del terremoto",
  },
];

export interface FilterDimension {
  key: string;
  label: string;
  options: { value: string; label: string; icon?: string }[];
}

export const SECTION_FILTERS: Record<Section, FilterDimension[]> = {
  "apoyo-emocional": [
    {
      key: "urgencia",
      label: "¿Cuándo?",
      options: [
        { value: "ahora", label: "Ahora mismo", icon: "🚨" },
        { value: "agendar", label: "Agendar cita", icon: "📅" },
      ],
    },
    {
      key: "canales",
      label: "¿Cómo?",
      options: [
        { value: "whatsapp", label: "WhatsApp", icon: "💬" },
        { value: "telefono", label: "Teléfono", icon: "📞" },
        { value: "correo", label: "Correo", icon: "✉️" },
        { value: "formulario", label: "Formulario", icon: "📝" },
        { value: "presencial", label: "Presencial", icon: "📍" },
      ],
    },
    {
      key: "cobertura",
      label: "¿Dónde?",
      options: [
        { value: "nacional", label: "Nacional", icon: "🇨🇴" },
        { value: "cali", label: "Cali", icon: "📍" },
        { value: "otra", label: "Otra ciudad", icon: "🏙️" },
      ],
    },
    {
      key: "poblacion",
      label: "¿Para quién?",
      options: [
        { value: "todos", label: "Todos", icon: "👥" },
        { value: "lgbtiq", label: "LGBTIQ+", icon: "🏳️‍🌈" },
        { value: "mujeres", label: "Mujeres", icon: "♀️" },
        { value: "ninez", label: "Niñez", icon: "👶" },
        { value: "persona_mayor", label: "Persona mayor", icon: "🧓" },
        { value: "discapacidad", label: "Discapacidad", icon: "♿" },
        { value: "profesionales", label: "Profesionales", icon: "🩺" },
        { value: "victimas_conflicto", label: "Víctimas conflicto", icon: "🕊️" },
      ],
    },
  ],
  salud: [
    {
      key: "tipo",
      label: "Tipo",
      options: [
        { value: "eps", label: "Mi EPS", icon: "💳" },
        { value: "hospital", label: "Urgencias / Hospital", icon: "🏥" },
        { value: "punto_atencion", label: "Punto de atención", icon: "🚑" },
        { value: "regimen_especial", label: "Régimen especial", icon: "⭐" },
        { value: "informacion", label: "Información", icon: "ℹ️" },
      ],
    },
  ],
  refugio: [
    {
      key: "tipo",
      label: "Tipo",
      options: [
        { value: "oficial", label: "Oficial", icon: "🏛️" },
        { value: "comunitario", label: "Comunitario", icon: "🤝" },
      ],
    },
  ],
  donaciones: [],
  guias: [
    {
      key: "audiencia",
      label: "¿Para quién?",
      options: [
        { value: "personas_afectadas", label: "Personas afectadas", icon: "👥" },
        { value: "profesionales", label: "Profesionales", icon: "🩺" },
        { value: "comunidad", label: "Comunidad", icon: "🏘️" },
      ],
    },
    {
      key: "formato",
      label: "Formato",
      options: [
        { value: "web", label: "Web", icon: "🌐" },
        { value: "pdf", label: "PDF", icon: "📄" },
        { value: "video", label: "Video", icon: "🎥" },
      ],
    },
  ],
  funerarios: [],
};
