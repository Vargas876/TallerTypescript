import type { IPayment, IRideLocation, RideStatus } from '../interfaces/index';

/**
 * Clase Ride - Representa un viaje en InDriver
 */
export class Ride {
  private id: string;
  private passengerId: string;
  private driverId?: string;
  private origin: IRideLocation;
  private destination: IRideLocation;
  private status: RideStatus;
  private requestedPrice: number;
  private finalPrice?: number;
  private distance: number;
  private estimatedDuration: number;
  private payment?: IPayment;
  private createdAt: Date;
  private startedAt?: Date;
  private completedAt?: Date;
  private notes?: string;

  constructor(
    id: string,
    passengerId: string,
    origin: IRideLocation,
    destination: IRideLocation,
    requestedPrice: number,
    distance: number,
    estimatedDuration: number
  ) {
    this.id = id;
    this.passengerId = passengerId;
    this.origin = origin;
    this.destination = destination;
    this.requestedPrice = requestedPrice;
    this.distance = distance;
    this.estimatedDuration = estimatedDuration;
    this.status = 'REQUESTED' as RideStatus;
    this.createdAt = new Date();
  }

  // Métodos de gestión del viaje
  public acceptRide(driverId: string): void {
    if (this.status !== 'REQUESTED') {
      throw new Error('El viaje ya fue aceptado o completado');
    }
    this.driverId = driverId;
    this.status = 'ACCEPTED' as RideStatus;
  }

  public startRide(): void {
    if (this.status !== 'ACCEPTED') {
      throw new Error('El viaje debe ser aceptado primero');
    }
    this.status = 'IN_PROGRESS' as RideStatus;
    this.startedAt = new Date();
  }

  public completeRide(finalPrice: number, payment: IPayment): void {
    if (this.status !== 'IN_PROGRESS') {
      throw new Error('El viaje debe estar en progreso');
    }
    this.status = 'COMPLETED' as RideStatus;
    this.finalPrice = finalPrice;
    this.payment = payment;
    this.completedAt = new Date();
  }

  public cancelRide(reason?: string): void {
    if (this.status === 'COMPLETED') {
      throw new Error('No se puede cancelar un viaje completado');
    }
    this.status = 'CANCELLED' as RideStatus;
    this.notes = reason;
  }

  public setNotes(notes: string): void {
    this.notes = notes;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getPassengerId(): string {
    return this.passengerId;
  }

  public getDriverId(): string | undefined {
    return this.driverId;
  }

  public getOrigin(): IRideLocation {
    return { ...this.origin };
  }

  public getDestination(): IRideLocation {
    return { ...this.destination };
  }

  public getStatus(): RideStatus {
    return this.status;
  }

  public getRequestedPrice(): number {
    return this.requestedPrice;
  }

  public getFinalPrice(): number | undefined {
    return this.finalPrice;
  }

  public getDistance(): number {
    return this.distance;
  }

  public getEstimatedDuration(): number {
    return this.estimatedDuration;
  }

  public getPayment(): IPayment | undefined {
    return this.payment ? { ...this.payment } : undefined;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      passengerId: this.passengerId,
      driverId: this.driverId,
      origin: this.origin,
      destination: this.destination,
      status: this.status,
      requestedPrice: this.requestedPrice,
      finalPrice: this.finalPrice,
      distance: this.distance,
      estimatedDuration: this.estimatedDuration,
      payment: this.payment,
      createdAt: this.createdAt.toISOString(),
      startedAt: this.startedAt?.toISOString(),
      completedAt: this.completedAt?.toISOString(),
      notes: this.notes
    };
  }
}
