import type { IContact, UserRole } from '../interfaces/index';

/**
 * Clase base User para el sistema InDriver
 * Implementa POO con encapsulación, abstracción y herencia
 */
export abstract class User {
  protected id: string;
  protected firstName: string;
  protected lastName: string;
  protected email: string;
  protected contact: IContact;
  protected role: UserRole;
  protected createdAt: Date;
  protected isActive: boolean;
  protected profilePhoto?: string;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    role: UserRole
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.contact = contact;
    this.role = role;
    this.createdAt = new Date();
    this.isActive = true;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public getEmail(): string {
    return this.email;
  }

  public getContact(): IContact {
    return { ...this.contact };
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  // Setters
  public setEmail(email: string): void {
    if (!this.validateEmail(email)) {
      throw new Error('Email inválido');
    }
    this.email = email;
  }

  public setContact(contact: IContact): void {
    this.contact = contact;
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public setProfilePhoto(url: string): void {
    this.profilePhoto = url;
  }

  // Métodos abstractos
  public abstract getPermissions(): string[];
  public abstract getDisplayInfo(): Record<string, any>;

  // Métodos protegidos
  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  protected validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone);
  }

  // Serialización
  public toJSON(): Record<string, any> {
    return {
      id: this.id,
      fullName: this.getFullName(),
      email: this.email,
      contact: this.contact,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
      isActive: this.isActive,
      profilePhoto: this.profilePhoto
    };
  }
}
