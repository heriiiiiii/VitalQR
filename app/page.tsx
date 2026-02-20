import Link from "next/link";
import { supabase, type Paciente } from "@/lib/supabase";

export default async function Home() {
  const { data: pacientes, error } = await supabase
    .from('pacientes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="bg-white rounded-3xl p-10 mb-6 text-center shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Información Médica</h1>
          <p className="text-gray-600">Selecciona un paciente para ver sus datos</p>
        </header>

        {error ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <p className="text-red-500">No se pudieron cargar los pacientes</p>
          </div>
        ) : pacientes && pacientes.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pacientes.map((paciente: Paciente) => (
              <div
                key={paciente.id}
                className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-lg"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg 
                    className="w-8 h-8 text-white" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"/>
                  </svg>
                </div>
                <Link
                  href={`/paciente/${paciente.id}`}
                  className="flex-1 group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{paciente.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    Sangre: <span className="text-indigo-600 font-semibold">{paciente.sangre}</span>
                  </p>
                </Link>
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/qr/${paciente.id}`}
                    className="p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all hover:shadow-md border border-indigo-200 hover:border-indigo-300"
                    title="Generar código QR"
                  >
                    <svg 
                      className="w-5 h-5 text-indigo-600" 
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
                  </Link>
                  <Link
                    href={`/paciente/${paciente.id}`}
                    className="p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all hover:shadow-md border border-purple-200 hover:border-purple-300"
                    title="Ver información completa"
                  >
                    <svg 
                      className="w-5 h-5 text-purple-600" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 6L15 12L9 18"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <p className="text-gray-600">No hay pacientes disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}
