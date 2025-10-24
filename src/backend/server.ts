import express, { Request, Response } from 'express';
import path from 'path';
import type {
  IContact,
  IPayment,
  IRating,
  IRideLocation,
  IVehicle
} from '../interfaces/index';
import { Database } from './database';
import { RideService } from './rideService';

const app = express();
const port = 3000;
const rideService = new RideService();

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../../public')));

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../public/app.html'));
});

// ============================================
// ESTADÍSTICAS
// ============================================

app.get('/api/statistics', (req: Request, res: Response) => {
  try {
    const stats = rideService.getSystemStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================
// USUARIOS GENERALES
// ============================================

app.get('/api/users', (req: Request, res: Response) => {
  try {
    const users = rideService.listAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = rideService.getUserInfo(id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = Database.getInstance();
    const deleted = db.deleteUser(id);
    
    if (deleted) {
      res.json({ message: 'Usuario eliminado exitosamente', id });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.delete('/api/users', (req: Request, res: Response) => {
  try {
    const db = Database.getInstance();
    const users = db.getAllUsers();
    const count = users.length;
    users.forEach(user => db.deleteUser(user.getId()));
    res.json({ message: 'Todos los usuarios eliminados', count });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================
// CONDUCTORES (DRIVERS)
// ============================================

app.post('/api/drivers', (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, email, contact, driverId, licenseNumber, vehicle } = req.body;
    
    if (!id || !firstName || !lastName || !email || !contact || !driverId || !licenseNumber || !vehicle) {
      res.status(400).json({ error: 'Faltan campos requeridos' });
      return;
    }

    const driver = rideService.createDriver(
      id,
      firstName,
      lastName,
      email,
      contact as IContact,
      driverId,
      licenseNumber,
      vehicle as IVehicle
    );
    
    res.status(201).json({
      message: 'Conductor creado exitosamente',
      data: driver.getDisplayInfo()
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/drivers', (req: Request, res: Response) => {
  try {
    const drivers = rideService.listAllDrivers();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/drivers/available', (req: Request, res: Response) => {
  try {
    const drivers = rideService.listAvailableDrivers();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.put('/api/drivers/:id/location', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    
    if (latitude === undefined || longitude === undefined) {
      res.status(400).json({ error: 'Se requieren latitud y longitud' });
      return;
    }

    rideService.updateDriverLocation(id, latitude, longitude);
    res.json({ message: 'Ubicación actualizada exitosamente' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.put('/api/drivers/:id/availability', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    
    if (available === undefined) {
      res.status(400).json({ error: 'Se requiere el campo available' });
      return;
    }

    rideService.setDriverAvailability(id, available);
    res.json({ message: 'Disponibilidad actualizada exitosamente', available });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/drivers/:id/ratings', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rating = req.body as IRating;
    
    if (!rating.rideId || !rating.rating || !rating.comment) {
      res.status(400).json({ error: 'Faltan campos requeridos de la calificación' });
      return;
    }

    rideService.rateDriver(id, rating);
    res.json({ message: 'Calificación agregada exitosamente', rating: rating.rating });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// ============================================
// PASAJEROS (PASSENGERS)
// ============================================

app.post('/api/passengers', (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, email, contact, passengerId } = req.body;
    
    if (!id || !firstName || !lastName || !email || !contact || !passengerId) {
      res.status(400).json({ error: 'Faltan campos requeridos' });
      return;
    }

    const passenger = rideService.createPassenger(
      id,
      firstName,
      lastName,
      email,
      contact as IContact,
      passengerId
    );
    
    res.status(201).json({
      message: 'Pasajero creado exitosamente',
      data: passenger.getDisplayInfo()
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/passengers', (req: Request, res: Response) => {
  try {
    const passengers = rideService.listAllPassengers();
    res.json(passengers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/passengers/:id/add-funds', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'El monto debe ser mayor a 0' });
      return;
    }

    rideService.addFundsToPassenger(id, amount);
    res.json({ message: 'Fondos agregados exitosamente', amount });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/passengers/:id/favorite-drivers', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;
    
    if (!driverId) {
      res.status(400).json({ error: 'Se requiere el ID del conductor' });
      return;
    }

    rideService.addFavoriteDriver(id, driverId);
    res.json({ message: 'Conductor agregado a favoritos', driverId });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// ============================================
// ADMINISTRADORES
// ============================================

app.post('/api/administrators', (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, email, contact, adminId, department, accessLevel } = req.body;
    
    if (!id || !firstName || !lastName || !email || !contact || !adminId || !department) {
      res.status(400).json({ error: 'Faltan campos requeridos' });
      return;
    }

    const admin = rideService.createAdministrator(
      id,
      firstName,
      lastName,
      email,
      contact as IContact,
      adminId,
      department,
      accessLevel || 2
    );
    
    res.status(201).json({
      message: 'Administrador creado exitosamente',
      data: admin.getDisplayInfo()
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// ============================================
// VIAJES (RIDES)
// ============================================

app.post('/api/rides', (req: Request, res: Response) => {
  try {
    const { id, passengerId, origin, destination, requestedPrice, distance, estimatedDuration } = req.body;
    
    if (!id || !passengerId || !origin || !destination || !requestedPrice || !distance || !estimatedDuration) {
      res.status(400).json({ error: 'Faltan campos requeridos' });
      return;
    }

    const ride = rideService.createRide(
      id,
      passengerId,
      origin as IRideLocation,
      destination as IRideLocation,
      requestedPrice,
      distance,
      estimatedDuration
    );
    
    res.status(201).json({
      message: 'Viaje creado exitosamente',
      data: ride.toJSON()
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/rides', (req: Request, res: Response) => {
  try {
    const rides = rideService.listAllRides();
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/rides/available', (req: Request, res: Response) => {
  try {
    const rides = rideService.listAvailableRides();
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/rides/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ride = rideService.getRideInfo(id);
    if (!ride) {
      res.status(404).json({ error: 'Viaje no encontrado' });
      return;
    }
    res.json(ride);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/rides/:id/accept', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;
    
    if (!driverId) {
      res.status(400).json({ error: 'Se requiere el ID del conductor' });
      return;
    }

    rideService.acceptRide(id, driverId);
    res.json({ message: 'Viaje aceptado exitosamente', driverId });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/rides/:id/start', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    rideService.startRide(id);
    res.json({ message: 'Viaje iniciado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/rides/:id/complete', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { finalPrice, payment } = req.body;
    
    if (!finalPrice || !payment) {
      res.status(400).json({ error: 'Se requieren finalPrice y payment' });
      return;
    }

    rideService.completeRide(id, finalPrice, payment as IPayment);
    res.json({ message: 'Viaje completado exitosamente', finalPrice });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/rides/:id/cancel', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    rideService.cancelRide(id, reason);
    res.json({ message: 'Viaje cancelado', reason: reason || 'Sin razón especificada' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/passengers/:id/rides', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rides = rideService.listRidesByPassenger(id);
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/drivers/:id/rides', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rides = rideService.listRidesByDriver(id);
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================
// MANEJO DE ERRORES
// ============================================

app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(port, () => {
  console.log('================================================');
  console.log('🚗 INDRIVER - Sistema de Gestión de Viajes');
  console.log('================================================');
  console.log('🚀 Servidor ejecutándose en http://localhost:' + port);
  console.log('✅ TypeScript con POO implementado');
  console.log('📡 API REST disponible');
  console.log('🌐 Frontend en http://localhost:' + port);
  console.log('================================================');
  console.log('\n📋 Endpoints - Usuarios:');
  console.log('  GET    /api/statistics');
  console.log('  GET    /api/users');
  console.log('  GET    /api/users/:id');
  console.log('  DELETE /api/users/:id');
  console.log('  DELETE /api/users');
  console.log('\n📋 Endpoints - Conductores:');
  console.log('  POST   /api/drivers');
  console.log('  GET    /api/drivers');
  console.log('  GET    /api/drivers/available');
  console.log('  PUT    /api/drivers/:id/location');
  console.log('  PUT    /api/drivers/:id/availability');
  console.log('  POST   /api/drivers/:id/ratings');
  console.log('  GET    /api/drivers/:id/rides');
  console.log('\n📋 Endpoints - Pasajeros:');
  console.log('  POST   /api/passengers');
  console.log('  GET    /api/passengers');
  console.log('  POST   /api/passengers/:id/add-funds');
  console.log('  POST   /api/passengers/:id/favorite-drivers');
  console.log('  GET    /api/passengers/:id/rides');
  console.log('\n📋 Endpoints - Administradores:');
  console.log('  POST   /api/administrators');
  console.log('\n📋 Endpoints - Viajes:');
  console.log('  POST   /api/rides');
  console.log('  GET    /api/rides');
  console.log('  GET    /api/rides/available');
  console.log('  GET    /api/rides/:id');
  console.log('  POST   /api/rides/:id/accept');
  console.log('  POST   /api/rides/:id/start');
  console.log('  POST   /api/rides/:id/complete');
  console.log('  POST   /api/rides/:id/cancel');
  console.log('\n💡 Usa Postman para probar los endpoints');
  console.log('================================================\n');
});
