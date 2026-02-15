import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- DEMO CONFIGURATION ---
const LOCATIONS = {
  HOME: { lat: -17.39628715652018, lng: -66.2987409331132 }, // Tus coordenadas actuales
  UNIVERSITY: { lat: -17.33289495895477, lng: -66.22618807366119 } // Ejemplo: Cambia esto por las de tu facultad
};

/**
 * MODO DE PRUEBA: 
 * Cambia 'LOCATIONS.HOME' por 'LOCATIONS.UNIVERSITY' 
 * para alternar el punto central de la zona segura.
 */
const CURRENT_SAFE_POINT = LOCATIONS.UNIVERSITY; 

const SAFE_ZONE_CONFIG = {
  ...CURRENT_SAFE_POINT,
  radius_meters: 100
};

// Formula de Haversine
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; 
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ1) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

export async function POST(request: Request) {
  try {
    const { qr_id, latitude, longitude } = await request.json();

    const { data: patient, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', qr_id)
      .single();

    if (error || !patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const distance = calculateDistance(latitude, longitude, SAFE_ZONE_CONFIG.lat, SAFE_ZONE_CONFIG.lng);
    const isSafeZone = distance <= SAFE_ZONE_CONFIG.radius_meters;

    // Log en el historial para el MIS
    await supabase.from('historial').insert({
      paciente_id: qr_id,
      latitud: latitude,
      longitud: longitude,
      es_zona_segura: isSafeZone
    });

    if (isSafeZone) {
      return NextResponse.json({
        status: 'SAFE',
        distance: `${Math.round(distance)}m`,
        message: 'Verified Safe Zone. Full access granted.',
        data: patient
      });
    } else {
      return NextResponse.json({
        status: 'ALERT',
        distance: `${Math.round(distance)}m`,
        message: 'Unverified Location. Sensitive data redacted.',
        data: {
          nombre: patient.nombre,
          sangre: patient.sangre,
          contacto_emergencia: patient.contacto_emergencia,
          alergias: "PROTECTED DATA",
          enfermedades: "PROTECTED DATA",
          mensaje_privado: "REQUIRES MEDICAL AUTH"
        }
      });
    }

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}