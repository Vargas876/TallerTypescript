import { Collection, Db, MongoClient } from 'mongodb';

/**
 * Clase para manejar la conexión y operaciones con MongoDB Atlas
 */
export class MongoDatabase {
  private static instance: MongoDatabase;
  private client: MongoClient;
  private db: Db | null = null;
  private usersCollection: Collection | null = null;
  private ridesCollection: Collection | null = null;

  private constructor() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/godrive';
    this.client = new MongoClient(uri);
  }

  public static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db('godrive');
      this.usersCollection = this.db.collection('users');
      this.ridesCollection = this.db.collection('rides');
      
      // Crear índices
      await this.usersCollection.createIndex({ email: 1 }, { unique: true });
      await this.usersCollection.createIndex({ role: 1 });
      await this.ridesCollection.createIndex({ status: 1 });
      await this.ridesCollection.createIndex({ passengerId: 1 });
      await this.ridesCollection.createIndex({ driverId: 1 });
      
      console.log(' Conectado a MongoDB Atlas');
    } catch (error) {
      console.error(' Error conectando a MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
    console.log('🔌 Desconectado de MongoDB Atlas');
  }

  // ============================================
  // OPERACIONES DE USUARIOS
  // ============================================

  public async createUser(userData: any): Promise<string> {
    if (!this.usersCollection) throw new Error('Database not connected');
    
    const result = await this.usersCollection.insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return result.insertedId.toString();
  }

  public async getUserById(id: string): Promise<any | null> {
    if (!this.usersCollection) throw new Error('Database not connected');
    return await this.usersCollection.findOne({ id });
  }

  public async getAllUsers(): Promise<any[]> {
    if (!this.usersCollection) throw new Error('Database not connected');
    return await this.usersCollection.find({}).toArray();
  }

  public async getUsersByRole(role: string): Promise<any[]> {
    if (!this.usersCollection) throw new Error('Database not connected');
    return await this.usersCollection.find({ role }).toArray();
  }

  public async updateUser(id: string, updates: any): Promise<boolean> {
    if (!this.usersCollection) throw new Error('Database not connected');
    
    const result = await this.usersCollection.updateOne(
      { id },
      { 
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  public async deleteUser(id: string): Promise<boolean> {
    if (!this.usersCollection) throw new Error('Database not connected');
    const result = await this.usersCollection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  public async deleteAllUsers(): Promise<number> {
    if (!this.usersCollection) throw new Error('Database not connected');
    const result = await this.usersCollection.deleteMany({});
    return result.deletedCount;
  }

  // ============================================
  // OPERACIONES DE VIAJES
  // ============================================

  public async createRide(rideData: any): Promise<string> {
    if (!this.ridesCollection) throw new Error('Database not connected');
    
    const result = await this.ridesCollection.insertOne({
      ...rideData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return result.insertedId.toString();
  }

  public async getRideById(id: string): Promise<any | null> {
    if (!this.ridesCollection) throw new Error('Database not connected');
    return await this.ridesCollection.findOne({ id });
  }

  public async getAllRides(): Promise<any[]> {
    if (!this.ridesCollection) throw new Error('Database not connected');
    return await this.ridesCollection.find({}).toArray();
  }

  public async getRidesByStatus(status: string): Promise<any[]> {
    if (!this.ridesCollection) throw new Error('Database not connected');
    return await this.ridesCollection.find({ status }).toArray();
  }

  public async getRidesByPassenger(passengerId: string): Promise<any[]> {
    if (!this.ridesCollection) throw new Error('Database not connected');
    return await this.ridesCollection.find({ passengerId }).toArray();
  }

  public async getRidesByDriver(driverId: string): Promise<any[]> {
    if (!this.ridesCollection) throw new Error('Database not connected');
    return await this.ridesCollection.find({ driverId }).toArray();
  }

  public async updateRide(id: string, updates: any): Promise<boolean> {
    if (!this.ridesCollection) throw new Error('Database not connected');
    
    const result = await this.ridesCollection.updateOne(
      { id },
      { 
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  public async deleteRide(id: string): Promise<boolean> {
    if (!this.ridesCollection) throw new Error('Database not connected');
    const result = await this.ridesCollection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  public async getStatistics(): Promise<any> {
    if (!this.usersCollection || !this.ridesCollection) {
      throw new Error('Database not connected');
    }

    const [users, rides] = await Promise.all([
      this.usersCollection.find({}).toArray(),
      this.ridesCollection.find({}).toArray()
    ]);

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      drivers: users.filter(u => u.role === 'DRIVER').length,
      passengers: users.filter(u => u.role === 'PASSENGER').length,
      administrators: users.filter(u => u.role === 'ADMINISTRATOR').length,
      totalRides: rides.length,
      requestedRides: rides.filter(r => r.status === 'REQUESTED').length,
      acceptedRides: rides.filter(r => r.status === 'ACCEPTED').length,
      inProgressRides: rides.filter(r => r.status === 'IN_PROGRESS').length,
      completedRides: rides.filter(r => r.status === 'COMPLETED').length,
      cancelledRides: rides.filter(r => r.status === 'CANCELLED').length
    };
  }
}
