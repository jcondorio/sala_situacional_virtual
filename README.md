# Impacto de una Sala Situacional Virtual en las Vigilancias Epidemiológicas de IRAs y EDAs
### Establecimientos de Salud de Tacna, 2024

## 📝 Descripción del Proyecto
Este sistema implementa una **Sala Situacional Virtual** diseñada para optimizar, automatizar y analizar el proceso de vigilancia epidemiológica de Infecciones Respiratorias Agudas (**IRAs**) y Enfermedades Diarreicas Agudas (**EDAs**). 

Desarrollado específicamente para el contexto de los establecimientos de salud de la región de **Tacna durante el año 2024**, el sistema transforma datos tabulares y reportes manuales en dashboards interactivos en tiempo real para la toma de decisiones médicas y administrativas.

### 🎯 Objetivos
* **Automatizar** el flujo de recolección de datos epidemiológicos de IRAS y EDAS.
* **Visualizar** de forma dinámica el comportamiento de las enfermedades (canales endémicos, tasa de insidencia acumulada por distritos de Tacna).

---

## 🚀 Características Principales
* **Dashboard Interactivo:** Gráficos estadísticos de tendencias semanales (Semanas Epidemiológicas).
* **Geolocalización:** Tasa de insidencia acumulada de Tacna para identificar brotes en tiempo real por redes y microrredes de salud.
---

## 🛠️ Tecnologías Utilizadas
* **Frontend:** [React.js / HTML5 & CSS3]
* **Backend:** [Node.js ]
* **Base de Datos:** [MySQL]
* **Visualización de Datos:** [Leaflet.js para mapas, Chart.js para gráficos]

---

## 📐 Arquitectura del Sistema

<img width="529" height="636" alt="Captura de pantalla 2026-06-05 183231" src="https://github.com/user-attachments/assets/b0fc5a6d-a2c9-48ce-9e54-759fb9f5c60a" />


## 💻 Vista Previa
Vista del usuario:

<img width="1900" height="881" alt="Captura de pantalla 2026-06-05 174616" src="https://github.com/user-attachments/assets/c0674108-7948-4c76-b8b7-cf6b65fe8d1b" />
<img width="1900" height="881" alt="Captura de pantalla 2026-06-05 174616" src="https://github.com/user-attachments/assets/7c38261f-4b41-4372-942b-f23fa3f328d9" />
<img width="1900" height="898" alt="Captura de pantalla 2026-06-05 175609" src="https://github.com/user-attachments/assets/4f53f405-f603-4f42-80cb-1803903a6c44" />
<img width="1622" height="866" alt="Captura de pantalla 2026-06-05 175634" src="https://github.com/user-attachments/assets/ebc5dafc-eaab-41ee-830c-069c9cfc6e2a" />

Vista del administrador:

<img width="1905" height="897" alt="Captura de pantalla 2026-06-05 182603" src="https://github.com/user-attachments/assets/454a6a02-39e8-470e-baff-236dcedcb09b" />
<img width="1905" height="886" alt="Captura de pantalla 2026-06-05 182619" src="https://github.com/user-attachments/assets/3afdfbc5-2811-4cdb-b0c0-9e0f5055d68d" />
<img width="1914" height="900" alt="Captura de pantalla 2026-06-05 182629" src="https://github.com/user-attachments/assets/9c291c9e-e5a6-4692-8df9-13450be112cb" />
<img width="1907" height="903" alt="Captura de pantalla 2026-06-05 182635" src="https://github.com/user-attachments/assets/f6d1e671-a9e2-43fd-bbf4-917b80d4e075" />

## ⚙️ Instalación y Configuración

### Requisitos Previos

- Node.js v18 o superior
- MySQL 8.0 o superior
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/jcondorio/sala_situacional_virtual.git
cd sala_situacional_virtual
```

### 2. Importar la Base de Datos

Importar el archivo SQL ubicado en la carpeta:

```text
data_scv/
```

Puede utilizar phpMyAdmin, MySQL Workbench o la línea de comandos de MySQL.

### 3. Configurar y ejecutar el Backend

Ingresar a la carpeta del servidor:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz de la carpeta `backend` con la siguiente estructura:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_PORT=3306
DB_NAME=diresa_epidemiologia
```

Iniciar el servidor:

```bash
npm run dev
```

Por defecto, el backend se ejecutará en:

```text
http://localhost:5000
```

### 4. Configurar y ejecutar el Frontend Administrador

Ingresar a la carpeta:

```bash
cd admin
```

Instalar dependencias:

```bash
npm install
```

Modificar el archivo:

```text
src/auth/constants.jsx
```

Configurando la URL de la API:

```javascript
export const API_URL = "http://localhost:5000/api";
```

Iniciar la aplicación:

```bash
npm start
```

### 5. Configurar y ejecutar el Frontend Usuario

Ingresar a la carpeta:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Modificar el archivo:

```text
src/auth/constants.jsx
```

Configurando la URL de la API:

```javascript
export const API_URL = "http://localhost:5000/api";
```

Iniciar la aplicación:

```bash
npm start
```

### 6. Acceso al Sistema

Una vez ejecutados los tres componentes (backend, administrador y cliente), el sistema estará disponible en:

```text
Frontend Usuario:      http://localhost:3000
Frontend Administrador: http://localhost:3001
Backend API:           http://localhost:5000
```

> Los puertos pueden variar según la configuración del entorno de desarrollo.
