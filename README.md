# ICOAT GROUP — Sistema de Presupuestos

Aplicación web para calcular presupuestos de instalación de pisos epóxicos
y generar cotizaciones para clientes.

## Tecnología

- **React 18** + **Vite** (bundler ultra rápido)
- **lucide-react** (iconos)
- Sin backend — todo se calcula en el navegador
- Exporta/importa presupuestos como archivos JSON

## Para correr localmente

Requiere Node.js 18+. En la carpeta del proyecto:

```bash
npm install
npm run dev
```

Luego abrir http://localhost:5173

## Para hacer build de producción

```bash
npm run build
```

Genera la carpeta `dist/` con archivos estáticos.

## Despliegue en Vercel

Vercel detecta automáticamente que es un proyecto Vite. No requiere configuración.
Solo conectar el repositorio y hacer deploy.

## Estructura

```
icoat-app/
├── index.html                  # HTML principal
├── package.json                # Dependencias
├── vite.config.js              # Configuración Vite
├── public/
│   └── favicon.svg             # Icono del navegador
└── src/
    ├── main.jsx                # Punto de entrada React
    ├── App.jsx                 # Componente principal (la app completa)
    └── index.css               # Estilos globales
```

## Para personalizar

- **Logo del cliente**: agregar el archivo (ej. `logo.png`) en `public/`
  y reemplazar el cuadro "IG" en `App.jsx` (buscar `width: 48, height: 48`
  en el header y en la cotización).
- **Colores**: editar el objeto `C` al inicio de `App.jsx`.
- **Datos iniciales** (catálogos de maquinarias, consumibles, etc.):
  editar las constantes `initialMachinery`, `initialConsumables`, etc.
