"use client";

import { useEffect, useState } from "react";

interface LocationTrackerProps {
  pacienteId: string;
  onLocationVerified: (data: any) => void;
}

export default function LocationTracker({ pacienteId, onLocationVerified }: LocationTrackerProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    // Función para obtener y enviar la ubicación
    const enviarUbicacion = async () => {
      // Verificar si el navegador soporta geolocalización
      if (!navigator.geolocation) {
        setStatus("error");
        setMensaje("Tu navegador no soporta geolocalización");
        return;
      }

      try {
        // Intentar con alta precisión primero
        const obtenerUbicacion = (highAccuracy: boolean, timeout: number) => {
          return new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: highAccuracy,
                timeout: timeout,
                maximumAge: highAccuracy ? 0 : 300000, // Cache de 5 min si es baja precisión
              }
            );
          });
        };

        let position: GeolocationPosition;
        
        try {
          // Primer intento: Alta precisión con 15 segundos
          position = await obtenerUbicacion(true, 15000);
        } catch (error: any) {
          console.warn("Intento 1 falló, intentando con baja precisión:", error.message);
          
          try {
            // Segundo intento: Baja precisión (más rápido) con 10 segundos
            position = await obtenerUbicacion(false, 10000);
          } catch (error2: any) {
            // Si ambos fallan, lanzar el error
            throw error2;
          }
        }

        const { latitude, longitude } = position.coords;

        try {
          // Enviar a la API
          const response = await fetch("/api/validar-ubicacion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pacienteId,
              latitude,
              longitude,
            }),
          });

          const data = await response.json();

          if (response.ok && (data.status === 'SAFE' || data.status === 'ALERT')) {
            setStatus("success");
            setMensaje(data.message);
            
            // Pasar los datos al componente padre
            onLocationVerified(data);
          } else {
            setStatus("error");
            setMensaje(data.error || "Error al validar ubicación");
          }
        } catch (error) {
          console.error("Error al enviar ubicación:", error);
          setStatus("error");
          setMensaje("Error de conexión con el servidor");
        }
      } catch (error: any) {
        console.error("Error al obtener ubicación:", error);
        setStatus("error");
        
        // Mensajes de error más específicos
        if (error.code !== undefined) {
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              setMensaje("⚠️ Permiso de ubicación denegado. Por favor, habilita el acceso a la ubicación.");
              break;
            case 2: // POSITION_UNAVAILABLE
              setMensaje("⚠️ Ubicación no disponible. Verifica tu GPS y conexión.");
              break;
            case 3: // TIMEOUT
              setMensaje("⚠️ No se pudo obtener la ubicación. Intenta recargar la página.");
              break;
            default:
              setMensaje("⚠️ Error al obtener ubicación");
          }
        } else {
          setMensaje("⚠️ Error inesperado al procesar ubicación");
        }
      }
    };

    // Ejecutar la función
    enviarUbicacion();
  }, [pacienteId, onLocationVerified]);

  // Mostrar indicador de carga
  if (status === "loading") {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-blue-700 font-medium">Verificando ubicación...</p>
        </div>
      </div>
    );
  }

  // Mostrar estado de error
  if (status === "error") {
    return (
      <div className="border-2 rounded-2xl p-4 mb-3 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div className="flex-1">
            <p className="font-semibold text-red-800">{mensaje}</p>
          </div>
        </div>
      </div>
    );
  }

  // Si fue exitoso, no mostramos nada (los datos se muestran en el componente padre)
  return null;
}
