import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RequestBody {
  pacienteId: string;
  latitude: number;
  longitude: number;
}

// Función para calcular la distancia entre dos puntos (en metros)
// Usa la fórmula de Haversine
function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { pacienteId, latitude, longitude } = body;

    // Validar datos recibidos
    if (!pacienteId || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // Obtener datos del paciente incluyendo zona segura
    const { data: paciente, error: pacienteError } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', pacienteId)
      .single();

    if (pacienteError || !paciente) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el paciente tiene zona segura configurada
    let esZonaSegura = false;
    let distancia: number | null = null;

    if (paciente.zona_segura_lat && paciente.zona_segura_lon) {
      // Calcular distancia
      distancia = calcularDistancia(
        latitude,
        longitude,
        paciente.zona_segura_lat,
        paciente.zona_segura_lon
      );

      // Verificar si está dentro del radio (por defecto 100 metros)
      const radioSeguro = paciente.zona_segura_radio || 100;
      esZonaSegura = distancia <= radioSeguro;
    }

    // Guardar en el historial
    const { error: historialError } = await supabase
      .from('historial')
      .insert({
        paciente_id: pacienteId,
        es_zona_segura: esZonaSegura,
        latitud: latitude,
        longitud: longitude,
        distancia: distancia,
      });

    if (historialError) {
      console.error('Error al guardar historial:', historialError);
      return NextResponse.json(
        { error: 'Error al guardar en el historial' },
        { status: 500 }
      );
    }

    // Preparar la respuesta según si está o no en zona segura
    if (esZonaSegura) {
      // ZONA SEGURA: Retornar todos los datos
      return NextResponse.json({
        status: 'SAFE',
        distance: distancia ? `${Math.round(distancia)}m` : '0m',
        message: 'Verified Safe Zone. Full access granted.',
        data: {
          id: paciente.id,
          created_at: paciente.created_at,
          nombre: paciente.nombre,
          sangre: paciente.sangre,
          alergias: paciente.alergias || 'No registrado',
          enfermedades: paciente.enfermedades || 'No registrado',
          contacto_emergencia: paciente.contacto_emergencia || 'No registrado',
          mensaje_privado: paciente.mensaje_privado || 'Sin información adicional',
        },
      });
    } else {
      // ZONA NO SEGURA: Datos sensibles protegidos
      return NextResponse.json({
        status: 'ALERT',
        distance: distancia ? `${Math.round(distancia)}m` : 'Desconocido',
        message: 'Unverified Location. Sensitive data redacted.',
        data: {
          nombre: paciente.nombre,
          sangre: paciente.sangre,
          contacto_emergencia: paciente.contacto_emergencia || 'No registrado',
          alergias: 'PROTECTED DATA',
          enfermedades: 'PROTECTED DATA',
          mensaje_privado: 'REQUIRES MEDICAL AUTH',
        },
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
