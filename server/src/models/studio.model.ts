import { Model, DataTypes, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

interface StudioAttributes {
  id: string;
  name: string;
  description: string;
  capacity: number;
  hourlyRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface StudioCreationAttributes {
  name: string;
  description?: string;
  capacity?: number;
  hourlyRate: number;
  isActive?: boolean;
}

class Studio extends Model<StudioAttributes, StudioCreationAttributes> implements StudioAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public capacity!: number;
  public hourlyRate!: number;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Association methods
  public static associate() {
    const { Equipment, StudioAvailability, Booking } = require('./index');
    
    // A studio has many equipment items
    Studio.hasMany(Equipment, { foreignKey: 'studioId', as: 'equipment' });
    
    // A studio has many availability slots
    Studio.hasMany(StudioAvailability, { foreignKey: 'studioId', as: 'availability' });
    
    // A studio has many bookings
    Studio.hasMany(Booking, { foreignKey: 'studioId', as: 'bookings' });
  }

  public static initialize(sequelize: Sequelize) {
    Studio.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: () => uuidv4(),
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        capacity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        hourlyRate: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Studio',
        tableName: 'studios',
      }
    );
  }
}

export default Studio;
