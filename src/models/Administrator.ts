import type { IContact, UserRole } from '../interfaces/index';
import { User } from './User';

/**
 * Clase Administrator para gestión del sistema InDriver
 */
export class Administrator extends User {
  private adminId: string;
  private accessLevel: number;
  private department: string;
  private managedCities: string[];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: IContact,
    adminId: string,
    department: string,
    accessLevel: number = 2
  ) {
    super(id, firstName, lastName, email, contact, 'ADMINISTRATOR' as UserRole);
    this.adminId = adminId;
    this.department = department;
    this.accessLevel = accessLevel;
    this.managedCities = [];
  }

  public getPermissions(): string[] {
    const basePermissions = [
      'view_all_users',
      'view_all_rides',
      'manage_drivers',
      'manage_passengers',
      'view_reports',
      'handle_disputes'
    ];

    if (this.accessLevel >= 3) {
      return [
        ...basePermissions,
        'manage_admins',
        'system_settings',
        'financial_reports',
        'ban_users',
        'full_access'
      ];
    }

    return basePermissions;
  }

  public getDisplayInfo(): Record<string, any> {
    return {
      ...this.toJSON(),
      adminId: this.adminId,
      department: this.department,
      accessLevel: this.accessLevel,
      managedCities: this.managedCities,
      permissions: this.getPermissions().length
    };
  }

  public addManagedCity(city: string): void {
    if (!this.managedCities.includes(city)) {
      this.managedCities.push(city);
    }
  }

  public removeManagedCity(city: string): void {
    this.managedCities = this.managedCities.filter(c => c !== city);
  }

  public setAccessLevel(level: number): void {
    if (level < 1 || level > 5) {
      throw new Error('El nivel de acceso debe estar entre 1 y 5');
    }
    this.accessLevel = level;
  }

  public getAdminId(): string {
    return this.adminId;
  }

  public getDepartment(): string {
    return this.department;
  }

  public getAccessLevel(): number {
    return this.accessLevel;
  }

  public getManagedCities(): string[] {
    return [...this.managedCities];
  }
}
