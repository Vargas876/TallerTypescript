import type { IContact, IRating, IVehicle, UserRole } from '../interfaces/index';
import { User } from './User';

/**
 * Clase Driver - Representa un conductor en GoDrive
 */
export class Driver extends User {
  private driverId: string;
  private licenseNumber: string;
  private vehicle: IVehicle;
  private ratings: IRating[];
  private totalRides: number;
  private availableForRides: boolean;
  private currentLocation?: { latitude: number; longitude: number };
  private earnings: number;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    driverId: string,
    licenseNumber: string,
    vehicle: IVehicle
  ) {
    super(id, firstName, lastName, email, contact, 'DRIVER' as UserRole);
    this.driverId = driverId;
    this.licenseNumber = licenseNumber;
    this.vehicle = vehicle;
    this.ratings = [];
    this.totalRides = 0;
    this.availableForRides = true;
    this.earnings = 0;
  }

  public getPermissions(): string[] {
    return [
      'view_ride_requests',
      'accept_rides',
      'start_ride',
      'complete_ride',
      'view_earnings',
      'update_location',
      'set_availability'
    ];
  }

  public getDisplayInfo(): Record<string, any> {
    return {
      ...this.toJSON(),
      driverId: this.driverId,
      licenseNumber: this.licenseNumber,
      vehicle: this.vehicle,
      averageRating: this.getAverageRating(),
      totalRides: this.totalRides,
      isAvailable: this.availableForRides,
      earnings: this.earnings
    };
  }

  // Métodos específicos de Driver
  public addRating(rating: IRating): void {
    this.ratings.push(rating);
  }

  public getAverageRating(): number {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / this.ratings.length).toFixed(2));
  }

  public incrementRides(): void {
    this.totalRides++;
  }

  public addEarnings(amount: number): void {
    this.earnings += amount;
  }

  public setAvailability(available: boolean): void {
    this.availableForRides = available;
  }

  public updateLocation(latitude: number, longitude: number): void {
    this.currentLocation = { latitude, longitude };
  }

  public updateVehicle(vehicle: IVehicle): void {
    this.vehicle = vehicle;
  }

  // Getters
  public getDriverId(): string {
    return this.driverId;
  }

  public getLicenseNumber(): string {
    return this.licenseNumber;
  }

  public getVehicle(): IVehicle {
    return { ...this.vehicle };
  }

  public getRatings(): IRating[] {
    return [...this.ratings];
  }

  public getTotalRides(): number {
    return this.totalRides;
  }

  public isAvailable(): boolean {
    return this.availableForRides;
  }

  public getEarnings(): number {
    return this.earnings;
  }

  public getCurrentLocation(): { latitude: number; longitude: number } | undefined {
    return this.currentLocation ? { ...this.currentLocation } : undefined;
  }
}
