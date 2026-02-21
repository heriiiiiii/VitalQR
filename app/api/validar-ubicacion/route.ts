import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RequestBody {
  qr_id: string;
  latitude: number;
  longitude: number;
}

// Fórmula de Haversine para calcular distancia entre dos puntos en metros
function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function formatDistancia(metros: number | null): string {
  if (metros === null) return '0m';
  if (metros >= 1000) return `${Math.round(metros / 1000)}km`;
  return `${Math.round(metros)}m`;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { qr_id, latitude, longitude } = body;

    // Validar parámetros requeridos
    if (!qr_id || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos: qr_id, latitude, longitude' },
        { status: 400 }
      );
    }

    // Obtener datos del paciente por su ID (que es el qr_id)
    const { data: paciente, error: pacienteError } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', qr_id)
      .single();

    if (pacienteError || !paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Calcular si es zona segura
    let esZonaSegura = false;
    let distancia: number | null = null;

    if (paciente.zona_segura_lat && paciente.zona_segura_lon) {
      distancia = calcularDistancia(
        latitude,
        longitude,
        paciente.zona_segura_lat,
        paciente.zona_segura_lon
      );
      const radioSeguro = paciente.zona_segura_radio || 100;
      esZonaSegura = distancia <= radioSeguro;
    }

    // Registrar el nuevo ingreso en el historial
    const { error: historialError } = await supabase
      .from('historial')
      .insert({
        paciente_id: qr_id,
        es_zona_segura: esZonaSegura,
        latitud: latitude,
        longitud: longitude,
      });

    if (historialError) {
      console.error('Error al guardar historial:', historialError);
      // No bloqueamos la respuesta si falla el historial
    }

    // Obtener historial completo del paciente (para zona segura)
    const { data: historial } = await supabase
      .from('historial')
      .select('*')
      .eq('paciente_id', qr_id)
      .order('created_at', { ascending: false });

    const distanciaStr = formatDistancia(distancia);

    if (esZonaSegura) {
      // Acceso completo: zona segura verificada
      return NextResponse.json({
        status: 'SAFE',
        distance: distanciaStr,
        message: 'Verified Safe Zone. Full access granted.',
        data: {
          id: paciente.id,
          created_at: paciente.created_at,
          nombre: paciente.nombre,
          sangre: paciente.sangre,
          alergias: paciente.alergias,
          enfermedades: paciente.enfermedades,
          contacto_emergencia: paciente.contacto_emergencia,
          mensaje_privado: paciente.mensaje_privado,
        },
        historial: historial || [],
      });
    } else {
      // Acceso restringido: ubicación no verificada
      return NextResponse.json({
        status: 'ALERT',
        distance: distanciaStr,
        message: 'Unverified Location. Sensitive data redacted.',
        data: {
          nombre: paciente.nombre,
          sangre: paciente.sangre,
          contacto_emergencia: paciente.contacto_emergencia,
          alergias: 'PROTECTED DATA',
          enfermedades: 'PROTECTED DATA',
          mensaje_privado: 'REQUIRES MEDICAL AUTH',
        },
        historial: historial || [],
      });
    }
  } catch (error) {
    console.error('Error en validar-ubicacion:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
