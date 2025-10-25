/**
 * Interfaces para el sistema GoDrive
 */

export interface IAddress {
  street: string;
  city: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface IContact {
  email: string;
  phone: string;
  address: IAddress;
}

export enum UserRole {
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER',
  ADMINISTRATOR = 'ADMINISTRATOR'
}

export interface IVehicle {
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: VehicleType;
}

export enum VehicleType {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  HATCHBACK = 'HATCHBACK',
  VAN = 'VAN',
  MOTORCYCLE = 'MOTORCYCLE'
}

export enum RideStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface IRideLocation {
  address: string;
  latitude: number;
  longitude: number;
}

export interface IRating {
  rideId: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface IPayment {
  amount: number;
  method: PaymentMethod;
  currency: string;
  date: Date;
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
  TRANSFER = 'TRANSFER'
}
