import type {
  IContact,
  IPayment,
  IRating,
  IRideLocation,
  IVehicle
} from '../interfaces/index';
import { MongoDatabase } from './mongoDatabase';

export class RideService {
  private db: MongoDatabase;

  constructor() {
    this.db = MongoDatabase.getInstance();
  }

  // ============================================
  // GESTIÓN DE CONDUCTORES
  // ============================================

  public async createDriver(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    driverId: string,
    licenseNumber: string,
    vehicle: IVehicle
  ): Promise<any> {
    const driverData = {
      id,
      firstName,
      lastName,
      email,
      contact,
      role: 'DRIVER',
      driverId,
      licenseNumber,
      vehicle,
      ratings: [],
      totalRides: 0,
      availableForRides: true,
      earnings: 0,
      isActive: true
    };
    
    await this.db.createUser(driverData);
    return driverData;
  }

  public async updateDriverLocation(driverId: string, latitude: number, longitude: number): Promise<void> {
    const driver = await this.db.getUserById(driverId);
    if (!driver || driver.role !== 'DRIVER') {
      throw new Error('Conductor no encontrado');
    }
    
    await this.db.updateUser(driverId, {
      currentLocation: { latitude, longitude }
    });
  }

  public async setDriverAvailability(driverId: string, available: boolean): Promise<void> {
    const driver = await this.db.getUserById(driverId);
    if (!driver || driver.role !== 'DRIVER') {
      throw new Error('Conductor no encontrado');
    }
    
    await this.db.updateUser(driverId, {
      availableForRides: available
    });
  }

  public async rateDriver(driverId: string, rating: IRating): Promise<void> {
    const driver = await this.db.getUserById(driverId);
    if (!driver || driver.role !== 'DRIVER') {
      throw new Error('Conductor no encontrado');
    }
    
    const ratings = [...(driver.ratings || []), rating];
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    await this.db.updateUser(driverId, {
      ratings,
      averageRating: avgRating
    });
  }

  // ============================================
  // GESTIÓN DE PASAJEROS
  // ============================================

  public async createPassenger(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    passengerId: string
  ): Promise<any> {
    const passengerData = {
      id,
      firstName,
      lastName,
      email,
      contact,
      role: 'PASSENGER',
      passengerId,
      ratings: [],
      ridesCount: 0,
      favoriteDrivers: [],
      paymentHistory: [],
      walletBalance: 0,
      isActive: true
    };
    
    await this.db.createUser(passengerData);
    return passengerData;
  }

  public async addFundsToPassenger(passengerId: string, amount: number): Promise<void> {
    const passenger = await this.db.getUserById(passengerId);
    if (!passenger || passenger.role !== 'PASSENGER') {
      throw new Error('Pasajero no encontrado');
    }
    
    await this.db.updateUser(passengerId, {
      walletBalance: (passenger.walletBalance || 0) + amount
    });
  }

  public async addFavoriteDriver(passengerId: string, driverId: string): Promise<void> {
    const passenger = await this.db.getUserById(passengerId);
    if (!passenger || passenger.role !== 'PASSENGER') {
      throw new Error('Pasajero no encontrado');
    }
    
    const favoriteDrivers = [...(passenger.favoriteDrivers || [])];
    if (!favoriteDrivers.includes(driverId)) {
      favoriteDrivers.push(driverId);
      await this.db.updateUser(passengerId, { favoriteDrivers });
    }
  }

  // ============================================
  // GESTIÓN DE ADMINISTRADORES
  // ============================================

  public async createAdministrator(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    adminId: string,
    department: string,
    accessLevel: number = 2
  ): Promise<any> {
    const adminData = {
      id,
      firstName,
      lastName,
      email,
      contact,
      role: 'ADMINISTRATOR',
      adminId,
      department,
      accessLevel,
      managedCities: [],
      isActive: true
    };
    
    await this.db.createUser(adminData);
    return adminData;
  }

  // ============================================
  // GESTIÓN DE VIAJES
  // ============================================

  public async createRide(
    id: string,
    passengerId: string,
    origin: IRideLocation,
    destination: IRideLocation,
    requestedPrice: number,
    distance: number,
    estimatedDuration: number
  ): Promise<any> {
    const passenger = await this.db.getUserById(passengerId);
    if (!passenger || passenger.role !== 'PASSENGER') {
      throw new Error('Pasajero no encontrado');
    }

    const rideData = {
      id,
      passengerId,
      origin,
      destination,
      status: 'REQUESTED',
      requestedPrice,
      distance,
      estimatedDuration
    };
    
    await this.db.createRide(rideData);
    return rideData;
  }

  public async acceptRide(rideId: string, driverId: string): Promise<void> {
    const ride = await this.db.getRideById(rideId);
    if (!ride) throw new Error('Viaje no encontrado');
    if (ride.status !== 'REQUESTED') throw new Error('El viaje ya fue aceptado');

    const driver = await this.db.getUserById(driverId);
    if (!driver || driver.role !== 'DRIVER') throw new Error('Conductor no encontrado');

    await this.db.updateRide(rideId, {
      driverId,
      status: 'ACCEPTED'
    });
  }

  public async startRide(rideId: string): Promise<void> {
    const ride = await this.db.getRideById(rideId);
    if (!ride) throw new Error('Viaje no encontrado');
    if (ride.status !== 'ACCEPTED') throw new Error('El viaje debe ser aceptado primero');

    await this.db.updateRide(rideId, {
      status: 'IN_PROGRESS',
      startedAt: new Date()
    });
  }

  public async completeRide(rideId: string, finalPrice: number, payment: IPayment): Promise<void> {
    const ride = await this.db.getRideById(rideId);
    if (!ride) throw new Error('Viaje no encontrado');
    if (ride.status !== 'IN_PROGRESS') throw new Error('El viaje debe estar en progreso');

    await this.db.updateRide(rideId, {
      status: 'COMPLETED',
      finalPrice,
      payment,
      completedAt: new Date()
    });

    // Actualizar conductor
    if (ride.driverId) {
      const driver = await this.db.getUserById(ride.driverId);
      if (driver) {
        await this.db.updateUser(ride.driverId, {
          totalRides: (driver.totalRides || 0) + 1,
          earnings: (driver.earnings || 0) + finalPrice
        });
      }
    }

    // Actualizar pasajero
    const passenger = await this.db.getUserById(ride.passengerId);
    if (passenger) {
      const paymentHistory = [...(passenger.paymentHistory || []), payment];
      await this.db.updateUser(ride.passengerId, {
        ridesCount: (passenger.ridesCount || 0) + 1,
        paymentHistory,
        walletBalance: payment.method === 'WALLET' 
          ? (passenger.walletBalance || 0) - payment.amount 
          : passenger.walletBalance
      });
    }
  }

  public async cancelRide(rideId: string, reason?: string): Promise<void> {
    const ride = await this.db.getRideById(rideId);
    if (!ride) throw new Error('Viaje no encontrado');
    if (ride.status === 'COMPLETED') throw new Error('No se puede cancelar un viaje completado');

    await this.db.updateRide(rideId, {
      status: 'CANCELLED',
      notes: reason
    });
  }

  // ============================================
  // CONSULTAS
  // ============================================

  public async getUserInfo(userId: string): Promise<any | null> {
    return await this.db.getUserById(userId);
  }

  public async listAllUsers(): Promise<any[]> {
    return await this.db.getAllUsers();
  }

  public async listAllDrivers(): Promise<any[]> {
    return await this.db.getUsersByRole('DRIVER');
  }

  public async listAllPassengers(): Promise<any[]> {
    return await this.db.getUsersByRole('PASSENGER');
  }

  public async listAvailableDrivers(): Promise<any[]> {
    const drivers = await this.db.getUsersByRole('DRIVER');
    return drivers.filter(d => d.availableForRides);
  }

  public async getRideInfo(rideId: string): Promise<any | null> {
    return await this.db.getRideById(rideId);
  }

  public async listAllRides(): Promise<any[]> {
    return await this.db.getAllRides();
  }

  public async listRidesByPassenger(passengerId: string): Promise<any[]> {
    return await this.db.getRidesByPassenger(passengerId);
  }

  public async listRidesByDriver(driverId: string): Promise<any[]> {
    return await this.db.getRidesByDriver(driverId);
  }

  public async listAvailableRides(): Promise<any[]> {
    return await this.db.getRidesByStatus('REQUESTED');
  }

  public async getSystemStatistics(): Promise<any> {
    return await this.db.getStatistics();
  }
}
