import { Ride } from '../../models/Ride';

/**
 * Componente para listar y mostrar viajes en InDriver
 */
export class RideList {
  private rides: Ride[];
  private container: string;

  constructor(container: string) {
    this.rides = [];
    this.container = container;
  }

  public addRide(ride: Ride): void {
    this.rides.push(ride);
  }

  public addRides(rides: Ride[]): void {
    this.rides.push(...rides);
  }

  public clearRides(): void {
    this.rides = [];
  }

  public filterByStatus(status: string): Ride[] {
    return this.rides.filter(ride => ride.getStatus() === status);
  }

  public filterByPassenger(passengerId: string): Ride[] {
    return this.rides.filter(ride => ride.getPassengerId() === passengerId);
  }

  public filterByDriver(driverId: string): Ride[] {
    return this.rides.filter(ride => ride.getDriverId() === driverId);
  }

  public getAvailableRides(): Ride[] {
    return this.filterByStatus('REQUESTED');
  }

  public render(): string {
    if (this.rides.length === 0) {
      return '<div class="empty">No hay viajes para mostrar</div>';
    }

    let html = `<div class="ride-list" id="${this.container}">`;
    html += '<h2>🗺️ Lista de Viajes</h2>';
    
    this.rides.forEach(ride => {
      html += this.renderRideCard(ride);
    });

    html += '</div>';
    return html;
  }

  private renderRideCard(ride: Ride): string {
    const statusConfig: Record<string, { label: string; icon: string; color: string }> = {  // ← Agregar tipo
      'REQUESTED': { label: 'Solicitado', icon: '📍', color: 'requested' },
      'ACCEPTED': { label: 'Aceptado', icon: '✅', color: 'accepted' },
      'IN_PROGRESS': { label: 'En Progreso', icon: '🚗', color: 'in-progress' },
      'COMPLETED': { label: 'Completado', icon: '✔️', color: 'completed' },
      'CANCELLED': { label: 'Cancelado', icon: '❌', color: 'cancelled' }
    };

    const config = statusConfig[ride.getStatus()];
    const origin = ride.getOrigin();
    const destination = ride.getDestination();
    const payment = ride.getPayment();

    let html = `<div class="ride-card ${config.color}">`;
    html += `<div class="ride-header">`;
    html += `<h3>${config.icon} Viaje #${ride.getId()}</h3>`;
    html += `<span class="ride-status ${config.color}">${config.label}</span>`;
    html += `</div>`;
    html += `<div class="ride-body">`;
    
    // Origen y Destino
    html += `<div class="location-section">`;
    html += `<div class="location origin">`;
    html += `<span class="location-icon">📍</span>`;
    html += `<div class="location-details">`;
    html += `<strong>Origen</strong>`;
    html += `<p>${origin.address}</p>`;
    html += `<small>(${origin.latitude.toFixed(4)}, ${origin.longitude.toFixed(4)})</small>`;
    html += `</div>`;
    html += `</div>`;
    
    html += `<div class="location-arrow">⬇️</div>`;
    
    html += `<div class="location destination">`;
    html += `<span class="location-icon">🎯</span>`;
    html += `<div class="location-details">`;
    html += `<strong>Destino</strong>`;
    html += `<p>${destination.address}</p>`;
    html += `<small>(${destination.latitude.toFixed(4)}, ${destination.longitude.toFixed(4)})</small>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;

    // Detalles del viaje
    html += `<div class="ride-details">`;
    html += `<p><strong>💰 Precio Solicitado:</strong> $${ride.getRequestedPrice().toFixed(2)}</p>`;
    
    if (ride.getFinalPrice()) {
      html += `<p><strong>💵 Precio Final:</strong> $${ride.getFinalPrice()?.toFixed(2)}</p>`;
    }
    
    html += `<p><strong>📏 Distancia:</strong> ${ride.getDistance().toFixed(2)} km</p>`;
    html += `<p><strong>⏱️ Duración Estimada:</strong> ${ride.getEstimatedDuration()} minutos</p>`;
    html += `<p><strong>👤 Pasajero:</strong> ${ride.getPassengerId()}</p>`;
    
    if (ride.getDriverId()) {
      html += `<p><strong>🚗 Conductor:</strong> ${ride.getDriverId()}</p>`;
    }

    if (payment) {
      html += `<p><strong>💳 Método de Pago:</strong> ${payment.method}</p>`;
      html += `<p><strong>💸 Monto Pagado:</strong> $${payment.amount.toFixed(2)}</p>`;
    }

    html += `</div>`;
    html += `</div>`;
    html += `</div>`;

    return html;
  }

  public renderCompact(): string {
    if (this.rides.length === 0) {
      return '<div class="empty">No hay viajes disponibles</div>';
    }

    let html = '<div class="ride-list-compact">';
    
    this.rides.forEach(ride => {
      const config = {
        'REQUESTED': '📍',
        'ACCEPTED': '✅',
        'IN_PROGRESS': '🚗',
        'COMPLETED': '✔️',
        'CANCELLED': '❌'
      };

      html += `<div class="ride-compact">`;
      html += `<span class="ride-icon">${config[ride.getStatus()]}</span>`;
      html += `<div class="ride-info">`;
      html += `<strong>#${ride.getId()}</strong>`;
      html += `<p>${ride.getOrigin().address} → ${ride.getDestination().address}</p>`;
      html += `<small>$${ride.getRequestedPrice().toFixed(2)} • ${ride.getDistance().toFixed(1)} km</small>`;
      html += `</div>`;
      html += `<span class="ride-status-badge ${ride.getStatus().toLowerCase()}">${ride.getStatus()}</span>`;
      html += `</div>`;
    });

    html += '</div>';
    return html;
  }

  public renderStatistics(): string {
    const total = this.rides.length;
    const requested = this.filterByStatus('REQUESTED').length;
    const accepted = this.filterByStatus('ACCEPTED').length;
    const inProgress = this.filterByStatus('IN_PROGRESS').length;
    const completed = this.filterByStatus('COMPLETED').length;
    const cancelled = this.filterByStatus('CANCELLED').length;

    const totalRevenue = this.rides
      .filter(r => r.getStatus() === 'COMPLETED')
      .reduce((sum, r) => sum + (r.getFinalPrice() || 0), 0);

    const totalDistance = this.rides
      .filter(r => r.getStatus() === 'COMPLETED')
      .reduce((sum, r) => sum + r.getDistance(), 0);

    let html = '<div class="ride-statistics">';
    html += '<h3>📊 Estadísticas de Viajes</h3>';
    html += '<div class="stats-grid">';
    html += `<div class="stat-card"><span class="stat-label">Total</span><span class="stat-value">${total}</span></div>`;
    html += `<div class="stat-card"><span class="stat-label">Solicitados</span><span class="stat-value">${requested}</span></div>`;
    html += `<div class="stat-card"><span class="stat-label">En Curso</span><span class="stat-value">${inProgress}</span></div>`;
    html += `<div class="stat-card"><span class="stat-label">Completados</span><span class="stat-value">${completed}</span></div>`;
    html += `<div class="stat-card"><span class="stat-label">Ingresos</span><span class="stat-value">$${totalRevenue.toFixed(0)}</span></div>`;
    html += `<div class="stat-card"><span class="stat-label">Distancia</span><span class="stat-value">${totalDistance.toFixed(1)} km</span></div>`;
    html += '</div>';
    html += '</div>';

    return html;
  }
}
