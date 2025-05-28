# Documentación del Proyecto de Automatización con Cypress y GitHub Actions

## Índice
1. [Introducción](#introducción)
2. [Prerrequisitos Manuales](#prerrequisitos-manuales)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración Inicial](#configuración-inicial)
5. [Configuración de Cypress](#configuración-de-cypress)
6. [Configuración de GitHub Actions](#configuración-de-github-actions)
7. [Flujo de Trabajo](#flujo-de-trabajo)
8. [Reportes y Artefactos](#reportes-y-artefactos)
9. [Solución de Problemas](#solución-de-problemas)

## Introducción
Este proyecto implementa pruebas automatizadas utilizando Cypress, con integración continua mediante GitHub Actions. El sistema ejecuta pruebas automatizadas, genera reportes detallados y almacena los resultados en el repositorio de GitHub.

## Prerrequisitos Manuales
Los siguientes pasos deben realizarse manualmente antes de comenzar, ya que no pueden ser automatizados en el archivo YAML:

1. **Configuración de GitHub**:
   - Tener una cuenta de GitHub
   - Crear un repositorio nuevo
   - Habilitar GitHub Pages en la configuración del repositorio
   - Configurar la fuente de GitHub Pages como la carpeta `docs`

2. **Configuración de Microsoft Teams** (Opcional):
   - Crear un webhook en el canal deseado de Teams
   - Guardar la URL del webhook
   - Configurar el secreto en GitHub:
     1. Ir al repositorio en GitHub
     2. Navegar a "Settings" > "Secrets and variables" > "Actions"
     3. Hacer clic en "New repository secret"
     4. Nombre: `MS_TEAMS_WEBHOOK_URI`
     5. Valor: Pegar la URL del webhook copiada anteriormente
     6. Hacer clic en "Add secret"

3. **Configuración del Entorno Local**:
   - Instalar Node.js (versión 14.x o superior)
   - Instalar npm (incluido con Node.js)
   - Clonar el repositorio
   - Instalar las dependencias del proyecto

4. **Permisos del Repositorio**:
   - Asegurar que la rama main permita pushes directos
   - Verificar que el bot de GitHub Actions tenga permisos de escritura

## Estructura del Proyecto
```
├── .github/
│   └── workflows/
│       └── cypress.yml
├── cypress/
│   ├── integration/
│   ├── videos/          # Carpeta temporal para videos durante la ejecución
│   ├── screenshots/     # Carpeta temporal para capturas durante la ejecución
│   └── reports/
├── docs/                # Carpeta para GitHub Pages
├── uploaded-videos/     # Carpeta temporal para videos antes del commit
├── uploaded-screenshots/# Carpeta temporal para screenshots antes del commit
├── package.json
├── cypress.config.js
└── constants.js
```

## Configuración Inicial

### 1. Crear un nuevo proyecto
```bash
mkdir mi-proyecto-cypress
cd mi-proyecto-cypress
npm init -y
```

### 2. Instalar dependencias
```bash
npm install cypress --save-dev
npm install cypress-mochawesome-reporter --save-dev
```

### 3. Configurar scripts en package.json
```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test": "cypress open --browser electron --e2e",
    "test-report": "npx cypress run",
    "start": "cypress open",
    "build": "cypress run"
  }
}
```

## Configuración de Cypress

### 1. Configuración básica (cypress.config.js)
```javascript
const { defineConfig } = require("cypress");
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Report Test Cypress',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false
  },
  e2e: {
    specPattern: 'cypress/integration/**/*.js',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    chromeWebSecurity: false,
    baseUrl: 'https://tu-url-base.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true
  },
  defaultCommandTimeout: 10000
});
```

## Configuración de GitHub Actions

### 1. Archivo de Workflow
El archivo `.github/workflows/cypress.yml` ya incluye toda la configuración necesaria. Solo es necesario modificar los siguientes valores según sea necesario:

```yaml
# Valores que pueden necesitar modificación
baseUrl: 'https://tu-url-base.com'  # Cambiar por la URL de tu aplicación
wait-on: 'https://tu-url-base.com'  # Cambiar por la URL de tu aplicación
```

### 2. Pasos Automatizados
Los siguientes pasos ya están configurados en el archivo YAML y no requieren configuración manual:

1. **Creación de Directorios**:
   - Creación de carpetas para videos, screenshots y reportes
   - Configuración de archivos .gitkeep

2. **Ejecución de Pruebas**:
   - Instalación de dependencias
   - Ejecución de Cypress
   - Generación de reportes

3. **Manejo de Artefactos**:
   - Limpieza de carpetas temporales (`uploaded-videos/` y `uploaded-screenshots/`)
   - Copia de nuevos videos y screenshots a las carpetas temporales
   - Generación de reportes HTML
   - Commit y push de artefactos
   - Las carpetas temporales se limpian antes de cada ejecución para evitar duplicados

4. **Notificaciones**:
   - Configuración de notificaciones en Teams (si se configuró el webhook)

### 3. Proceso de Manejo de Artefactos
El workflow maneja los artefactos de la siguiente manera:

1. **Limpieza Inicial**:
   ```yaml
   # Limpiar contenido anterior
   rm -rf uploaded-videos/*
   rm -rf uploaded-screenshots/*
   ```

2. **Copia de Nuevos Archivos**:
   ```yaml
   # Copiar videos
   find cypress/videos/ -mindepth 1 -maxdepth 1 -exec cp -R {} uploaded-videos/ \;
   
   # Copiar screenshots
   find cypress/screenshots/ -mindepth 1 -maxdepth 1 -exec cp -R {} uploaded-screenshots/ \;
   ```

3. **Commit y Push**:
   ```yaml
   git add -f uploaded-videos/ uploaded-screenshots/ docs/
   git commit -m "feat: Cargar artefactos de Cypress [skip ci]"
   git push origin main
   ```

## Flujo de Trabajo

1. **Desarrollo Local**:
   - Escribir pruebas en `cypress/integration/`
   - Ejecutar pruebas localmente: `npm run cypress:open`
   - Verificar que las pruebas pasen

2. **Integración Continua**:
   - Hacer push a la rama main
   - GitHub Actions ejecuta automáticamente las pruebas
   - Se generan reportes y artefactos

3. **Reportes**:
   - Los reportes se generan en `cypress/reports/html/`
   - Los videos se guardan en `cypress/videos/`
   - Las capturas de pantalla se guardan en `cypress/screenshots/`

## Reportes y Artefactos

### 1. Reportes Mochawesome
- Se generan automáticamente en cada ejecución
- Incluyen:
  - Resumen de pruebas
  - Capturas de pantalla
  - Gráficos de resultados
  - Detalles de errores

### 2. Videos y Screenshots
- Se guardan automáticamente
- Se suben como artefactos en GitHub Actions
- Se mantienen por 30 días

## Solución de Problemas

### Problemas Comunes

1. **Errores de Permisos en GitHub Actions**
   - Verificar que el token GITHUB_TOKEN tenga los permisos necesarios
   - Asegurar que el workflow tenga permisos de escritura
   - Comprobar que el bot de GitHub Actions tenga permisos para hacer push
   - Verificar que la rama main permita pushes directos

2. **Problemas con GitHub Pages**
   - Verificar que GitHub Pages esté habilitado en la configuración del repositorio
   - Comprobar que la carpeta `docs` contenga el archivo `.nojekyll`
   - Asegurar que los reportes se estén copiando correctamente a la carpeta `docs`
   - Verificar que los permisos del workflow incluyan `contents: write`

3. **Problemas con Notificaciones de Teams**
   - Verificar que el webhook esté activo en Teams
   - Comprobar que el secreto `MS_TEAMS_WEBHOOK_URI` esté correctamente configurado
   - Asegurar que el bot tenga permisos para enviar mensajes al canal
   - Verificar que la URL del webhook sea válida y accesible

### Contacto y Soporte
Para soporte adicional o preguntas, contactar al equipo de desarrollo o crear un issue en el repositorio. 