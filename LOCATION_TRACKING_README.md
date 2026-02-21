# Sistema de Validación de Ubicación - VitalQR

## 📍 Funcionamiento

Cuando alguien escanea el código QR y accede a la información del paciente, el sistema automáticamente:

1. **Solicita la ubicación** del dispositivo del usuario
2. **Envía las coordenadas** a la API para validarlas
3. **Compara** con la zona segura configurada para ese paciente
4. **Guarda en el historial** si el acceso fue desde zona segura o no
5. **Muestra una alerta visual** si el acceso NO es desde zona segura

## 🗂️ Archivos Creados/Modificados

### 1. API Route: `/app/api/validar-ubicacion/route.ts`
- **Endpoint:** `POST /api/validar-ubicacion`
- **Función:** Recibe coordenadas, valida si están en zona segura y guarda en historial
- **Usa:** Fórmula de Haversine para calcular distancia entre puntos

### 2. Componente Client: `/app/paciente/[id]/LocationTracker.tsx`
- **Tipo:** Client Component
- **Función:** Captura ubicación del navegador y la envía a la API
- **Características:**
  - Solicita permisos de geolocalización
  - Muestra estados de carga/error/éxito
  - Alerta visual si NO está en zona segura

### 3. Integración: `/app/paciente/[id]/page.tsx`
- **Modificación:** Importa y usa `<LocationTracker />`
- **Ubicación:** Se ejecuta automáticamente al cargar la página

### 4. Tipos TypeScript: `/lib/supabase.ts`
- **Campos nuevos en `Paciente`:**
  - `zona_segura_lat?: number` - Latitud de la zona segura
  - `zona_segura_lon?: number` - Longitud de la zona segura
  - `zona_segura_radio?: number` - Radio en metros (default: 100m)

- **Campos nuevos en `Historial`:**
  - `latitud?: number` - Latitud donde se accedió
  - `longitud?: number` - Longitud donde se accedió
  - `distancia?: number` - Distancia en metros desde zona segura

## 🗄️ Cambios en Base de Datos (Supabase)

Necesitas ejecutar estos comandos SQL en Supabase:

```sql
-- Agregar campos de zona segura a la tabla pacientes
ALTER TABLE pacientes 
ADD COLUMN zona_segura_lat DOUBLE PRECISION,
ADD COLUMN zona_segura_lon DOUBLE PRECISION,
ADD COLUMN zona_segura_radio INTEGER DEFAULT 100;

-- Agregar campos de ubicación al historial
ALTER TABLE historial
ADD COLUMN latitud DOUBLE PRECISION,
ADD COLUMN longitud DOUBLE PRECISION,
ADD COLUMN distancia DOUBLE PRECISION;

-- Agregar índices para mejor performance
CREATE INDEX idx_historial_paciente_created 
ON historial(paciente_id, created_at DESC);
```

## 🧪 Cómo Probar

### 1. Configurar Zona Segura
Actualiza un paciente con coordenadas de zona segura:

```sql
UPDATE pacientes 
SET 
  zona_segura_lat = 40.7128,  -- Latitud (ej: New York)
  zona_segura_lon = -74.0060,  -- Longitud
  zona_segura_radio = 100      -- Radio en metros
WHERE id = 'tu-paciente-id';
```

### 2. Generar y Escanear QR
1. Ve a `/qr/[paciente-id]`
2. Descarga o escanea el código QR
3. El navegador pedirá permisos de ubicación
4. Verás una alerta si NO estás en zona segura

### 3. Verificar Historial
```sql
SELECT 
  paciente_id,
  es_zona_segura,
  latitud,
  longitud,
  distancia,
  created_at
FROM historial
ORDER BY created_at DESC
LIMIT 10;
```

## 🎨 Interfaz de Usuario

### Estados Visuales

1. **Cargando (azul):**
   ```
   🔄 Verificando ubicación...
   ```

2. **Error (rojo):**
   ```
   ❌ Permiso de ubicación denegado
   ```

3. **Fuera de zona segura (amarillo):**
   ```
   ⚠️ Acceso desde zona desconocida
   Este acceso ha sido registrado en el historial
   ```

4. **En zona segura:**
   - No muestra alerta
   - Mensaje privado visible automáticamente

## 🔐 Seguridad

- ✅ La validación se hace en el servidor (API Route)
- ✅ Las coordenadas sensibles no se exponen al cliente
- ✅ Se registra CADA acceso en el historial
- ✅ La ubicación se solicita con `enableHighAccuracy: true`

## 📱 Compatibilidad

- ✅ Funciona en móviles (Android/iOS)
- ✅ Funciona en navegadores modernos
- ⚠️ Requiere HTTPS en producción (o localhost)
- ⚠️ El usuario debe dar permisos de ubicación

## 🚀 Next Steps (Opcionales)

1. **Dashboard de historial:** Ver todos los accesos en un mapa
2. **Alertas:** Enviar notificación cuando se accede fuera de zona segura
3. **Múltiples zonas:** Permitir varias zonas seguras por paciente
4. **Geofencing avanzado:** Polígonos en lugar de círculos

## 📞 Flujo Completo

```
Usuario escanea QR
    ↓
Abre /paciente/[id]
    ↓
LocationTracker se monta
    ↓
Solicita ubicación del navegador
    ↓
Obtiene coords (lat, lon)
    ↓
POST /api/validar-ubicacion
    ↓
API consulta zona_segura del paciente
    ↓
Calcula distancia (Haversine)
    ↓
¿Distancia < radio? → es_zona_segura = true/false
    ↓
Guarda en historial
    ↓
Responde al cliente
    ↓
Muestra alerta si NO está en zona segura
```

## 🐛 Troubleshooting

### "Permiso denegado"
- Usuario rechazó permisos de ubicación
- Ir a configuración del navegador → Permisos → Ubicación

### "Ubicación no disponible"
- GPS del dispositivo desactivado
- Sin conexión a internet
- Problemas con el hardware

### "Timeout"
- Señal GPS débil
- El navegador no puede obtener ubicación en 10 segundos

### No guarda en historial
- Verificar que las tablas/columnas existan en Supabase
- Revisar logs en la terminal del servidor Next.js
- Verificar variables de entorno de Supabase
