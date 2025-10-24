import { Ride } from '../models/Ride';
import { User } from '../models/User';

/**
 * Base de datos en memoria para el sistema InDriver
 */
export class Database {
  private users: Map<string, User>;
  private rides: Map<string, Ride>;
  private static instance: Database;

  private constructor() {
    this.users = new Map<string, User>();
    this.rides = new Map<string, Ride>();
  }

  // Patrón Singleton
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // ============================================
  // GESTIÓN DE USUARIOS
  // ============================================

  public createUser(user: User): void {
    if (this.users.has(user.getId())) {
      throw new Error(`Usuario con ID ${user.getId()} ya existe`);
    }
    this.users.set(user.getId(), user);
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getUsersByRole(role: string): User[] {
    return this.getAllUsers().filter(user => user.getRole() === role);
  }

  public updateUser(id: string, user: User): void {
    if (!this.users.has(id)) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    this.users.set(id, user);
  }

  public deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  public searchUsersByName(name: string): User[] {
    return this.getAllUsers().filter(user =>
      user.getFullName().toLowerCase().includes(name.toLowerCase())
    );
  }

  // ============================================
  // GESTIÓN DE VIAJES
  // ============================================

  public createRide(ride: Ride): void {
    if (this.rides.has(ride.getId())) {
      throw new Error(`Viaje con ID ${ride.getId()} ya existe`);
    }
    this.rides.set(ride.getId(), ride);
  }

  public getRideById(id: string): Ride | undefined {
    return this.rides.get(id);
  }

  public getAllRides(): Ride[] {
    return Array.from(this.rides.values());
  }

  public getRidesByPassenger(passengerId: string): Ride[] {
    return this.getAllRides().filter(ride => ride.getPassengerId() === passengerId);
  }

  public getRidesByDriver(driverId: string): Ride[] {
    return this.getAllRides().filter(ride => ride.getDriverId() === driverId);
  }

  public getRidesByStatus(status: string): Ride[] {
    return this.getAllRides().filter(ride => ride.getStatus() === status);
  }

  public updateRide(id: string, ride: Ride): void {
    if (!this.rides.has(id)) {
      throw new Error(`Viaje con ID ${id} no encontrado`);
    }
    this.rides.set(id, ride);
  }

  public deleteRide(id: string): boolean {
    return this.rides.delete(id);
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  public getStatistics(): Record<string, any> {
    const allUsers = this.getAllUsers();
    const allRides = this.getAllRides();

    return {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => u.getIsActive()).length,
      drivers: this.getUsersByRole('DRIVER').length,
      passengers: this.getUsersByRole('PASSENGER').length,
      administrators: this.getUsersByRole('ADMINISTRATOR').length,
      totalRides: allRides.length,
      requestedRides: this.getRidesByStatus('REQUESTED').length,
      acceptedRides: this.getRidesByStatus('ACCEPTED').length,
      inProgressRides: this.getRidesByStatus('IN_PROGRESS').length,
      completedRides: this.getRidesByStatus('COMPLETED').length,
      cancelledRides: this.getRidesByStatus('CANCELLED').length
    };
  }
}
