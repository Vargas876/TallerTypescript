# 🚗Sistema de Gestión de Viajes

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey)

Proyecto académico de migración a TypeScript que implementa un sistema completo de gestión de viajes estilo InDriver, demostrando el uso de Programación Orientada a Objetos (POO) con TypeScript.

## 📋 Descripción

Este proyecto es una aplicación web full-stack que simula el funcionamiento de InDriver, implementando:

- **Backend API REST** con Express y TypeScript
- **Frontend** con componentes TypeScript
- **Base de datos en memoria** con patrón Singleton
- **POO completa**: Herencia, Encapsulación, Abstracción y Polimorfismo
- **Sistema de viajes** con conductores, pasajeros y administradores

## 🎯 Características Principales

### Backend

- ✅ API REST completa con TypeScript
- ✅ Clases con herencia (User → Driver, Passenger, Administrator)
- ✅ Interfaces y Enums para tipado fuerte
- ✅ Patrón Singleton para la base de datos
- ✅ Gestión completa del ciclo de vida de viajes

### Frontend

- ✅ Componentes reutilizables en TypeScript
- ✅ Vistas específicas por tipo de usuario
- ✅ Interfaz web responsive
- ✅ Actualización automática de datos

### Funcionalidades

- 👥 Gestión de usuarios (Conductores, Pasajeros, Administradores)
- 🗺️ Creación y seguimiento de viajes
- ⭐ Sistema de calificaciones
- 💰 Gestión de pagos y billetera
- 📊 Estadísticas en tiempo real
- 📍 Geolocalización de conductores

## 🏗️ Estructura del Proyecto

typescript-indriver-project/
├── src/
│ ├── interfaces/
│ │ └── index.ts # Interfaces, Types y Enums
│ ├── models/
│ │ ├── User.ts # Clase abstracta base
│ │ ├── Driver.ts # Clase Conductor
│ │ ├── Passenger.ts # Clase Pasajero
│ │ ├── Administrator.ts # Clase Administrador
│ │ └── Ride.ts # Clase Viaje
│ ├── backend/
│ │ ├── database.ts # Base de datos (Singleton)
│ │ ├── rideService.ts # Lógica de negocio
│ │ └── server.ts # Servidor Express
│ └── frontend/
│ ├── components/
│ │ ├── UserList.ts # Componente lista usuarios
│ │ └── RideList.ts # Componente lista viajes
│ ├── views/
│ │ ├── DriverView.ts # Vista conductor
│ │ └── PassengerView.ts # Vista pasajero
│ └── main.ts # Aplicación principal
├── public/
│ └── app.html # Interfaz web
├── dist/ # Código compilado
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
