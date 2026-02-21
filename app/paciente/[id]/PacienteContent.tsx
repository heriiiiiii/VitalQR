"use client";

import { useState } from "react";
import LocationTracker from "./LocationTracker";

interface PacienteData {
  id: string;
  nombre: string;
  sangre: string;
  alergias?: string;
  enfermedades?: string;
  contacto_emergencia?: string;
  mensaje_privado?: string;
}

interface PacienteContentProps {
  pacienteId: string;
  pacienteInicial: PacienteData;
}

export default function PacienteContent({ pacienteId, pacienteInicial }: PacienteContentProps) {
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [pacienteData, setPacienteData] = useState<PacienteData>(pacienteInicial);
  const [isZonaSegura, setIsZonaSegura] = useState<boolean>(false);

  const handleLocationVerified = (data: any) => {
    setLocationStatus(data.status);
    setDistance(data.distance);
    setIsZonaSegura(data.status === 'SAFE');
    
    // Actualizar los datos del paciente con la respuesta de la API
    if (data.data) {
      setPacienteData(data.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 p-3 py-4">
      <div className="max-w-md mx-auto">
        {/* Header con nombre */}
        <header className="bg-white rounded-3xl p-4 mb-3 text-center shadow-xl">
          <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <svg 
              className="w-10 h-10 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{pacienteData.nombre}</h2>
          <p className="text-sm text-gray-600 font-medium">Información Médica</p>
        </header>

        {/* Componente para capturar y validar ubicación */}
        <LocationTracker pacienteId={pacienteId} onLocationVerified={handleLocationVerified} />

        {/* Alerta de estado de ubicación */}
        {locationStatus === 'ALERT' && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-yellow-800">Zona No Verificada</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Distancia: {distance} | Datos sensibles protegidos
                </p>
              </div>
            </div>
          </div>
        )}

        {locationStatus === 'SAFE' && (
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4 mb-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <p className="font-semibold text-green-800">Zona Segura Verificada</p>
                <p className="text-sm text-green-700 mt-1">
                  Distancia: {distance} | Acceso completo
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid: Información Vital y Contacto de Emergencia */}
        <div className={`grid ${pacienteData.contacto_emergencia ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-3`}>
          {/* Información Vital */}
          <div className="bg-white rounded-3xl p-4 shadow-xl">
            <h3 className="text-xs font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
              <svg 
                className="w-3.5 h-3.5 text-blue-600" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"/>
              </svg>
              <span className="text-xs">Información Vital</span>
            </h3>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-3 border border-rose-200">
              <p className="text-xs text-gray-600 font-medium mb-1 uppercase tracking-wide">
                Tipo de Sangre
              </p>
              <p className="text-2xl font-bold text-red-600 text-center tracking-wider">
                {pacienteData.sangre}
              </p>
            </div>
          </div>

          {/* Contacto de Emergencia */}
          {pacienteData.contacto_emergencia && (
            <div className="bg-white rounded-3xl p-4 shadow-xl">
              <h3 className="text-xs font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
                <svg 
                  className="w-3.5 h-3.5 text-red-600" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"/>
                </svg>
                <span className="text-xs">Emergencia</span>
              </h3>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-3 text-center flex items-center justify-center min-h-[80px]">
                <a 
                  href={`tel:${pacienteData.contacto_emergencia}`}
                  className="inline-block text-base font-bold text-red-600 py-2 px-3 bg-white rounded-xl transition-all hover:scale-105 shadow-md break-all"
                >
                  {pacienteData.contacto_emergencia}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Alergias */}
        {pacienteData.alergias && (
          <div className="bg-white rounded-3xl p-4 mb-3 shadow-xl">
            <h3 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
              <svg 
                className="w-4 h-4 text-amber-600" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
              </svg>
              Alergias
            </h3>
            <div className={`bg-gradient-to-br rounded-2xl p-3 border-l-4 ${
              pacienteData.alergias === 'PROTECTED DATA' 
                ? 'from-gray-50 to-gray-100 border-gray-400' 
                : 'from-amber-50 to-yellow-50 border-amber-500'
            }`}>
              <p className={`text-sm font-medium leading-relaxed ${
                pacienteData.alergias === 'PROTECTED DATA' ? 'text-gray-600 italic' : 'text-gray-800'
              }`}>
                {pacienteData.alergias}
              </p>
            </div>
          </div>
        )}

        {/* Enfermedades */}
        {pacienteData.enfermedades && (
          <div className="bg-white rounded-3xl p-4 mb-3 shadow-xl">
            <h3 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
              <svg 
                className="w-4 h-4 text-blue-600" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
              </svg>
              Enfermedades
            </h3>
            <div className={`bg-gradient-to-br rounded-2xl p-3 border-l-4 ${
              pacienteData.enfermedades === 'PROTECTED DATA' 
                ? 'from-gray-50 to-gray-100 border-gray-400' 
                : 'from-blue-50 to-indigo-50 border-blue-500'
            }`}>
              <p className={`text-sm leading-relaxed ${
                pacienteData.enfermedades === 'PROTECTED DATA' ? 'text-gray-600 italic font-medium' : 'text-gray-800'
              }`}>
                {pacienteData.enfermedades}
              </p>
            </div>
          </div>
        )}

        {/* Mensaje Privado */}
        {pacienteData.mensaje_privado && isZonaSegura && pacienteData.mensaje_privado !== 'REQUIRES MEDICAL AUTH' && (
          <div className="bg-white rounded-3xl p-4 mb-3 shadow-xl relative overflow-hidden">
            <div className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-teal-600 text-white px-3 py-1.5 rounded-bl-2xl text-xs font-bold flex items-center gap-1 shadow-lg">
              <svg 
                className="w-3.5 h-3.5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"/>
              </svg>
              Zona Segura
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-2.5 mt-5">Información Privada</h3>
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-3 border-l-4 border-blue-500">
              <p className="text-sm text-gray-800 font-medium leading-relaxed">{pacienteData.mensaje_privado}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
