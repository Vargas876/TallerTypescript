import { Passenger } from '../../models/Passenger';

/**
 * Vista específica para pasajeros en InDriver
 */
export class PassengerView {
  private passenger: Passenger;

  constructor(passenger: Passenger) {
    this.passenger = passenger;
  }

  public renderDashboard(): string {
    let html = '<div class="passenger-dashboard">';
    
    html += this.renderHeader();
    html += this.renderStats();
    html += this.renderWalletSection();
    html += this.renderFavoriteDriversSection();
    html += this.renderPaymentHistorySection();
    html += this.renderRatingsSection();
    
    html += '</div>';
    return html;
  }

  private renderHeader(): string {
    let html = '<div class="dashboard-header passenger-header">';
    html += `<div class="profile-section">`;
    html += `<div class="profile-avatar">👤</div>`;
    html += `<div class="profile-info">`;
    html += `<h1>Pasajero: ${this.passenger.getFullName()}</h1>`;
    html += `<p class="passenger-id">ID: ${this.passenger.getPassengerId()}</p>`;
    html += `<p class="contact">📧 ${this.passenger.getEmail()}</p>`;
    html += `<p class="contact">📱 ${this.passenger.getContact().phone}</p>`;
    html += `</div>`;
    html += `</div>`;
    html += '</div>';

    return html;
  }

  private renderStats(): string {
    let html = '<div class="stats-section">';
    html += '<h2>📊 Estadísticas del Pasajero</h2>';
    html += '<div class="stats-grid">';
    
    html += '<div class="stat-card rides">';
    html += '<div class="stat-icon">🎯</div>';
    html += '<div class="stat-content">';
    html += '<p class="stat-label">Viajes Realizados</p>';
    html += `<p class="stat-value">${this.passenger.getRidesCount()}</p>`;
    html += '</div>';
    html += '</div>';

    html += '<div class="stat-card rating">';
    html += '<div class="stat-icon">⭐</div>';
    html += '<div class="stat-content">';
    html += '<p class="stat-label">Tu Calificación</p>';
    html += `<p class="stat-value">${this.passenger.getAverageRating().toFixed(1)}/5.0</p>`;
    html += '</div>';
    html += '</div>';

    html += '<div class="stat-card wallet">';
    html += '<div class="stat-icon">💳</div>';
    html += '<div class="stat-content">';
    html += '<p class="stat-label">Saldo en Billetera</p>';
    html += `<p class="stat-value">$${this.passenger.getWalletBalance().toFixed(2)}</p>`;
    html += '</div>';
    html += '</div>';

    html += '<div class="stat-card favorites">';
    html += '<div class="stat-icon">❤️</div>';
    html += '<div class="stat-content">';
    html += '<p class="stat-label">Conductores Favoritos</p>';
    html += `<p class="stat-value">${this.passenger.getFavoriteDrivers().length}</p>`;
    html += '</div>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    return html;
  }

  private renderWalletSection(): string {
    const balance = this.passenger.getWalletBalance();
    
    let html = '<div class="wallet-section">';
    html += '<h2>💳 Mi Billetera</h2>';
    html += '<div class="wallet-card">';
    html += '<div class="wallet-balance">';
    html += `<div class="balance-amount">$${balance.toFixed(2)}</div>`;
    html += '<p class="balance-label">Saldo Disponible</p>';
    html += '</div>';
    html += '<div class="wallet-actions">';
    html += `<button class="btn-primary" onclick="addFunds('${this.passenger.getId()}')">➕ Agregar Fondos</button>`;
    html += `<button class="btn-secondary" onclick="viewTransactions('${this.passenger.getId()}')">📋 Ver Historial</button>`;
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  private renderFavoriteDriversSection(): string {
    const favorites = this.passenger.getFavoriteDrivers();
    
    let html = '<div class="favorites-section">';
    html += '<h2>❤️ Conductores Favoritos</h2>';
    
    if (favorites.length === 0) {
      html += '<p class="empty">Aún no tienes conductores favoritos. Agrega a tus conductores preferidos después de un viaje.</p>';
    } else {
      html += '<div class="favorites-list">';
      favorites.forEach(driverId => {
        html += '<div class="favorite-item">';
        html += '<div class="favorite-avatar">🚗</div>';
        html += `<div class="favorite-info">`;
        html += `<p class="favorite-id">Conductor: ${driverId}</p>`;
        html += `<button class="btn-sm" onclick="requestRide('${driverId}')">Solicitar Viaje</button>`;
        html += `</div>`;
        html += '</div>';
      });
      html += '</div>';
    }
    
    html += '</div>';

    return html;
  }

  private renderPaymentHistorySection(): string {
    const payments = this.passenger.getPaymentHistory();
    
    let html = '<div class="payment-history-section">';
    html += '<h2>💸 Historial de Pagos</h2>';
    
    if (payments.length === 0) {
      html += '<p class="empty">No tienes pagos registrados</p>';
    } else {
      const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
      
      html += '<div class="payment-summary">';
      html += `<p><strong>Total Gastado:</strong> $${totalSpent.toFixed(2)}</p>`;
      html += `<p><strong>Transacciones:</strong> ${payments.length}</p>`;
      html += '</div>';

      html += '<div class="payments-list">';
      payments.slice(-5).reverse().forEach(payment => {
        html += '<div class="payment-item">';
        html += `<div class="payment-method">${this.getPaymentIcon(payment.method)}</div>`;
        html += `<div class="payment-details">`;
        html += `<p><strong>$${payment.amount.toFixed(2)}</strong></p>`;
        html += `<small>${payment.method} • ${new Date(payment.date).toLocaleDateString()}</small>`;
        html += `</div>`;
        html += '</div>';
      });
      html += '</div>';
    }
    
    html += '</div>';

    return html;
  }

  private renderRatingsSection(): string {
    const ratings = this.passenger.getRatings();
    const avgRating = this.passenger.getAverageRating();
    
    let html = '<div class="ratings-section">';
    html += '<h2>⭐ Mis Calificaciones</h2>';
    
    if (ratings.length === 0) {
      html += '<p class="empty">Aún no has sido calificado por conductores</p>';
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
        html += '</div>';
      });
      html += '</div>';
    }
    
    html += '</div>';

    return html;
  }


private getPaymentIcon(method: string): string {
    const icons: Record<string, string> = {  // ← Agregar tipo
      'CASH': '💵',
      'CARD': '💳',
      'WALLET': '👛',
      'TRANSFER': '🏦'
    };
    return icons[method] || '💰';  // ← Agregar valor por defecto
  }
  

  public renderCompact(): string {
    let html = '<div class="passenger-compact">';
    html += `<div class="passenger-avatar">👤</div>`;
    html += `<div class="passenger-info">`;
    html += `<h3>${this.passenger.getFullName()}</h3>`;
    html += `<div class="passenger-stats-inline">`;
    html += `<span>⭐ ${this.passenger.getAverageRating().toFixed(1)}</span>`;
    html += `<span>🎯 ${this.passenger.getRidesCount()} viajes</span>`;
    html += `<span>💳 $${this.passenger.getWalletBalance().toFixed(2)}</span>`;
    html += `</div>`;
    html += `</div>`;
    html += '</div>';

    return html;
  }
}
