import { Driver } from '../../models/Driver';

/**
 * Vista específica para conductores en InDriver
 */
export class DriverView {
  private driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  public renderDashboard(): string {
    let html = '<div class="driver-dashboard">';
    
    html += this.renderHeader();
    html += this.renderStats();
    html += this.renderVehicleInfo();
    html += this.renderAvailabilitySection();
    html += this.renderEarningsSection();
    html += this.renderRatingsSection();
    
    html += '</div>';
    return html;
  }

  private renderHeader(): string {
    const location = this.driver.getCurrentLocation();
    
    let html = '<div class="dashboard-header driver-header">';
    html += `<div class="profile-section">`;
    html += `<div class="profile-avatar">🚗</div>`;
    html += `<div class="profile-info">`;
    html += `<h1>Conductor: ${this.driver.getFullName()}</h1>`;
    html += `<p class="driver-id">ID: ${this.driver.getDriverId()}</p>`;
    html += `<p class="license">📜 Licencia: ${this.driver.getLicenseNumber()}</p>`;
    
    if (location) {
      html += `<p class="location">📍 Ubicación: (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})</p>`;
    }
    
    html += `</div>`;
    html += `</div>`;
    html += '</div>';

    return html;
  }

  private renderStats(): string {
    let html = '<div class="stats-section">';
    html += '<h2>📊 Estadísticas del Conductor</h2>';
    html += '<div class="stats-grid">';
    
    html += '<div class="stat-card earnings">';
    html += '<div class="stat-icon">💰</div>';
    html += '<div class="stat-content">';
    html += '<p class="stat-label">Ganancias Totales</p>';
    html += `<p class="stat-value">$${this.driver.getEarnings().toFixed(2)}</p>`;
    html += '</div>';
    html += '</div>';

    html += '<div class="stat-card rides">';
    html += '<div class="stat-icon">🎯</div>';
    html += '<div class="stat-content">';
    html += '<p class="stat-label">Viajes Completados</p>';
    html += `<p class="stat-value">${this.driver.getTotalRides()}</p>`;
    html += '</div>';
    html += '</div>';

    html += '<div class="stat-card rating">';
    html += '<div class="stat-icon">⭐</div>';
    html += '<div class="stat-content">';
    html += '<p class="stat-label">Calificación Promedio</p>';
    html += `<p class="stat-value">${this.driver.getAverageRating().toFixed(1)}/5.0</p>`;
    html += '</div>';
    html += '</div>';

    const avgEarnings = this.driver.getTotalRides() > 0 
      ? this.driver.getEarnings() / this.driver.getTotalRides() 
      : 0;

    html += '<div class="stat-card average">';
    html += '<div class="stat-icon">💵</div>';
    html += '<div class="stat-content">';
    html += '<p class="stat-label">Ganancia por Viaje</p>';
    html += `<p class="stat-value">$${avgEarnings.toFixed(2)}</p>`;
    html += '</div>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    return html;
  }

  private renderVehicleInfo(): string {
    const vehicle = this.driver.getVehicle();
    
    let html = '<div class="vehicle-section">';
    html += '<h2>🚗 Información del Vehículo</h2>';
    html += '<div class="vehicle-card">';
    html += '<div class="vehicle-image">🚙</div>';
    html += '<div class="vehicle-details">';
    html += `<h3>${vehicle.brand} ${vehicle.model}</h3>`;
    html += `<p><strong>Placa:</strong> ${vehicle.plate}</p>`;
    html += `<p><strong>Año:</strong> ${vehicle.year}</p>`;
    html += `<p><strong>Color:</strong> ${vehicle.color}</p>`;
    html += `<p><strong>Tipo:</strong> ${vehicle.type}</p>`;
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  private renderAvailabilitySection(): string {
    const isAvailable = this.driver.isAvailable();
    
    let html = '<div class="availability-section">';
    html += '<h2>📍 Estado de Disponibilidad</h2>';
    html += '<div class="availability-card">';
    html += `<div class="availability-status ${isAvailable ? 'available' : 'unavailable'}">`;
    html += `<div class="status-icon">${isAvailable ? '✅' : '⏸️'}</div>`;
    html += `<div class="status-text">`;
    html += `<h3>${isAvailable ? 'Disponible para Viajes' : 'No Disponible'}</h3>`;
    html += `<p>${isAvailable ? 'Estás recibiendo solicitudes de viaje' : 'No recibirás solicitudes de viaje'}</p>`;
    html += `</div>`;
    html += `</div>`;
    html += '<div class="availability-actions">';
    html += `<button class="btn-toggle" onclick="toggleAvailability('${this.driver.getId()}')">`;
    html += `${isAvailable ? 'Pausar Servicio' : 'Activar Servicio'}`;
    html += `</button>`;
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  private renderEarningsSection(): string {
    const earnings = this.driver.getEarnings();
    const rides = this.driver.getTotalRides();
    
    let html = '<div class="earnings-section">';
    html += '<h2>💰 Resumen de Ganancias</h2>';
    html += '<div class="earnings-card">';
    html += '<div class="earnings-chart">';
    html += `<div class="earnings-total">$${earnings.toFixed(2)}</div>`;
    html += `<p class="earnings-label">Total Ganado</p>`;
    html += '</div>';
    html += '<div class="earnings-details">';
    html += `<p><strong>Total de Viajes:</strong> ${rides}</p>`;
    html += `<p><strong>Ganancia Promedio:</strong> $${rides > 0 ? (earnings / rides).toFixed(2) : '0.00'}</p>`;
    html += `<p><strong>Último Mes:</strong> $${(earnings * 0.3).toFixed(2)}</p>`;
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  private renderRatingsSection(): string {
    const ratings = this.driver.getRatings();
    const avgRating = this.driver.getAverageRating();
    
    let html = '<div class="ratings-section">';
    html += '<h2>⭐ Calificaciones Recibidas</h2>';
    
    if (ratings.length === 0) {
      html += '<p class="empty">Aún no has recibido calificaciones</p>';
    } else {
      html += '<div class="rating-summary">';
      html += `<div class="rating-average">${avgRating.toFixed(1)}</div>`;
      html += '<div class="rating-stars">' + '⭐'.repeat(Math.round(avgRating)) + '</div>';
      html += `<p>${ratings.length} calificaciones</p>`;
      html += '</div>';

      html += '<div class="ratings-list">';
      ratings.slice(-5).reverse().forEach(rating => {
        html += '<div class="rating-item">';
        html += `<div class="rating-header">`;
        html += `<span class="rating-value">${'⭐'.repeat(rating.rating)}</span>`;
        html += `<span class="rating-date">${new Date(rating.date).toLocaleDateString()}</span>`;
        html += `</div>`;
        html += `<p class="rating-comment">"${rating.comment}"</p>`;
        html += `<small class="rating-ride">Viaje: ${rating.rideId}</small>`;
        html += '</div>';
      });
      html += '</div>';
    }
    
    html += '</div>';

    return html;
  }

  public renderCompact(): string {
    const vehicle = this.driver.getVehicle();
    
    let html = '<div class="driver-compact">';
    html += `<div class="driver-avatar">🚗</div>`;
    html += `<div class="driver-info">`;
    html += `<h3>${this.driver.getFullName()}</h3>`;
    html += `<p>${vehicle.brand} ${vehicle.model} • ${vehicle.plate}</p>`;
    html += `<div class="driver-stats-inline">`;
    html += `<span>⭐ ${this.driver.getAverageRating().toFixed(1)}</span>`;
    html += `<span>🎯 ${this.driver.getTotalRides()} viajes</span>`;
    html += `<span>${this.driver.isAvailable() ? '✅ Disponible' : '⏸️ Ocupado'}</span>`;
    html += `</div>`;
    html += `</div>`;
    html += '</div>';

    return html;
  }
}
