import type {
    IContact,
    IPayment,
    IRating,
    IRideLocation,
    IVehicle
} from '../interfaces/index';
import { Administrator } from '../models/Administrator';
import { Driver } from '../models/Driver';
import { Passenger } from '../models/Passenger';
import { Ride } from '../models/Ride';
import { Database } from './database';

/**
 * Servicio para gestionar la lógica de negocio de InDriver
 */
export class RideService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  // ============================================
  // GESTIÓN DE CONDUCTORES
  // ============================================

  public createDriver(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    driverId: string,
    licenseNumber: string,
    vehicle: IVehicle
  ): Driver {
    const driver = new Driver(
      id,
      firstName,
      lastName,
      email,
      contact,
      driverId,
      licenseNumber,
      vehicle
    );
    
    this.db.createUser(driver);
    return driver;
  }

  public updateDriverLocation(driverId: string, latitude: number, longitude: number): void {
    const user = this.db.getUserById(driverId);
    if (!user || !(user instanceof Driver)) {
      throw new Error('Conductor no encontrado');
    }
    user.updateLocation(latitude, longitude);
    this.db.updateUser(driverId, user);
  }

  public setDriverAvailability(driverId: string, available: boolean): void {
    const user = this.db.getUserById(driverId);
    if (!user || !(user instanceof Driver)) {
      throw new Error('Conductor no encontrado');
    }
    user.setAvailability(available);
    this.db.updateUser(driverId, user);
  }

  public rateDriver(driverId: string, rating: IRating): void {
    const user = this.db.getUserById(driverId);
    if (!user || !(user instanceof Driver)) {
      throw new Error('Conductor no encontrado');
    }
    user.addRating(rating);
    this.db.updateUser(driverId, user);
  }

  // ============================================
  // GESTIÓN DE PASAJEROS
  // ============================================

  public createPassenger(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    passengerId: string
  ): Passenger {
    const passenger = new Passenger(
      id,
      firstName,
      lastName,
      email,
      contact,
      passengerId
    );
    
    this.db.createUser(passenger);
    return passenger;
  }

  public addFundsToPassenger(passengerId: string, amount: number): void {
    const user = this.db.getUserById(passengerId);
    if (!user || !(user instanceof Passenger)) {
      throw new Error('Pasajero no encontrado');
    }
    user.addFunds(amount);
    this.db.updateUser(passengerId, user);
  }

  public addFavoriteDriver(passengerId: string, driverId: string): void {
    const user = this.db.getUserById(passengerId);
    if (!user || !(user instanceof Passenger)) {
      throw new Error('Pasajero no encontrado');
    }
    user.addFavoriteDriver(driverId);
    this.db.updateUser(passengerId, user);
  }

  // ============================================
  // GESTIÓN DE ADMINISTRADORES
  // ============================================

  public createAdministrator(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    adminId: string,
    department: string,
    accessLevel: number = 2
  ): Administrator {
    const admin = new Administrator(
      id,
      firstName,
      lastName,
      email,
      contact,
      adminId,
      department,
      accessLevel
    );
    
    this.db.createUser(admin);
    return admin;
  }

  // ============================================
  // GESTIÓN DE VIAJES
  // ============================================

  public createRide(
    id: string,
    passengerId: string,
    origin: IRideLocation,
    destination: IRideLocation,
    requestedPrice: number,
    distance: number,
    estimatedDuration: number
  ): Ride {
    // Verificar que el pasajero existe
    const passenger = this.db.getUserById(passengerId);
    if (!passenger || !(passenger instanceof Passenger)) {
      throw new Error('Pasajero no encontrado');
    }

    const ride = new Ride(
      id,
      passengerId,
      origin,
      destination,
      requestedPrice,
      distance,
      estimatedDuration
    );
    
    this.db.createRide(ride);
    return ride;
  }

  public acceptRide(rideId: string, driverId: string): void {
    const ride = this.db.getRideById(rideId);
    if (!ride) {
      throw new Error('Viaje no encontrado');
    }

    const driver = this.db.getUserById(driverId);
    if (!driver || !(driver instanceof Driver)) {
      throw new Error('Conductor no encontrado');
    }

    ride.acceptRide(driverId);
    this.db.updateRide(rideId, ride);
  }

  public startRide(rideId: string): void {
    const ride = this.db.getRideById(rideId);
    if (!ride) {
      throw new Error('Viaje no encontrado');
    }

    ride.startRide();
    this.db.updateRide(rideId, ride);
  }

  public completeRide(rideId: string, finalPrice: number, payment: IPayment): void {
    const ride = this.db.getRideById(rideId);
    if (!ride) {
      throw new Error('Viaje no encontrado');
    }

    ride.completeRide(finalPrice, payment);
    this.db.updateRide(rideId, ride);

    // Actualizar estadísticas del conductor
    const driverId = ride.getDriverId();
    if (driverId) {
      const driver = this.db.getUserById(driverId);
      if (driver instanceof Driver) {
        driver.incrementRides();
        driver.addEarnings(finalPrice);
        this.db.updateUser(driverId, driver);
      }
    }

    // Actualizar estadísticas del pasajero
    const passengerId = ride.getPassengerId();
    const passenger = this.db.getUserById(passengerId);
    if (passenger instanceof Passenger) {
      passenger.incrementRides();
      passenger.addPayment(payment);
      this.db.updateUser(passengerId, passenger);
    }
  }

  public cancelRide(rideId: string, reason?: string): void {
    const ride = this.db.getRideById(rideId);
    if (!ride) {
      throw new Error('Viaje no encontrado');
    }

    ride.cancelRide(reason);
    this.db.updateRide(rideId, ride);
  }

  // ============================================
  // CONSULTAS
  // ============================================

  public getUserInfo(userId: string): Record<string, any> | null {
    const user = this.db.getUserById(userId);
    return user ? user.getDisplayInfo() : null;
  }

  public listAllUsers(): Record<string, any>[] {
    return this.db.getAllUsers().map(user => user.getDisplayInfo());
  }

  public listAllDrivers(): Record<string, any>[] {
    return this.db.getUsersByRole('DRIVER').map(user => user.getDisplayInfo());
  }

  public listAllPassengers(): Record<string, any>[] {
    return this.db.getUsersByRole('PASSENGER').map(user => user.getDisplayInfo());
  }

  public listAvailableDrivers(): Record<string, any>[] {
    return this.db.getUsersByRole('DRIVER')
      .filter(user => user instanceof Driver && user.isAvailable())
      .map(user => user.getDisplayInfo());
  }

  public getRideInfo(rideId: string): Record<string, any> | null {
    const ride = this.db.getRideById(rideId);
    return ride ? ride.toJSON() : null;
  }

  public listAllRides(): Record<string, any>[] {
    return this.db.getAllRides().map(ride => ride.toJSON());
  }

  public listRidesByPassenger(passengerId: string): Record<string, any>[] {
    return this.db.getRidesByPassenger(passengerId).map(ride => ride.toJSON());
  }

  public listRidesByDriver(driverId: string): Record<string, any>[] {
    return this.db.getRidesByDriver(driverId).map(ride => ride.toJSON());
  }

  public listAvailableRides(): Record<string, any>[] {
    return this.db.getRidesByStatus('REQUESTED').map(ride => ride.toJSON());
  }

  public getSystemStatistics(): Record<string, any> {
    return this.db.getStatistics();
  }
}
