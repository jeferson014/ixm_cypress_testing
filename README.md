# Pruebas de Login con Cypress

Este proyecto contiene pruebas automatizadas para el sistema de login utilizando Cypress.

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)
- Git

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/jeferson014/cypress_ixm.git
```

2. Instalar dependencias:
```bash
npm install
```

## Ejecución de Pruebas

### Ejecutar pruebas localmente
```bash
npm run cypress:open
```

### Ejecutar pruebas en modo headless
```bash
npm run cypress:run
```

## Estructura del Proyecto

```
cypress/
├── integration/
│   └── pile/
│       └── login-test.test.js
├── fixtures/
├── support/
└── cypress.config.js
```

## Pipeline de CI/CD

El proyecto utiliza GitHub Actions para la integración continua. Las pruebas se ejecutan automáticamente en:
- Push a la rama main
- Pull requests a la rama main

## Configuración del Pipeline

1. Crear un repositorio en GitHub
2. Agregar los siguientes secrets en la configuración del repositorio:
   - `CYPRESS_RECORD_KEY`: Clave de Cypress Cloud (opcional)
   - `GITHUB_TOKEN`: Token de GitHub (se genera automáticamente)

## Entorno de Pruebas

Las pruebas se ejecutan contra el entorno de desarrollo:
- URL Base: https://ixm-nexusdev.azurewebsites.net

## Contribución

1. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
2. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abrir un Pull Request 