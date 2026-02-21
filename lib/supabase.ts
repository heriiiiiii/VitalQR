import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Paciente {
  id: string;
  nombre: string;
  sangre: string;
  alergias?: string;
  enfermedades?: string;
  contacto_emergencia?: string;
  mensaje_privado?: string;
  zona_segura_lat?: number;
  zona_segura_lon?: number;
  zona_segura_radio?: number; // Radio en metros (por defecto 100)
  created_at: string;
}

export interface Historial {
  id: string;
  paciente_id: string;
  es_zona_segura: boolean;
  latitud?: number;
  longitud?: number;
  distancia?: number; // Distancia en metros desde la zona segura
  created_at: string;
}
