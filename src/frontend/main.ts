import { Administrator } from '../models/Administrator';
import { Driver } from '../models/Driver';
import { Passenger } from '../models/Passenger';
import { Ride } from '../models/Ride';
import { RideList } from './components/RideList';
import { UserList } from './components/UserList';
import { DriverView } from './views/DriverView';
import { PassengerView } from './views/PassengerView';

// Interfaces y tipos (solo para anotaciones)

// Enums (necesitan existir en runtime)
import {
  PaymentMethod,
  VehicleType
} from '../interfaces/index';

/**
 * Punto de entrada principal del frontend InDriver
 * Demuestra el uso de TypeScript en el cliente
 */
class InDriverApp {
  private userList: UserList;
  private rideList: RideList;

  constructor() {
    this.userList = new UserList('main-container');
    this.rideList = new RideList('rides-container');
    this.initializeApp();
  }

  private initializeApp(): void {
    console.log('🚗 Iniciando aplicación InDriver con TypeScript');
    
    // Crear datos de ejemplo
    this.createSampleData();
    
    // Renderizar aplicación
    this.renderApplication();
  }

  private createSampleData(): void {
    console.log('\n📦 Creando datos de ejemplo...\n');

    // ============================================
    // CREAR CONDUCTORES
    // ============================================
    
    const driver1 = new Driver(
      'DRV001',
      'Carlos',
      'Ramírez',
      'carlos.ramirez@indriver.com',
      {
        email: 'carlos.ramirez@indriver.com',
        phone: '+57 300 123 4567',
        address: {
          street: 'Calle 45 #12-34',
          city: 'Bogotá',
          country: 'Colombia',
          zipCode: '110111',
          latitude: 4.7110,
          longitude: -74.0721
        }
      },
      'DRV-2024-001',
      'CO-123456789',
      {
        plate: 'ABC-123',
        brand: 'Chevrolet',
        model: 'Spark GT',
        year: 2022,
        color: 'Blanco',
        type: VehicleType.HATCHBACK  // ✅ Usando enum
      }
    );

    driver1.updateLocation(4.7110, -74.0721);
    driver1.setAvailability(true);
    driver1.addRating({
      rideId: 'RIDE-001',
      rating: 5,
      comment: 'Excelente conductor, muy amable y puntual',
      date: new Date('2025-10-15')
    });
    driver1.addRating({
      rideId: 'RIDE-002',
      rating: 4,
      comment: 'Buen servicio, condujo con cuidado',
      date: new Date('2025-10-20')
    });

    const driver2 = new Driver(
      'DRV002',
      'María',
      'González',
      'maria.gonzalez@indriver.com',
      {
        email: 'maria.gonzalez@indriver.com',
        phone: '+57 310 987 6543',
        address: {
          street: 'Carrera 30 #50-60',
          city: 'Bogotá',
          country: 'Colombia',
          zipCode: '110121'
        }
      },
      'DRV-2024-002',
      'CO-987654321',
      {
        plate: 'XYZ-789',
        brand: 'Renault',
        model: 'Logan',
        year: 2021,
        color: 'Gris',
        type: VehicleType.SEDAN  // ✅ Usando enum
      }
    );

    driver2.updateLocation(4.6862, -74.0563);
    driver2.setAvailability(true);
    driver2.addRating({
      rideId: 'RIDE-003',
      rating: 5,
      comment: 'Conductora muy profesional y educada',
      date: new Date('2025-10-22')
    });

    // ============================================
    // CREAR PASAJEROS
    // ============================================

    const passenger1 = new Passenger(
      'PSG001',
      'Juan',
      'Pérez',
      'juan.perez@gmail.com',
      {
        email: 'juan.perez@gmail.com',
        phone: '+57 315 555 1234',
        address: {
          street: 'Calle 100 #15-20',
          city: 'Bogotá',
          country: 'Colombia',
          zipCode: '110111'
        }
      },
      'PSG-2024-001'
    );

    passenger1.addFunds(100000);
    passenger1.addFavoriteDriver('DRV001');
    passenger1.incrementRides();
    passenger1.incrementRides();
    passenger1.addRating({
      rideId: 'RIDE-001',
      rating: 5,
      comment: 'Pasajero puntual y respetuoso',
      date: new Date('2025-10-15')
    });

    const passenger2 = new Passenger(
      'PSG002',
      'Ana',
      'Martínez',
      'ana.martinez@gmail.com',
      {
        email: 'ana.martinez@gmail.com',
        phone: '+57 318 444 5678',
        address: {
          street: 'Avenida 19 #80-50',
          city: 'Bogotá',
          country: 'Colombia',
          zipCode: '110221'
        }
      },
      'PSG-2024-002'
    );

    passenger2.addFunds(50000);
    passenger2.addFavoriteDriver('DRV002');

    // ============================================
    // CREAR ADMINISTRADOR
    // ============================================

    const admin1 = new Administrator(
      'ADM001',
      'Pedro',
      'López',
      'pedro.lopez@indriver.com',
      {
        email: 'pedro.lopez@indriver.com',
        phone: '+57 320 111 2222',
        address: {
          street: 'Calle 72 #10-50',
          city: 'Bogotá',
          country: 'Colombia',
          zipCode: '110231'
        }
      },
      'ADM-2024-001',
      'Operaciones',
      4
    );

    admin1.addManagedCity('Bogotá');
    admin1.addManagedCity('Medellín');

    // Agregar usuarios a la lista
    this.userList.addUsers([driver1, driver2, passenger1, passenger2, admin1]);

    // ============================================
    // CREAR VIAJES
    // ============================================

    const ride1 = new Ride(
      'RIDE001',
      'PSG001',
      {
        address: 'Calle 100 #15-20, Bogotá',
        latitude: 4.6862,
        longitude: -74.0563
      },
      {
        address: 'Aeropuerto El Dorado, Bogotá',
        latitude: 4.7016,
        longitude: -74.1469
      },
      35000,
      15.5,
      25
    );

    ride1.acceptRide('DRV001');
    ride1.startRide();
    ride1.completeRide(35000, {
      amount: 35000,
      method: PaymentMethod.CASH,  // ✅ Usando enum
      currency: 'COP',
      date: new Date()
    });

    const ride2 = new Ride(
      'RIDE002',
      'PSG001',
      {
        address: 'Centro Comercial Santafé, Bogotá',
        latitude: 4.7234,
        longitude: -74.0424
      },
      {
        address: 'Universidad Nacional, Bogotá',
        latitude: 4.6389,
        longitude: -74.0834
      },
      25000,
      10.2,
      18
    );

    ride2.acceptRide('DRV002');
    ride2.startRide();

    const ride3 = new Ride(
      'RIDE003',
      'PSG002',
      {
        address: 'Avenida 19 #80-50, Bogotá',
        latitude: 4.6673,
        longitude: -74.0557
      },
      {
        address: 'Parque de la 93, Bogotá',
        latitude: 4.6764,
        longitude: -74.0469
      },
      18000,
      5.8,
      12
    );

    const ride4 = new Ride(
      'RIDE004',
      'PSG002',
      {
        address: 'Terminal de Transporte, Bogotá',
        latitude: 4.6558,
        longitude: -74.0997
      },
      {
        address: 'Plaza de Bolívar, Bogotá',
        latitude: 4.5981,
        longitude: -74.0758
      },
      22000,
      8.5,
      15
    );

    // Agregar viajes a la lista
    this.rideList.addRides([ride1, ride2, ride3, ride4]);

    // Actualizar estadísticas de conductores con ganancias
    driver1.incrementRides();
    driver1.addEarnings(35000);
    driver2.incrementRides();
  }

  private renderApplication(): void {
    console.log('\n📋 Renderizando componentes del frontend:\n');
    console.log('═'.repeat(80));

    // LISTA DE USUARIOS
    console.log('\n👥 LISTA DE TODOS LOS USUARIOS');
    console.log('─'.repeat(80));
    console.log(this.userList.render());

    // TABLA DE USUARIOS
    console.log('\n\n📊 TABLA DE USUARIOS');
    console.log('─'.repeat(80));
    console.log(this.userList.renderTable());

    // SOLO CONDUCTORES
    console.log('\n\n🚗 CONDUCTORES REGISTRADOS');
    console.log('─'.repeat(80));
    console.log(this.userList.renderDriversOnly());

    // SOLO PASAJEROS
    console.log('\n\n👤 PASAJEROS REGISTRADOS');
    console.log('─'.repeat(80));
    console.log(this.userList.renderPassengersOnly());

    // VISTA DETALLADA DE CONDUCTOR
    const drivers = this.userList.getDrivers();
    if (drivers.length > 0) {
      const driverView = new DriverView(drivers[0]);
      console.log('\n\n🚗 DASHBOARD DEL CONDUCTOR');
      console.log('─'.repeat(80));
      console.log(driverView.renderDashboard());
    }

    // VISTA DETALLADA DE PASAJERO
    const passengers = this.userList.getPassengers();
    if (passengers.length > 0) {
      const passengerView = new PassengerView(passengers[0]);
      console.log('\n\n👤 DASHBOARD DEL PASAJERO');
      console.log('─'.repeat(80));
      console.log(passengerView.renderDashboard());
    }

    // LISTA DE VIAJES
    console.log('\n\n🗺️ LISTA DE VIAJES');
    console.log('─'.repeat(80));
    console.log(this.rideList.render());

    // VIAJES DISPONIBLES
    console.log('\n\n📍 VIAJES DISPONIBLES');
    console.log('─'.repeat(80));
    const availableRides = this.rideList.getAvailableRides();
    if (availableRides.length > 0) {
      const availableList = new RideList('available-rides');
      availableList.addRides(availableRides);
      console.log(availableList.render());
    } else {
      console.log('<div class="empty">No hay viajes disponibles en este momento</div>');
    }

    // ESTADÍSTICAS DE VIAJES
    console.log('\n\n📊 ESTADÍSTICAS DE VIAJES');
    console.log('─'.repeat(80));
    console.log(this.rideList.renderStatistics());

    // RESUMEN FINAL
    console.log('\n\n' + '═'.repeat(80));
    console.log('✅ RESUMEN DE LA APLICACIÓN INDRIVER');
    console.log('═'.repeat(80));
    console.log(`\n📊 Total de Usuarios: ${this.userList['users'].length}`);
    console.log(`   🚗 Conductores: ${this.userList.getDrivers().length}`);
    console.log(`   👤 Pasajeros: ${this.userList.getPassengers().length}`);
    console.log(`   👨‍💼 Administradores: ${this.userList.filterByRole('ADMINISTRATOR').length}`);
    console.log(`\n🗺️ Total de Viajes: ${this.rideList['rides'].length}`);
    console.log(`   📍 Solicitados: ${this.rideList.filterByStatus('REQUESTED').length}`);
    console.log(`   ✅ Aceptados: ${this.rideList.filterByStatus('ACCEPTED').length}`);
    console.log(`   🚗 En Progreso: ${this.rideList.filterByStatus('IN_PROGRESS').length}`);
    console.log(`   ✔️ Completados: ${this.rideList.filterByStatus('COMPLETED').length}`);
    console.log(`   ❌ Cancelados: ${this.rideList.filterByStatus('CANCELLED').length}`);
    console.log('\n' + '═'.repeat(80));
    console.log('🎯 Frontend TypeScript con POO funcionando correctamente');
    console.log('✨ Proyecto InDriver completamente migrado a TypeScript');
    console.log('═'.repeat(80) + '\n');
  }

  public demonstrateFeatures(): void {
    console.log('\n🎮 DEMOSTRACIÓN DE CARACTERÍSTICAS\n');

    const availableDrivers = this.userList.getAvailableDrivers();
    console.log(`\n✅ Conductores Disponibles: ${availableDrivers.length}`);
    availableDrivers.forEach(driver => {
      console.log(`   - ${driver.getFullName()} (${driver.getVehicle().brand} ${driver.getVehicle().model})`);
    });

    const passengers = this.userList.getPassengers();
    if (passengers.length > 0) {
      const passengerId = passengers[0].getId();
      const passengerRides = this.rideList.filterByPassenger(passengerId);
      console.log(`\n🎯 Viajes del pasajero ${passengers[0].getFullName()}: ${passengerRides.length}`);
    }

    const drivers = this.userList.getDrivers();
    if (drivers.length > 0) {
      const driverId = drivers[0].getId();
      const driverRides = this.rideList.filterByDriver(driverId);
      console.log(`\n🚗 Viajes del conductor ${drivers[0].getFullName()}: ${driverRides.length}`);
    }
  }
}

// Inicializar y ejecutar la aplicación
const app = new InDriverApp();
app.demonstrateFeatures();

export default app;
