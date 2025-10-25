import type { IContact, IPayment, IRating, UserRole } from '../interfaces/index';
import { User } from './User';

/**
 * Clase Passenger - Representa un pasajero en GoDrive
 */
export class Passenger extends User {
  private passengerId: string;
  private ratings: IRating[];
  private ridesCount: number;
  private favoriteDrivers: string[];
  private paymentHistory: IPayment[];
  private walletBalance: number;
  private currentLocation?: { latitude: number; longitude: number };

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    passengerId: string
  ) {
    super(id, firstName, lastName, email, contact, 'PASSENGER' as UserRole);
    this.passengerId = passengerId;
    this.ratings = [];
    this.ridesCount = 0;
    this.favoriteDrivers = [];
    this.paymentHistory = [];
    this.walletBalance = 0;
  }

  public getPermissions(): string[] {
    return [
      'request_ride',
      'view_available_drivers',
      'rate_driver',
      'view_ride_history',
      'add_funds',
      'manage_payment_methods',
      'save_favorite_drivers'
    ];
  }

  public getDisplayInfo(): Record<string, any> {
    return {
      ...this.toJSON(),
      passengerId: this.passengerId,
      averageRating: this.getAverageRating(),
      totalRides: this.ridesCount,
      favoriteDriversCount: this.favoriteDrivers.length,
      walletBalance: this.walletBalance
    };
  }

  // Métodos específicos de Passenger
  public addRating(rating: IRating): void {
    this.ratings.push(rating);
  }

  public getAverageRating(): number {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / this.ratings.length).toFixed(2));
  }

  public incrementRides(): void {
    this.ridesCount++;
  }

  public addFavoriteDriver(driverId: string): void {
    if (!this.favoriteDrivers.includes(driverId)) {
      this.favoriteDrivers.push(driverId);
    }
  }

  public removeFavoriteDriver(driverId: string): void {
    this.favoriteDrivers = this.favoriteDrivers.filter(id => id !== driverId);
  }

  public addPayment(payment: IPayment): void {
    this.paymentHistory.push(payment);
    if (payment.method === 'WALLET') {
      this.walletBalance -= payment.amount;
    }
  }

  public addFunds(amount: number): void {
    if (amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    this.walletBalance += amount;
  }
  public updateLocation(latitude: number, longitude: number): void {
    this.currentLocation = { latitude, longitude };
  }

  public getCurrentLocation(): { latitude: number; longitude: number } | undefined {
    return this.currentLocation;
  }

  // Getters
  public getPassengerId(): string {
    return this.passengerId;
  }

  public getRatings(): IRating[] {
    return [...this.ratings];
  }

  public getRidesCount(): number {
    return this.ridesCount;
  }

  public getFavoriteDrivers(): string[] {
    return [...this.favoriteDrivers];
  }

  public getPaymentHistory(): IPayment[] {
    return [...this.paymentHistory];
  }

  public getWalletBalance(): number {
    return this.walletBalance;
  }
}
