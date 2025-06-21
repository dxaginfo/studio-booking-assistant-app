import { Model, DataTypes, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

interface BookingAttributes {
  id: string;
  studioId: string;
  clientId: string;
  staffId?: string;
  startDatetime: Date;
  endDatetime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingCreationAttributes {
  studioId: string;
  clientId: string;
  staffId?: string;
  startDatetime: Date;
  endDatetime: Date;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: string;
  public studioId!: string;
  public clientId!: string;
  public staffId!: string;
  public startDatetime!: Date;
  public endDatetime!: Date;
  public status!: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  public notes!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Association methods
  public static associate() {
    const {
      User,
      Studio,
      BookingEquipment,
      Payment,
      SentPrep,
      Notification,
    } = require('./index');
    
    // A booking belongs to a studio
    Booking.belongsTo(Studio, { foreignKey: 'studioId' });
    
    // A booking belongs to a client (user)
    Booking.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
    
    // A booking may belong to a staff member (user)
    Booking.belongsTo(User, { foreignKey: 'staffId', as: 'staff' });
    
    // A booking has many booking equipment associations
    Booking.hasMany(BookingEquipment, { foreignKey: 'bookingId', as: 'bookingEquipment' });
    
    // A booking has many payments
    Booking.hasMany(Payment, { foreignKey: 'bookingId', as: 'payments' });
    
    // A booking has many sent prep materials
    Booking.hasMany(SentPrep, { foreignKey: 'bookingId', as: 'prepMaterials' });
    
    // A booking has many notifications
    Booking.hasMany(Notification, { foreignKey: 'bookingId', as: 'notifications' });
  }

  public static initialize(sequelize: Sequelize) {
    Booking.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: () => uuidv4(),
          primaryKey: true,
        },
        studioId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'studios',
            key: 'id',
          },
        },
        clientId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        staffId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        startDatetime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDatetime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
          allowNull: false,
          defaultValue: 'pending',
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        modelName: 'Booking',
        tableName: 'bookings',
      }
    );
  }
}

export default Booking;
