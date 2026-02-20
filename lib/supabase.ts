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
  created_at: string;
}

export interface Historial {
  id: string;
  paciente_id: string;
  es_zona_segura: boolean;
  created_at: string;
}
