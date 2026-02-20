import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import QRGenerator from "./QRGenerator";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QRPage({ params }: PageProps) {
  const { id } = await params;

  // Buscar el paciente en la base de datos
  const { data: paciente, error: pacienteError } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (pacienteError || !paciente) {
    notFound();
  }

  // Construir la URL completa hacia la página del paciente
  // En producción, deberías usar tu dominio real (ej: https://mivitalqr.com)
  // Para desarrollo local, usamos localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const pacienteUrl = `${baseUrl}/paciente/${id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-3xl p-6 mb-6 text-center shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg 
              className="w-9 h-9 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" />
              <path d="M10 10h4v4h-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generador de Código QR</h1>
          <p className="text-gray-600">
            Código QR para <span className="font-semibold text-indigo-600">{paciente.nombre}</span>
          </p>
        </header>

        {/* Información del paciente */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg 
              className="w-6 h-6 text-indigo-600" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"/>
            </svg>
            Información del Paciente
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Nombre:</span>
              <span className="text-gray-900 font-semibold">{paciente.nombre}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Tipo de Sangre:</span>
              <span className="text-red-600 font-bold text-lg">{paciente.sangre}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">ID del Paciente:</span>
              <span className="text-gray-700 font-mono text-sm">{id}</span>
            </div>
          </div>
        </div>

        {/* Generador de QR */}
        <div className="bg-white rounded-3xl p-8 mb-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            📱 Escanea este código QR
          </h2>
          <QRGenerator 
            url={pacienteUrl} 
            patientName={paciente.nombre}
            patientId={id}
          />
          
          {/* Instrucciones */}
          <div className="mt-6 bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16V12M12 8H12.01" />
              </svg>
              Instrucciones de Uso
            </h3>
            <ul className="text-sm text-indigo-800 space-y-1 ml-6 list-disc">
              <li>Escanea el código QR con cualquier cámara de teléfono</li>
              <li>Se abrirá automáticamente la página con la información médica</li>
              <li>Descarga el QR como imagen para imprimir o compartir</li>
              <li>El código QR contiene la URL completa al perfil del paciente</li>
            </ul>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href={`/paciente/${id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-indigo-600 font-semibold py-3 px-6 rounded-2xl shadow-lg border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18L9 12L15 6" />
            </svg>
            Ver Información del Paciente
          </Link>
          
          <Link 
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Volver al Inicio
          </Link>
        </div>

        {/* Nota sobre la URL base */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Nota:</strong> Los códigos QR generados usan <code className="bg-yellow-100 px-2 py-0.5 rounded">localhost:3000</code> durante el desarrollo. 
            Para producción, configura la variable de entorno <code className="bg-yellow-100 px-2 py-0.5 rounded">NEXT_PUBLIC_BASE_URL</code> con tu dominio real.
          </p>
        </div>
      </div>
    </div>
  );
}
