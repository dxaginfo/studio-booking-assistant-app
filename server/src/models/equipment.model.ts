import { Model, DataTypes, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

interface EquipmentAttributes {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  isAvailable: boolean;
  studioId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EquipmentCreationAttributes {
  name: string;
  description?: string;
  hourlyRate: number;
  isAvailable?: boolean;
  studioId: string;
}

class Equipment extends Model<EquipmentAttributes, EquipmentCreationAttributes> implements EquipmentAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public hourlyRate!: number;
  public isAvailable!: boolean;
  public studioId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Association methods
  public static associate() {
    const { Studio, BookingEquipment } = require('./index');
    
    // Equipment belongs to a studio
    Equipment.belongsTo(Studio, { foreignKey: 'studioId' });
    
    // Equipment can be part of many booking equipment associations
    Equipment.hasMany(BookingEquipment, { foreignKey: 'equipmentId' });
  }

  public static initialize(sequelize: Sequelize) {
    Equipment.init(
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
        hourlyRate: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        isAvailable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        studioId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'studios',
            key: 'id',
          },
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
        modelName: 'Equipment',
        tableName: 'equipment',
      }
    );
  }
}

export default Equipment;
