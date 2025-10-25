# 🚗 GoDrive - Sistema de Gestión de Viajes

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

Proyecto académico full-stack que implementa un sistema completo de gestión de viajes estilo Uber/InDriver, desarrollado con **TypeScript** y **Programación Orientada a Objetos**.

---

## 📋 Descripción

**GoDrive** es una aplicación web completa que simula una plataforma de gestión de viajes compartidos, implementando:

- 🎯 **Backend API REST** con Express, TypeScript y MongoDB Atlas
- 🌐 **Frontend responsivo** con HTML5, CSS3 y JavaScript
- 🗄️ **Persistencia real** con MongoDB Atlas (cloud database)
- 🧬 **POO completa**: Herencia, Encapsulación, Abstracción y Polimorfismo
- 🗺️ **Geolocalización** con OpenStreetMap y Leaflet
- 🎨 **UI/UX profesional** con modo oscuro y diseño responsivo

---

## 🎯 Características Principales

### Backend

- ✅ **26 endpoints RESTful** completamente funcionales
- ✅ **Arquitectura POO** con clases, herencia e interfaces
- ✅ **Persistencia con MongoDB Atlas** (cloud database)
- ✅ **Patrón Singleton** para manejo de base de datos
- ✅ **Gestión completa de usuarios** (Conductores, Pasajeros, Administradores)
- ✅ **Sistema de viajes** con estados y seguimiento
- ✅ **Manejo de errores robusto**

### Frontend

- ✅ **Interfaz responsiva** (Desktop, Tablet, Mobile)
- ✅ **Modo oscuro/claro** con persistencia en localStorage
- ✅ **Mini-mapas interactivos** con OpenStreetMap
- ✅ **Actualización en tiempo real** de estadísticas
- ✅ **Visualización de ubicaciones** de conductores y pasajeros
- ✅ **Dashboard completo** con estadísticas y métricas

### Funcionalidades del Sistema

- 👥 **Gestión de usuarios** por roles (Driver, Passenger, Administrator)
- 🗺️ **Creación y seguimiento de viajes** con origen/destino
- 📍 **Geolocalización en tiempo real** de conductores
- ⭐ **Sistema de calificaciones** bidireccional
- 💰 **Gestión de pagos** (efectivo, tarjeta, billetera)
- 📊 **Estadísticas y analytics** en tiempo real
- 🚗 **Disponibilidad de conductores** con estados
- 💳 **Billetera virtual** para pasajeros

---

## 🏗️ Arquitectura del Proyecto

```
godrive-typescript-project/
├── src/
│   ├── interfaces/
│   │   └── index.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Driver.ts
│   │   ├── Passenger.ts
│   │   ├── Administrator.ts
│   │   └── Ride.ts
│   ├── backend/
│   │   ├── mongoDatabase.ts
│   │   ├── rideService.ts
│   │   └── server.ts
│   └── frontend/
│       └── app.ts
├── public/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── dist/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.frontend.json
└── README.md

```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 20.x o superior
- MongoDB Atlas account (gratuito)
- npm o yarn

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/godrive-typescript.git
cd godrive-typescript
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/godrive?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

### Paso 4: Compilar TypeScript

```bash
npm run build
```

### Paso 5: Iniciar el servidor

```bash
# Desarrollo (con ts-node)
npm run dev

# Producción (código compilado)
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

---

## 📡 API Endpoints

### Estadísticas

- `GET /api/statistics` - Obtener estadísticas generales del sistema

### Usuarios

- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `DELETE /api/users/:id` - Eliminar usuario específico
- `DELETE /api/users` - Eliminar todos los usuarios

### Conductores

- `POST /api/drivers` - Crear nuevo conductor
- `GET /api/drivers` - Listar todos los conductores
- `GET /api/drivers/available` - Listar conductores disponibles
- `PUT /api/drivers/:id/location` - Actualizar ubicación del conductor
- `PUT /api/drivers/:id/availability` - Cambiar disponibilidad del conductor
- `POST /api/drivers/:id/ratings` - Agregar calificación al conductor
- `GET /api/drivers/:id/rides` - Obtener viajes del conductor

### Pasajeros

- `POST /api/passengers` - Crear nuevo pasajero
- `GET /api/passengers` - Listar todos los pasajeros
- `POST /api/passengers/:id/add-funds` - Agregar fondos a la billetera
- `POST /api/passengers/:id/favorite-drivers` - Agregar conductor a favoritos
- `GET /api/passengers/:id/rides` - Obtener viajes del pasajero
- `PUT /api/passengers/:id/location` - Actualizar ubicación del pasajero

### Administradores

- `POST /api/administrators` - Crear nuevo administrador

### Viajes

- `POST /api/rides` - Crear nuevo viaje
- `GET /api/rides` - Listar todos los viajes
- `GET /api/rides/available` - Listar viajes disponibles para conductores
- `GET /api/rides/:id` - Obtener viaje por ID
- `POST /api/rides/:id/accept` - Conductor acepta el viaje
- `POST /api/rides/:id/start` - Iniciar el viaje
- `POST /api/rides/:id/complete` - Completar el viaje
- `POST /api/rides/:id/cancel` - Cancelar el viaje

---

## 🧪 Pruebas con Postman

### Ejemplos de uso:

**1. Crear conductor:**

```json
POST http://localhost:3000/api/drivers
Content-Type: application/json

{
  "id": "DRV001",
  "firstName": "Carlos",
  "lastName": "Ramirez",
  "email": "carlos@godrive.com",
  "contact": {
    "email": "carlos@godrive.com",
    "phone": "+57 300 123 4567",
    "address": {
      "street": "Calle 100 #15-20",
      "city": "Bogotá",
      "country": "Colombia",
      "zipCode": "110111"
    }
  },
  "driverId": "DRV-2024-001",
  "licenseNumber": "LIC123456",
  "vehicle": {
    "brand": "Chevrolet",
    "model": "Spark GT",
    "year": 2022,
    "plate": "ABC123",
    "color": "Blanco",
    "type": "SEDAN"
  }
}
```

**2. Actualizar ubicación del conductor:**

```json
PUT http://localhost:3000/api/drivers/DRV001/location
Content-Type: application/json

{
  "latitude": 4.7110,
  "longitude": -74.0721
}
```

**3. Crear viaje:**

```json
POST http://localhost:3000/api/rides
Content-Type: application/json

{
  "id": "RIDE001",
  "passengerId": "PSG001",
  "origin": {
    "address": "Calle 100 #15-20, Bogotá",
    "latitude": 4.6862,
    "longitude": -74.0563
  },
  "destination": {
    "address": "Aeropuerto El Dorado, Bogotá",
    "latitude": 4.7016,
    "longitude": -74.1469
  },
  "requestedPrice": 35000,
  "distance": 15.5,
  "estimatedDuration": 25
}
```

**4. Aceptar viaje (conductor):**

```json
POST http://localhost:3000/api/rides/RIDE001/accept
Content-Type: application/json

{
  "driverId": "DRV001"
}
```

---

## 🎨 Tecnologías Utilizadas

### Backend

- **TypeScript 5.3** - Lenguaje principal con tipado estático
- **Node.js 20.x** - Runtime de JavaScript
- **Express 4.18** - Framework web minimalista
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **dotenv** - Gestión de variables de entorno

### Frontend

- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS, Grid y Flexbox
- **JavaScript (Vanilla)** - Lógica del cliente
- **Leaflet 1.9** - Biblioteca de mapas interactivos
- **OpenStreetMap** - Proveedor de mapas gratuito

### Herramientas de Desarrollo

- **ts-node** - Ejecución directa de TypeScript
- **TypeScript Compiler (tsc)** - Compilador oficial
- **Postman** - Testing de API REST
- **Git** - Control de versiones

---

## 📚 Conceptos de POO Implementados

### 1. Herencia

```typescript
// Clase base abstracta
abstract class User {
  protected id: string;
  protected firstName: string;
  protected lastName: string;
  // ...
}

// Clases derivadas
class Driver extends User { }
class Passenger extends User { }
class Administrator extends User { }
```

### 2. Encapsulación

```typescript
class Driver extends User {
  private driverId: string;              // Privado - solo accesible internamente
  protected contact: IContact;           // Protegido - accesible en subclases
  public getDriverId(): string {         // Público - accesible desde cualquier lugar
    return this.driverId;
  }
}
```

### 3. Polimorfismo

```typescript
// Mismo método, comportamiento diferente según la clase
const users: User[] = [driver, passenger, administrator];

users.forEach(user => {
  console.log(user.displayInfo());  // Cada clase implementa displayInfo() de manera diferente
});
```

### 4. Abstracción

```typescript
abstract class User {
  abstract displayInfo(): string;  // Método abstracto - debe ser implementado por subclases
  abstract getRole(): string;
}
```

### 5. Interfaces y Types

```typescript
// Interface para contratos
interface IVehicle {
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: VehicleType;
}

// Type para uniones
type VehicleType = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'VAN';

// Enum para constantes
enum RideStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
```

### 6. Patrón Singleton

```typescript
class MongoDatabase {
  private static instance: MongoDatabase;
  
  private constructor() { }  // Constructor privado
  
  public static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }
}
```

---

## 📊 Modelo de Datos (MongoDB)

### Colección: users

```javascript
{
  "_id": ObjectId("..."),
  "id": "DRV001",
  "firstName": "Carlos",
  "lastName": "Ramirez",
  "email": "carlos@godrive.com",
  "role": "DRIVER",
  "contact": {
    "email": "carlos@godrive.com",
    "phone": "+57 300 123 4567",
    "address": {
      "street": "Calle 100 #15-20",
      "city": "Bogotá",
      "country": "Colombia",
      "zipCode": "110111"
    }
  },
  "driverId": "DRV-2024-001",
  "licenseNumber": "LIC123456",
  "vehicle": {
    "brand": "Chevrolet",
    "model": "Spark GT",
    "year": 2022,
    "plate": "ABC123",
    "color": "Blanco",
    "type": "SEDAN"
  },
  "currentLocation": {
    "latitude": 4.7110,
    "longitude": -74.0721
  },
  "availableForRides": true,
  "totalRides": 45,
  "earnings": 1250000,
  "averageRating": 4.8,
  "ratings": [
    {
      "rideId": "RIDE-001",
      "rating": 5,
      "comment": "Excelente conductor",
      "date": "2025-10-20T10:30:00.000Z"
    }
  ]
}
```

### Colección: rides

```javascript
{
  "_id": ObjectId("..."),
  "id": "RIDE001",
  "passengerId": "PSG001",
  "driverId": "DRV001",
  "status": "COMPLETED",
  "origin": {
    "address": "Calle 100 #15-20, Bogotá",
    "latitude": 4.6862,
    "longitude": -74.0563
  },
  "destination": {
    "address": "Aeropuerto El Dorado, Bogotá",
    "latitude": 4.7016,
    "longitude": -74.1469
  },
  "requestedPrice": 35000,
  "finalPrice": 35000,
  "distance": 15.5,
  "estimatedDuration": 25,
  "payment": {
    "method": "CASH",
    "amount": 35000,
    "currency": "COP",
    "date": "2025-10-24T22:00:00.000Z"
  },
  "createdAt": "2025-10-24T20:30:00.000Z",
  "updatedAt": "2025-10-24T22:00:00.000Z"
}
```

---

## 🎓 Requisitos Académicos Cumplidos

### Migración a TypeScript ✅

- [X] Todo el backend desarrollado en TypeScript
- [X] Tipado estático en todas las funciones y variables
- [X] Uso de interfaces y types personalizados
- [X] Enums para constantes y estados

### Programación Orientada a Objetos ✅

- [X] **Herencia**: User → Driver, Passenger, Administrator
- [X] **Encapsulación**: Modificadores private, protected, public
- [X] **Polimorfismo**: Métodos sobrescritos en clases derivadas
- [X] **Abstracción**: Clase abstracta User con métodos abstractos
- [X] **Interfaces**: IVehicle, ILocation, IContact, IRating, IPayment

### Patrones de Diseño ✅

- [X] **Singleton**: MongoDatabase para conexión única
- [X] **Repository**: Separación de lógica de datos

### API REST ✅

- [X] 26 endpoints completamente funcionales
- [X] Manejo correcto de códigos HTTP
- [X] Validación de datos de entrada
- [X] Manejo robusto de errores

### Base de Datos ✅

- [X] MongoDB Atlas (persistencia real en la nube)
- [X] 2 colecciones: users y rides
- [X] Operaciones CRUD completas

### Frontend ✅

- [X] Interfaz web interactiva y responsive
- [X] Dashboard con estadísticas en tiempo real
- [X] Visualización de datos con mapas (Leaflet + OpenStreetMap)
- [X] Modo oscuro/claro
- [X] Diseño UX/UI profesional

### Documentación ✅

- [X] README completo
- [X] Comentarios en código
- [X] Ejemplos de uso con Postman
- [X] Diagramas de arquitectura

---

## 🚀 Mejoras Futuras

- [ ] Autenticación JWT y autorización por roles
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Sistema de pagos integrado (Stripe/PayU)
- [ ] App móvil con React Native o Flutter
- [ ] Panel de administración avanzado con gráficos
- [ ] Reportes y exportación de datos a PDF/Excel
- [ ] Integración con Google Maps API
- [ ] Sistema de promociones y cupones
- [ ] Chat en tiempo real conductor-pasajero
- [ ] Historial de viajes con filtros avanzados

---

---

## 👨‍💻 Autor

**Juan Esteban Vargas Gonzalez**

- Universidad: Universidad Pedagogica y Tecnologica de Colombia
- Materia: Electiva II - Desarrollo Web
- Semestre: 2025-2
- Profesor: Jairo Armando Riaño

---

## 📸 Screenshots

### Dashboard Principal

![Dashboard](docs/screenshots/dashboard.png)
*Vista general con estadísticas del sistema*

### Lista de Conductores con Geolocalización

![Conductores](docs/screenshots/drivers.png)
*Conductores con mini-mapas mostrando su ubicación actual*

### Gestión de Viajes

![Viajes](docs/screenshots/rides.png)
*Panel de viajes con estados y detalles completos*

### Modo Oscuro

![Dark Mode](docs/screenshots/dark-mode.png)
*Interfaz con tema oscuro activado*
