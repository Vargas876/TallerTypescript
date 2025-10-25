import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import type {
  IRating
} from '../interfaces/index';
import { MongoDatabase } from './mongoDatabase';
import { RideService } from './rideService';

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const rideService = new RideService();
const mongoDb = MongoDatabase.getInstance();

// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());

// CORS - Permitir todas las peticiones
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../../public')));

// ============================================
// RUTA PRINCIPAL
// ============================================

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// ============================================
// ESTADÍSTICAS
// ============================================

app.get('/api/statistics', async (req: Request, res: Response) => {
  try {
    const stats = await rideService.getSystemStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas',
      message: (error as Error).message 
    });
  }
});

// ============================================
// USUARIOS GENERALES
// ============================================

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await rideService.listAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ 
      error: 'Error al listar usuarios',
      message: (error as Error).message 
    });
  }
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await rideService.getUserInfo(id);
    
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener usuario',
      message: (error as Error).message 
    });
  }
});

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await mongoDb.deleteUser(id);
    
    if (deleted) {
      res.json({ 
        message: 'Usuario eliminado exitosamente', 
        id,
        success: true 
      });
    } else {
      res.status(404).json({ 
        error: 'Usuario no encontrado',
        success: false 
      });
    }
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ 
      error: 'Error al eliminar usuario',
      message: (error as Error).message 
    });
  }
});

app.delete('/api/users', async (req: Request, res: Response) => {
  try {
    const count = await mongoDb.deleteAllUsers();
    res.json({ 
      message: 'Todos los usuarios eliminados', 
      count,
      success: true 
    });
  } catch (error) {
    console.error('Error eliminando usuarios:', error);
    res.status(500).json({ 
      error: 'Error al eliminar usuarios',
      message: (error as Error).message 
    });
  }
});

// ============================================
// CONDUCTORES
// ============================================

app.post('/api/drivers', async (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, email, contact, driverId, licenseNumber, vehicle } = req.body;
    
    // Validaciones
    if (!id || !firstName || !lastName || !email || !driverId || !licenseNumber || !vehicle) {
      res.status(400).json({ 
        error: 'Faltan campos requeridos',
        required: ['id', 'firstName', 'lastName', 'email', 'driverId', 'licenseNumber', 'vehicle']
      });
      return;
    }
    
    const driver = await rideService.createDriver(
      id, firstName, lastName, email, contact, driverId, licenseNumber, vehicle
    );
    
    res.status(201).json({ 
      message: 'Conductor creado exitosamente', 
      driver 
    });
  } catch (error) {
    console.error('Error creando conductor:', error);
    res.status(500).json({ 
      error: 'Error al crear conductor',
      message: (error as Error).message 
    });
  }
});

app.get('/api/drivers', async (req: Request, res: Response) => {
  try {
    const drivers = await rideService.listAllDrivers();
    res.json(drivers);
  } catch (error) {
    console.error('Error listando conductores:', error);
    res.status(500).json({ 
      error: 'Error al listar conductores',
      message: (error as Error).message 
    });
  }
});

app.get('/api/drivers/available', async (req: Request, res: Response) => {
  try {
    const drivers = await rideService.listAvailableDrivers();
    res.json(drivers);
  } catch (error) {
    console.error('Error listando conductores disponibles:', error);
    res.status(500).json({ 
      error: 'Error al listar conductores disponibles',
      message: (error as Error).message 
    });
  }
});

app.put('/api/drivers/:id/location', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    
    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({ 
        error: 'Se requieren latitude y longitude' 
      });
      return;
    }
    
    await rideService.updateDriverLocation(id, latitude, longitude);
    res.json({ 
      message: 'Ubicación actualizada', 
      location: { latitude, longitude } 
    });
  } catch (error) {
    console.error('Error actualizando ubicación:', error);
    res.status(500).json({ 
      error: 'Error al actualizar ubicación',
      message: (error as Error).message 
    });
  }
});

app.put('/api/drivers/:id/availability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    
    if (typeof available !== 'boolean') {
      res.status(400).json({ 
        error: 'El campo available debe ser un booleano' 
      });
      return;
    }
    
    await rideService.setDriverAvailability(id, available);
    res.json({ 
      message: 'Disponibilidad actualizada', 
      available 
    });
  } catch (error) {
    console.error('Error actualizando disponibilidad:', error);
    res.status(500).json({ 
      error: 'Error al actualizar disponibilidad',
      message: (error as Error).message 
    });
  }
});

app.post('/api/drivers/:id/ratings', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rating: IRating = req.body;
    
    if (!rating.rideId || !rating.rating || !rating.comment) {
      res.status(400).json({ 
        error: 'Se requieren rideId, rating y comment' 
      });
      return;
    }
    
    if (rating.rating < 1 || rating.rating > 5) {
      res.status(400).json({ 
        error: 'La calificación debe estar entre 1 y 5' 
      });
      return;
    }
    
    await rideService.rateDriver(id, rating);
    res.json({ 
      message: 'Calificación agregada exitosamente',
      rating 
    });
  } catch (error) {
    console.error('Error agregando calificación:', error);
    res.status(500).json({ 
      error: 'Error al agregar calificación',
      message: (error as Error).message 
    });
  }
});

app.get('/api/drivers/:id/rides', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rides = await rideService.listRidesByDriver(id);
    res.json(rides);
  } catch (error) {
    console.error('Error obteniendo viajes del conductor:', error);
    res.status(500).json({ 
      error: 'Error al obtener viajes del conductor',
      message: (error as Error).message 
    });
  }
});

// ============================================
// PASAJEROS
// ============================================

app.post('/api/passengers', async (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, email, contact, passengerId } = req.body;
    
    if (!id || !firstName || !lastName || !email || !passengerId) {
      res.status(400).json({ 
        error: 'Faltan campos requeridos',
        required: ['id', 'firstName', 'lastName', 'email', 'passengerId']
      });
      return;
    }
    
    const passenger = await rideService.createPassenger(
      id, firstName, lastName, email, contact, passengerId
    );
    
    res.status(201).json({ 
      message: 'Pasajero creado exitosamente', 
      passenger 
    });
  } catch (error) {
    console.error('Error creando pasajero:', error);
    res.status(500).json({ 
      error: 'Error al crear pasajero',
      message: (error as Error).message 
    });
  }
});

app.get('/api/passengers', async (req: Request, res: Response) => {
  try {
    const passengers = await rideService.listAllPassengers();
    res.json(passengers);
  } catch (error) {
    console.error('Error listando pasajeros:', error);
    res.status(500).json({ 
      error: 'Error al listar pasajeros',
      message: (error as Error).message 
    });
  }
});

app.post('/api/passengers/:id/add-funds', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      res.status(400).json({ 
        error: 'El monto debe ser mayor a 0' 
      });
      return;
    }
    
    await rideService.addFundsToPassenger(id, amount);
    res.json({ 
      message: 'Fondos agregados exitosamente', 
      amount 
    });
  } catch (error) {
    console.error('Error agregando fondos:', error);
    res.status(500).json({ 
      error: 'Error al agregar fondos',
      message: (error as Error).message 
    });
  }
});

app.post('/api/passengers/:id/favorite-drivers', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;
    
    if (!driverId) {
      res.status(400).json({ 
        error: 'Se requiere driverId' 
      });
      return;
    }
    
    await rideService.addFavoriteDriver(id, driverId);
    res.json({ 
      message: 'Conductor agregado a favoritos', 
      driverId 
    });
  } catch (error) {
    console.error('Error agregando conductor favorito:', error);
    res.status(500).json({ 
      error: 'Error al agregar conductor favorito',
      message: (error as Error).message 
    });
  }
});

app.get('/api/passengers/:id/rides', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rides = await rideService.listRidesByPassenger(id);
    res.json(rides);
  } catch (error) {
    console.error('Error obteniendo viajes del pasajero:', error);
    res.status(500).json({ 
      error: 'Error al obtener viajes del pasajero',
      message: (error as Error).message 
    });
  }
});

app.put('/api/passengers/:id/location', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    
    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({ 
        error: 'Se requieren latitude y longitude' 
      });
      return;
    }
    
    const passenger = await mongoDb.getUserById(id);
    if (!passenger || passenger.role !== 'PASSENGER') {
      res.status(404).json({ error: 'Pasajero no encontrado' });
      return;
    }
    
    await mongoDb.updateUser(id, {
      currentLocation: { latitude, longitude }
    });
    
    res.json({ 
      message: 'Ubicación actualizada', 
      location: { latitude, longitude } 
    });
  } catch (error) {
    console.error('Error actualizando ubicación:', error);
    res.status(500).json({ 
      error: 'Error al actualizar ubicación',
      message: (error as Error).message 
    });
  }
});

// ============================================
// ADMINISTRADORES
// ============================================

app.post('/api/administrators', async (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, email, contact, adminId, department, accessLevel } = req.body;
    
    if (!id || !firstName || !lastName || !email || !adminId || !department) {
      res.status(400).json({ 
        error: 'Faltan campos requeridos',
        required: ['id', 'firstName', 'lastName', 'email', 'adminId', 'department']
      });
      return;
    }
    
    const admin = await rideService.createAdministrator(
      id, firstName, lastName, email, contact, adminId, department, accessLevel || 2
    );
    
    res.status(201).json({ 
      message: 'Administrador creado exitosamente', 
      admin 
    });
  } catch (error) {
    console.error('Error creando administrador:', error);
    res.status(500).json({ 
      error: 'Error al crear administrador',
      message: (error as Error).message 
    });
  }
});

// ============================================
// VIAJES
// ============================================

app.post('/api/rides', async (req: Request, res: Response) => {
  try {
    const { id, passengerId, origin, destination, requestedPrice, distance, estimatedDuration } = req.body;
    
    if (!id || !passengerId || !origin || !destination || !requestedPrice) {
      res.status(400).json({ 
        error: 'Faltan campos requeridos',
        required: ['id', 'passengerId', 'origin', 'destination', 'requestedPrice']
      });
      return;
    }
    
    const ride = await rideService.createRide(
      id, passengerId, origin, destination, requestedPrice, distance || 0, estimatedDuration || 0
    );
    
    res.status(201).json({ 
      message: 'Viaje creado exitosamente', 
      ride 
    });
  } catch (error) {
    console.error('Error creando viaje:', error);
    res.status(500).json({ 
      error: 'Error al crear viaje',
      message: (error as Error).message 
    });
  }
});

app.get('/api/rides', async (req: Request, res: Response) => {
  try {
    const rides = await rideService.listAllRides();
    res.json(rides);
  } catch (error) {
    console.error('Error listando viajes:', error);
    res.status(500).json({ 
      error: 'Error al listar viajes',
      message: (error as Error).message 
    });
  }
});

app.get('/api/rides/available', async (req: Request, res: Response) => {
  try {
    const rides = await rideService.listAvailableRides();
    res.json(rides);
  } catch (error) {
    console.error('Error listando viajes disponibles:', error);
    res.status(500).json({ 
      error: 'Error al listar viajes disponibles',
      message: (error as Error).message 
    });
  }
});

app.get('/api/rides/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ride = await rideService.getRideInfo(id);
    
    if (!ride) {
      res.status(404).json({ error: 'Viaje no encontrado' });
      return;
    }
    
    res.json(ride);
  } catch (error) {
    console.error('Error obteniendo viaje:', error);
    res.status(500).json({ 
      error: 'Error al obtener viaje',
      message: (error as Error).message 
    });
  }
});

app.post('/api/rides/:id/accept', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;
    
    if (!driverId) {
      res.status(400).json({ 
        error: 'Se requiere driverId' 
      });
      return;
    }
    
    await rideService.acceptRide(id, driverId);
    res.json({ 
      message: 'Viaje aceptado exitosamente', 
      rideId: id, 
      driverId 
    });
  } catch (error) {
    console.error('Error aceptando viaje:', error);
    res.status(500).json({ 
      error: 'Error al aceptar viaje',
      message: (error as Error).message 
    });
  }
});

app.post('/api/rides/:id/start', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await rideService.startRide(id);
    res.json({ 
      message: 'Viaje iniciado exitosamente', 
      rideId: id 
    });
  } catch (error) {
    console.error('Error iniciando viaje:', error);
    res.status(500).json({ 
      error: 'Error al iniciar viaje',
      message: (error as Error).message 
    });
  }
});

app.post('/api/rides/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { finalPrice, payment } = req.body;
    
    if (!finalPrice || !payment) {
      res.status(400).json({ 
        error: 'Se requieren finalPrice y payment' 
      });
      return;
    }
    
    await rideService.completeRide(id, finalPrice, payment);
    res.json({ 
      message: 'Viaje completado exitosamente', 
      rideId: id,
      finalPrice 
    });
  } catch (error) {
    console.error('Error completando viaje:', error);
    res.status(500).json({ 
      error: 'Error al completar viaje',
      message: (error as Error).message 
    });
  }
});

app.post('/api/rides/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    await rideService.cancelRide(id, reason);
    res.json({ 
      message: 'Viaje cancelado', 
      rideId: id,
      reason: reason || 'No especificado'
    });
  } catch (error) {
    console.error('Error cancelando viaje:', error);
    res.status(500).json({ 
      error: 'Error al cancelar viaje',
      message: (error as Error).message 
    });
  }
});

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ============================================

app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// ============================================
// FUNCIÓN PARA INICIAR EL SERVIDOR
// ============================================

async function startServer() {
  try {
    // Conectar a MongoDB Atlas
    console.log('🔄 Conectando a MongoDB Atlas...');
    await mongoDb.connect();
    
    // Iniciar servidor Express
    app.listen(port, () => {
      console.log('\n================================================');
      console.log('🚀 GODRIVE - Sistema de Gestión de Viajes');
      console.log('================================================');
      console.log(`🌐 Servidor ejecutándose en puerto ${port}`);
      console.log(`📍 URL: http://localhost:${port}`);
      console.log('✅ TypeScript con POO implementado');
      console.log('📡 API REST disponible');
      console.log('🗄️  MongoDB Atlas conectado exitosamente');
      console.log('================================================');
      console.log('\n📋 Endpoints disponibles:');
      console.log('\n👥 Usuarios:');
      console.log('  GET    /api/statistics');
      console.log('  GET    /api/users');
      console.log('  GET    /api/users/:id');
      console.log('  DELETE /api/users/:id');
      console.log('  DELETE /api/users');
      console.log('\n🚗 Conductores:');
      console.log('  POST   /api/drivers');
      console.log('  GET    /api/drivers');
      console.log('  GET    /api/drivers/available');
      console.log('  PUT    /api/drivers/:id/location');
      console.log('  PUT    /api/drivers/:id/availability');
      console.log('  POST   /api/drivers/:id/ratings');
      console.log('  GET    /api/drivers/:id/rides');
      console.log('\n👤 Pasajeros:');
      console.log('  POST   /api/passengers');
      console.log('  GET    /api/passengers');
      console.log('  POST   /api/passengers/:id/add-funds');
      console.log('  POST   /api/passengers/:id/favorite-drivers');
      console.log('  GET    /api/passengers/:id/rides');
      console.log('\n👨‍💼 Administradores:');
      console.log('  POST   /api/administrators');
      console.log('\n🗺️  Viajes:');
      console.log('  POST   /api/rides');
      console.log('  GET    /api/rides');
      console.log('  GET    /api/rides/available');
      console.log('  GET    /api/rides/:id');
      console.log('  POST   /api/rides/:id/accept');
      console.log('  POST   /api/rides/:id/start');
      console.log('  POST   /api/rides/:id/complete');
      console.log('  POST   /api/rides/:id/cancel');
      console.log('================================================\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    console.error('💡 Verifica tu connection string de MongoDB Atlas en .env');
    process.exit(1);
  }
}

// ============================================
// MANEJO DE CIERRE GRACEFUL
// ============================================

process.on('SIGINT', async () => {
  console.log('\n\n🛑 Recibida señal de interrupción...');
  console.log('🔄 Cerrando conexiones...');
  
  try {
    await mongoDb.disconnect();
    console.log('✅ Conexiones cerradas exitosamente');
    console.log('👋 ¡Hasta pronto!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar conexiones:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Recibida señal de terminación...');
  await mongoDb.disconnect();
  process.exit(0);
});

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', promise);
  console.error('Razón:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

// ============================================
// INICIAR LA APLICACIÓN
// ============================================

startServer();

export default app;
