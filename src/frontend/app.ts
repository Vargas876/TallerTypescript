/**
 * Aplicación Frontend de GoDrive con TypeScript
 */

// ==========================================
// INTERFACES Y TYPES
// ==========================================

interface Statistics {
    totalUsers: number;
    drivers: number;
    passengers: number;
    totalRides: number;
    completedRides: number;
    inProgressRides: number;
  }
  
  interface Vehicle {
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    type: string;
  }
  
  interface Location {
    latitude: number;
    longitude: number;
  }
  
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'DRIVER' | 'PASSENGER' | 'ADMINISTRATOR';
    
    driverId?: string;
    licenseNumber?: string;
    vehicle?: Vehicle;
    currentLocation?: Location;
    availableForRides?: boolean;
    totalRides?: number;
    earnings?: number;
    
    passengerId?: string;
    ridesCount?: number;
    walletBalance?: number;
    favoriteDrivers?: string[];
    
    adminId?: string;
    department?: string;
    accessLevel?: number;
    
    averageRating?: number;
    ratings?: Rating[];
  }
  
  interface Rating {
    rideId: string;
    rating: number;
    comment: string;
    date: Date | string;
  }
  
  interface RideLocation {
    address: string;
    latitude: number;
    longitude: number;
  }
  
  interface Payment {
    method: string;
    amount: number;
    currency: string;
    date: Date | string;
  }
  
  interface Ride {
    id: string;
    passengerId: string;
    driverId?: string;
    status: 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    origin: RideLocation;
    destination: RideLocation;
    requestedPrice: number;
    finalPrice?: number;
    distance: number;
    estimatedDuration: number;
    payment?: Payment;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  }
  
  // ==========================================
  // CONSTANTES
  // ==========================================  
const API_URL: string = 'http://localhost:3000/api';

// ==========================================
// TEMA
// ==========================================
function toggleTheme(): void {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    localStorage.setItem('theme', newTheme);
}

// Cargar tema guardado
const savedTheme: string = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const themeIcon = document.getElementById('theme-icon');
if (themeIcon) {
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// ==========================================
// ESTADÍSTICAS
// ==========================================
async function loadStatistics(): Promise<void> {
    const statsDiv = document.getElementById('statistics');
    if (!statsDiv) return;

    statsDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando estadísticas...</p></div>';

    try {
        const response: Response = await fetch(`${API_URL}/statistics`);
        const data: Statistics = await response.json();

        statsDiv.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-label">Total Usuarios</div>
                    <div class="stat-value">${data.totalUsers}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🚗</div>
                    <div class="stat-label">Conductores</div>
                    <div class="stat-value">${data.drivers}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👤</div>
                    <div class="stat-label">Pasajeros</div>
                    <div class="stat-value">${data.passengers}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🗺️</div>
                    <div class="stat-label">Viajes Totales</div>
                    <div class="stat-value">${data.totalRides}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-label">Completados</div>
                    <div class="stat-value">${data.completedRides}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🚗</div>
                    <div class="stat-label">En Progreso</div>
                    <div class="stat-value">${data.inProgressRides}</div>
                </div>
            </div>
        `;
    } catch (error) {
        statsDiv.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${(error as Error).message}</p></div>`;
    }
}

// ==========================================
// USUARIOS
// ==========================================
async function loadUsers(): Promise<void> {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando usuarios...</p></div>';

    try {
        const response: Response = await fetch(`${API_URL}/users`);
        const users: User[] = await response.json();

        if (users.length === 0) {
            contentDiv.innerHTML = '<div class="empty"><div class="empty-icon">📭</div><p>No hay usuarios registrados</p></div>';
            return;
        }

        let html = '<div class="user-grid">';
        users.forEach((user: User) => {
            html += renderUserCard(user);
        });
        html += '</div>';
        contentDiv.innerHTML = html;

    } catch (error) {
        contentDiv.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${(error as Error).message}</p></div>`;
    }
}

function renderUserCard(user: User): string {
    const roleIcons: Record<string, string> = {
        'DRIVER': '🚗',
        'PASSENGER': '👤',
        'ADMINISTRATOR': '👨‍💼'
    };

    const fullName: string = `${user.firstName} ${user.lastName}`;

    let details = '';
    let mapSection = '';
    
    if (user.role === 'DRIVER') {
        const availabilityBadge: string = user.availableForRides 
            ? '<span class="availability-badge available">Disponible</span>'
            : '<span class="availability-badge unavailable">No disponible</span>';
        
        const locationInfo: string = user.currentLocation 
            ? `${user.currentLocation.latitude.toFixed(4)}, ${user.currentLocation.longitude.toFixed(4)}`
            : 'Sin ubicación';

        details = `
            <div class="detail-row">
                <span class="detail-icon">🆔</span>
                <span class="detail-value">${user.driverId || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">🚙</span>
                <span class="detail-value">${user.vehicle?.brand || 'N/A'} ${user.vehicle?.model || ''}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">🪪</span>
                <span class="detail-value">${user.licenseNumber || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">📍</span>
                <span class="detail-value" style="font-size: 11px;">${locationInfo}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">🟢</span>
                <span class="detail-value">${availabilityBadge}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">🚗</span>
                <span class="detail-value">Viajes: ${user.totalRides || 0}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">⭐</span>
                <span class="detail-value">${(user.averageRating || 0).toFixed(1)}/5.0</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">💰</span>
                <span class="detail-value">$${(user.earnings || 0).toLocaleString()}</span>
            </div>
        `;

        if (user.currentLocation && user.currentLocation.latitude && user.currentLocation.longitude) {
            const mapId = `map-${user.id}`;
            mapSection = `
                <div class="map-container">
                    <div class="map-label">
                        <span>📍</span>
                        <span>Ubicación Actual del Conductor</span>
                    </div>
                    <div id="${mapId}" class="mini-map"></div>
                </div>
            `;
            
            setTimeout(() => {
                initMap(mapId, user.currentLocation!.latitude, user.currentLocation!.longitude, fullName, '🚗');
            }, 100);
        }
        
    } else if (user.role === 'PASSENGER') {
        const locationInfo: string = user.currentLocation 
            ? `${user.currentLocation.latitude.toFixed(4)}, ${user.currentLocation.longitude.toFixed(4)}`
            : 'Sin ubicación';

        details = `
            <div class="detail-row">
                <span class="detail-icon">🆔</span>
                <span class="detail-value">${user.passengerId || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">📍</span>
                <span class="detail-value" style="font-size: 11px;">${locationInfo}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">🚗</span>
                <span class="detail-value">Viajes: ${user.ridesCount || 0}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">⭐</span>
                <span class="detail-value">${(user.averageRating || 0).toFixed(1)}/5.0</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">💳</span>
                <span class="detail-value">Saldo: $${(user.walletBalance || 0).toLocaleString()}</span>
            </div>
            ${user.favoriteDrivers && user.favoriteDrivers.length > 0 ? `
            <div class="detail-row">
                <span class="detail-icon">❤️</span>
                <span class="detail-value">Favoritos: ${user.favoriteDrivers.length}</span>
            </div>
            ` : ''}
        `;

        if (user.currentLocation && user.currentLocation.latitude && user.currentLocation.longitude) {
            const mapId = `map-${user.id}`;
            mapSection = `
                <div class="map-container">
                    <div class="map-label">
                        <span>📍</span>
                        <span>Ubicación Actual del Pasajero</span>
                    </div>
                    <div id="${mapId}" class="mini-map"></div>
                </div>
            `;
            
            setTimeout(() => {
                initMap(mapId, user.currentLocation!.latitude, user.currentLocation!.longitude, fullName, '👤');
            }, 100);
        }
        
    } else if (user.role === 'ADMINISTRATOR') {
        details = `
            <div class="detail-row">
                <span class="detail-icon">🆔</span>
                <span class="detail-value">${user.adminId || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">🏢</span>
                <span class="detail-value">${user.department || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-icon">🔐</span>
                <span class="detail-value">Nivel ${user.accessLevel || 0}</span>
            </div>
        `;
    }

    return `
        <div class="user-card ${user.role.toLowerCase()}">
            <div class="user-header">
                <div class="user-avatar">${roleIcons[user.role]}</div>
                <div class="user-info">
                    <h3>${fullName}</h3>
                    <span class="badge ${user.role.toLowerCase()}">${user.role}</span>
                </div>
            </div>
            <div class="user-details">
                <div class="detail-row">
                    <span class="detail-icon">📧</span>
                    <span class="detail-value">${user.email || 'N/A'}</span>
                </div>
                ${details}
            </div>
            ${mapSection}
        </div>
    `;
}

// ==========================================
// CONDUCTORES
// ==========================================
async function loadDrivers(): Promise<void> {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando conductores...</p></div>';

    try {
        const response: Response = await fetch(`${API_URL}/drivers`);
        const drivers: User[] = await response.json();

        if (drivers.length === 0) {
            contentDiv.innerHTML = '<div class="empty"><div class="empty-icon">🚗</div><p>No hay conductores registrados</p></div>';
            return;
        }

        let html = '<div class="user-grid">';
        drivers.forEach((driver: User) => {
            html += renderUserCard(driver);
        });
        html += '</div>';
        contentDiv.innerHTML = html;

    } catch (error) {
        contentDiv.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${(error as Error).message}</p></div>`;
    }
}

// ==========================================
// PASAJEROS
// ==========================================
async function loadPassengers(): Promise<void> {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando pasajeros...</p></div>';

    try {
        const response: Response = await fetch(`${API_URL}/passengers`);
        const passengers: User[] = await response.json();

        if (passengers.length === 0) {
            contentDiv.innerHTML = '<div class="empty"><div class="empty-icon">👤</div><p>No hay pasajeros registrados</p></div>';
            return;
        }

        let html = '<div class="user-grid">';
        passengers.forEach((passenger: User) => {
            html += renderUserCard(passenger);
        });
        html += '</div>';
        contentDiv.innerHTML = html;

    } catch (error) {
        contentDiv.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${(error as Error).message}</p></div>`;
    }
}

// ==========================================
// VIAJES
// ==========================================
async function loadRides(): Promise<void> {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando viajes...</p></div>';

    try {
        const response: Response = await fetch(`${API_URL}/rides`);
        const rides: Ride[] = await response.json();

        if (rides.length === 0) {
            contentDiv.innerHTML = '<div class="empty"><div class="empty-icon">🗺️</div><p>No hay viajes registrados</p></div>';
            return;
        }

        let html = '<div class="user-grid">';
        rides.forEach((ride: Ride) => {
            html += renderRideCard(ride);
        });
        html += '</div>';
        contentDiv.innerHTML = html;

    } catch (error) {
        contentDiv.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${(error as Error).message}</p></div>`;
    }
}

function renderRideCard(ride: Ride): string {
    const statusConfig: Record<string, { label: string; icon: string; color: string; bg: string }> = {
        'REQUESTED': { label: 'Solicitado', icon: '📍', color: '#FFA500', bg: 'rgba(255, 165, 0, 0.1)' },
        'ACCEPTED': { label: 'Aceptado', icon: '✅', color: '#00C853', bg: 'rgba(0, 200, 83, 0.1)' },
        'IN_PROGRESS': { label: 'En Progreso', icon: '🚗', color: '#2196F3', bg: 'rgba(33, 150, 243, 0.1)' },
        'COMPLETED': { label: 'Completado', icon: '✔️', color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.1)' },
        'CANCELLED': { label: 'Cancelado', icon: '❌', color: '#F44336', bg: 'rgba(244, 67, 54, 0.1)' }
    };

    const config = statusConfig[ride.status] || statusConfig['REQUESTED'];
    const distance: string = ride.distance ? `${ride.distance.toFixed(1)} km` : 'N/A';
    const duration: string = ride.estimatedDuration ? `${ride.estimatedDuration} min` : 'N/A';
    const price: string = ride.requestedPrice ? `$${ride.requestedPrice.toLocaleString()}` : 'N/A';
    const finalPrice: string | null = ride.finalPrice ? `$${ride.finalPrice.toLocaleString()}` : null;

    return `
        <div class="user-card" style="border-left: 4px solid ${config.color};">
            <div class="user-header">
                <div class="user-avatar" style="background: ${config.bg}; color: ${config.color};">
                    ${config.icon}
                </div>
                <div class="user-info">
                    <h3>Viaje ${ride.id}</h3>
                    <span class="badge" style="background: ${config.bg}; color: ${config.color};">
                        ${config.label}
                    </span>
                </div>
            </div>
            <div class="user-details">
                <div class="detail-row">
                    <span class="detail-icon">📍</span>
                    <span class="detail-label">Origen:</span>
                </div>
                <div class="detail-row" style="margin-left: 30px; margin-bottom: 8px;">
                    <span class="detail-value" style="font-size: 12px; color: var(--text-secondary);">
                        ${ride.origin?.address || 'No especificado'}
                    </span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-icon">🎯</span>
                    <span class="detail-label">Destino:</span>
                </div>
                <div class="detail-row" style="margin-left: 30px; margin-bottom: 8px;">
                    <span class="detail-value" style="font-size: 12px; color: var(--text-secondary);">
                        ${ride.destination?.address || 'No especificado'}
                    </span>
                </div>

                <div class="detail-row">
                    <span class="detail-icon">👤</span>
                    <span class="detail-value">Pasajero: ${ride.passengerId || 'N/A'}</span>
                </div>

                ${ride.driverId ? `
                <div class="detail-row">
                    <span class="detail-icon">🚗</span>
                    <span class="detail-value">Conductor: ${ride.driverId}</span>
                </div>
                ` : ''}

                <div class="detail-row">
                    <span class="detail-icon">📏</span>
                    <span class="detail-value">Distancia: ${distance}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-icon">⏱️</span>
                    <span class="detail-value">Duración: ${duration}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-icon">💰</span>
                    <span class="detail-value">Precio: ${price}</span>
                </div>

                ${finalPrice ? `
                <div class="detail-row">
                    <span class="detail-icon">✅</span>
                    <span class="detail-value">Precio Final: ${finalPrice}</span>
                </div>
                ` : ''}

                ${ride.payment?.method ? `
                <div class="detail-row">
                    <span class="detail-icon">💳</span>
                    <span class="detail-value">Método: ${ride.payment.method}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

async function loadAvailableRides(): Promise<void> {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    contentDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando viajes disponibles...</p></div>';

    try {
        const response: Response = await fetch(`${API_URL}/rides/available`);
        const rides: Ride[] = await response.json();

        if (rides.length === 0) {
            contentDiv.innerHTML = '<div class="empty"><div class="empty-icon">📍</div><p>No hay viajes disponibles en este momento</p></div>';
            return;
        }

        let html = '<h2 style="text-align: center; margin-bottom: 20px;">🚗 Viajes Disponibles para Conductores</h2>';
        html += '<div class="user-grid">';
        rides.forEach((ride: Ride) => {
            html += renderRideCard(ride);
        });
        html += '</div>';
        contentDiv.innerHTML = html;

    } catch (error) {
        contentDiv.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><p>${(error as Error).message}</p></div>`;
    }
}

// ==========================================
// MINI-MAPAS
// ==========================================
function initMap(mapId: string, lat: number, lng: number, userName: string, icon: string = '🚗'): void {
    try {
        const mapElement = document.getElementById(mapId);
        if (!mapElement) return;

        // @ts-ignore - Leaflet está cargado globalmente
        const map = L.map(mapId).setView([lat, lng], 15);

        // @ts-ignore
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // @ts-ignore
        const userIcon = L.divIcon({
            html: `<div style="font-size: 24px;">${icon}</div>`,
            className: 'custom-car-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const circleColor: string = icon === '🚗' ? '#00C853' : '#2196F3';

        // @ts-ignore
        L.marker([lat, lng], { icon: userIcon })
            .addTo(map)
            .bindPopup(`
                <div style="text-align: center; padding: 5px;">
                    <strong style="color: ${circleColor};">${icon} ${userName}</strong><br>
                    <small style="color: #666;">Ubicación actual</small><br>
                    <small style="color: #999;">${lat.toFixed(4)}, ${lng.toFixed(4)}</small>
                </div>
            `)
            .openPopup();

        // @ts-ignore
        L.circle([lat, lng], {
            color: circleColor,
            fillColor: circleColor,
            fillOpacity: 0.1,
            radius: 300
        }).addTo(map);

    } catch (error) {
        console.error('Error inicializando mapa:', error);
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
window.onload = (): void => {
    loadStatistics();
    loadUsers();
};

// Auto-actualizar cada 10 segundos
setInterval((): void => {
    loadStatistics();
}, 10000);

// Exponer funciones globalmente para los botones HTML
(window as any).toggleTheme = toggleTheme;
(window as any).loadStatistics = loadStatistics;
(window as any).loadUsers = loadUsers;
(window as any).loadDrivers = loadDrivers;
(window as any).loadPassengers = loadPassengers;
(window as any).loadRides = loadRides;
(window as any).loadAvailableRides = loadAvailableRides;
