import { Administrator } from '../../models/Administrator';
import { Driver } from '../../models/Driver';
import { Passenger } from '../../models/Passenger';
import { User } from '../../models/User';

/**
 * Componente para listar y mostrar usuarios en InDriver
 */
export class UserList {
  private users: User[];
  private container: string;

  constructor(container: string) {
    this.users = [];
    this.container = container;
  }

  public addUser(user: User): void {
    this.users.push(user);
  }

  public addUsers(users: User[]): void {
    this.users.push(...users);
  }

  public clearUsers(): void {
    this.users = [];
  }

  public filterByRole(role: string): User[] {
    return this.users.filter(user => user.getRole() === role);
  }

  public getDrivers(): Driver[] {
    return this.users.filter(user => user instanceof Driver) as Driver[];
  }

  public getPassengers(): Passenger[] {
    return this.users.filter(user => user instanceof Passenger) as Passenger[];
  }

  public getAvailableDrivers(): Driver[] {
    return this.getDrivers().filter(driver => driver.isAvailable());
  }

  public render(): string {
    if (this.users.length === 0) {
      return '<div class="empty">No hay usuarios para mostrar</div>';
    }

    let html = `<div class="user-list" id="${this.container}">`;
    html += '<h2>👥 Lista de Usuarios InDriver</h2>';
    
    this.users.forEach(user => {
      html += this.renderUserCard(user);
    });

    html += '</div>';
    return html;
  }

  private renderUserCard(user: User): string {
    const roleClass = user.getRole().toLowerCase();
    const roleIcons: Record<string, string> = {  // ✅ CORRECCIÓN AQUÍ
      'driver': '🚗',
      'passenger': '👤',
      'administrator': '👨‍💼'
    };

    let html = `<div class="user-card ${roleClass}">`;
    html += `<div class="user-header">`;
    html += `<h3>${roleIcons[roleClass] || '👤'} ${user.getFullName()}</h3>`;  // ✅ Con valor por defecto
    html += `<span class="badge ${roleClass}">${user.getRole()}</span>`;
    html += `</div>`;
    html += `<div class="user-body">`;
    html += `<p><strong>📧 Email:</strong> ${user.getEmail()}</p>`;
    html += `<p><strong>📱 Teléfono:</strong> ${user.getContact().phone}</p>`;

    if (user instanceof Driver) {
      html += this.renderDriverInfo(user);
    } else if (user instanceof Passenger) {
      html += this.renderPassengerInfo(user);
    } else if (user instanceof Administrator) {
      html += this.renderAdminInfo(user);
    }

    html += `<p><strong>Estado:</strong> ${user.getIsActive() ? '✅ Activo' : '❌ Inactivo'}</p>`;
    html += `</div>`;
    html += `</div>`;

    return html;
  }

  private renderDriverInfo(driver: Driver): string {
    const vehicle = driver.getVehicle();
    const location = driver.getCurrentLocation();
    
    let html = `<p><strong>🆔 ID Conductor:</strong> ${driver.getDriverId()}</p>`;
    html += `<p><strong>🪪 Licencia:</strong> ${driver.getLicenseNumber()}</p>`;
    html += `<p><strong>🚗 Vehículo:</strong> ${vehicle.brand} ${vehicle.model} (${vehicle.plate})</p>`;
    html += `<p><strong>🎨 Color:</strong> ${vehicle.color}</p>`;
    html += `<p><strong>⭐ Rating:</strong> ${driver.getAverageRating().toFixed(1)}/5.0</p>`;
    html += `<p><strong>🎯 Viajes Completados:</strong> ${driver.getTotalRides()}</p>`;
    html += `<p><strong>💰 Ganancias:</strong> $${driver.getEarnings().toFixed(2)}</p>`;
    html += `<p><strong>📍 Disponible:</strong> ${driver.isAvailable() ? '✅ Sí' : '❌ No'}</p>`;
    
    if (location) {
      html += `<p><strong>📌 Ubicación:</strong> (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})</p>`;
    }

    return html;
  }

  private renderPassengerInfo(passenger: Passenger): string {
    let html = `<p><strong>🆔 ID Pasajero:</strong> ${passenger.getPassengerId()}</p>`;
    html += `<p><strong>⭐ Rating:</strong> ${passenger.getAverageRating().toFixed(1)}/5.0</p>`;
    html += `<p><strong>🎯 Viajes Realizados:</strong> ${passenger.getRidesCount()}</p>`;
    html += `<p><strong>💳 Saldo en Billetera:</strong> $${passenger.getWalletBalance().toFixed(2)}</p>`;
    html += `<p><strong>❤️ Conductores Favoritos:</strong> ${passenger.getFavoriteDrivers().length}</p>`;

    return html;
  }

  private renderAdminInfo(admin: Administrator): string {
    let html = `<p><strong>🆔 ID Administrador:</strong> ${admin.getAdminId()}</p>`;
    html += `<p><strong>🏢 Departamento:</strong> ${admin.getDepartment()}</p>`;
    html += `<p><strong>🔐 Nivel de Acceso:</strong> ${admin.getAccessLevel()}</p>`;
    html += `<p><strong>🌆 Ciudades Gestionadas:</strong> ${admin.getManagedCities().length}</p>`;
    html += `<p><strong>🔑 Permisos:</strong> ${admin.getPermissions().length}</p>`;

    return html;
  }

  public renderTable(): string {
    if (this.users.length === 0) {
      return '<div class="empty">No hay usuarios para mostrar</div>';
    }

    let html = '<table class="user-table">';
    html += '<thead><tr>';
    html += '<th>Nombre</th>';
    html += '<th>Rol</th>';
    html += '<th>Email</th>';
    html += '<th>Rating</th>';
    html += '<th>Estado</th>';
    html += '<th>Acciones</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    this.users.forEach(user => {
      const rating = user instanceof Driver ? user.getAverageRating() : 
                     user instanceof Passenger ? user.getAverageRating() : 0;

      html += '<tr>';
      html += `<td>${user.getFullName()}</td>`;
      html += `<td><span class="badge ${user.getRole().toLowerCase()}">${user.getRole()}</span></td>`;
      html += `<td>${user.getEmail()}</td>`;
      html += `<td>${rating > 0 ? '⭐ ' + rating.toFixed(1) : 'N/A'}</td>`;
      html += `<td>${user.getIsActive() ? '✅ Activo' : '❌ Inactivo'}</td>`;
      html += `<td><button onclick="viewUser('${user.getId()}')">Ver Detalles</button></td>`;
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  }

  public renderDriversOnly(): string {
    const drivers = this.getDrivers();
    
    if (drivers.length === 0) {
      return '<div class="empty">No hay conductores registrados</div>';
    }

    let html = '<div class="drivers-grid">';
    drivers.forEach(driver => {
      html += this.renderUserCard(driver);
    });
    html += '</div>';

    return html;
  }

  public renderPassengersOnly(): string {
    const passengers = this.getPassengers();
    
    if (passengers.length === 0) {
      return '<div class="empty">No hay pasajeros registrados</div>';
    }

    let html = '<div class="passengers-grid">';
    passengers.forEach(passenger => {
      html += this.renderUserCard(passenger);
    });
    html += '</div>';

    return html;
  }
}
