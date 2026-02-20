# 📱 Generador de Códigos QR - VitalQR

## ¿Qué hace este sistema?

Este sistema genera **códigos QR** que contienen la URL completa hacia la página de información médica de cada paciente. Cuando alguien escanea el código QR con su teléfono, automáticamente se abre la página web con toda la información del paciente.

## 🎯 Flujo de trabajo

1. **Lista de Pacientes** (`/`)
   - Muestra todos los pacientes registrados
   - Cada paciente tiene dos botones:
     - 🔷 Botón QR: Lleva al generador de código QR
     - 🔷 Botón flecha: Lleva a la información completa

2. **Información del Paciente** (`/paciente/[id]`)
   - Muestra toda la información médica del paciente
   - Incluye botón "Generar Código QR"

3. **Generador de QR** (`/qr/[id]`)
   - Genera un código QR con la URL completa
   - URL generada: `{TU_DOMINIO}/paciente/{id}`
   - Permite descargar el QR como imagen PNG
   - Permite copiar la URL al portapapeles

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URL base de tu aplicación
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Para Desarrollo Local (localhost)
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Para Producción
```env
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

**Importante:** No incluyas la barra `/` al final de la URL.

## 📦 Dependencias

El sistema usa la librería `qrcode.react` para generar los códigos QR:

```bash
npm install qrcode.react
```

## 🚀 Uso

### 1. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 2. Acceder a las páginas
- **Lista de pacientes:** http://localhost:3000
- **Información del paciente:** http://localhost:3000/paciente/{id}
- **Generador de QR:** http://localhost:3000/qr/{id}

### 3. Generar un código QR
1. Ve a la lista de pacientes
2. Haz clic en el botón del código QR (icono cuadrado)
3. El sistema genera el QR automáticamente
4. Descarga el QR como PNG o copia la URL

### 4. Escanear el código QR
1. Abre la cámara de cualquier smartphone
2. Apunta la cámara al código QR
3. Se abrirá automáticamente la página con la información del paciente

## 🎨 Características del QR

- **Nivel de corrección de errores:** Alto (H) - 30% del código puede estar dañado y seguir funcionando
- **Tamaño:** 220x220 píxeles (con margen incluido)
- **Formato de descarga:** PNG con fondo blanco
- **Colores:** Fondo blanco, patrón en azul índigo

## 📱 Casos de uso

### Uso médico/emergencias
1. Imprime el código QR y ponlo en:
   - Pulsera del paciente
   - Tarjeta de identificación
   - Mochila o cartera
2. En caso de emergencia, cualquier persona puede escanear el QR
3. Acceso instantáneo a información vital (tipo de sangre, alergias, etc.)

### Uso administrativo
1. Genera QR para cada paciente
2. Guarda los QR en el sistema de archivos del hospital
3. Acceso rápido a información del paciente sin buscar manualmente

## 🔒 Consideraciones de Seguridad

- ⚠️ **Importante:** El código QR contiene la URL pública del paciente
- Cualquiera que escanee el QR podrá ver la información
- Para entornos de producción, considera:
  - Implementar autenticación/autorización
  - URLs con tokens únicos y temporales
  - Sistema de permisos por rol

## 🎨 Personalización

### Cambiar colores del QR
Edita el archivo `app/qr/[id]/QRGenerator.tsx`:

```tsx
<QRCodeSVG
    value={url}
    size={220}
    bgColor="#ffffff"  // Color de fondo
    fgColor="#312e81"  // Color del patrón (azul índigo)
    level="H"
/>
```

### Cambiar tamaño del QR
```tsx
<QRCodeSVG
    value={url}
    size={300}  // Cambia el tamaño aquí
    ...
/>
```

## 🐛 Solución de Problemas

### El QR muestra "localhost" en producción
- Verifica que hayas configurado `NEXT_PUBLIC_BASE_URL` en tu entorno de producción
- Reinicia el servidor después de cambiar variables de entorno

### El QR no se descarga
- Verifica que tu navegador permita descargas
- Asegúrate de que JavaScript esté habilitado

### El QR no se escanea
- Aumenta el tamaño del QR impreso
- Asegúrate de que haya buen contraste (fondo blanco, patrón oscuro)
- Verifica que no esté dañado o arrugado

## 📄 Estructura de Archivos

```
app/
├── page.tsx                    # Lista de pacientes
├── paciente/
│   └── [id]/
│       └── page.tsx           # Información del paciente
└── qr/
    └── [id]/
        ├── page.tsx           # Generador de QR
        └── QRGenerator.tsx    # Componente del QR
```

## 🎯 Próximas Mejoras

- [ ] Códigos QR con logo personalizado
- [ ] Batch generation (generar múltiples QR a la vez)
- [ ] Estadísticas de escaneos
- [ ] QR codes con expiración temporal
- [ ] Diseños personalizables (colores, formas)

---

**¿Necesitas ayuda?** Revisa la documentación de [qrcode.react](https://github.com/zpao/qrcode.react) para más opciones de personalización.
