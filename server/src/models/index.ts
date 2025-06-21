import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Models
import User from './user.model';
import Studio from './studio.model';
import Equipment from './equipment.model';
import StudioAvailability from './studioAvailability.model';
import Booking from './booking.model';
import BookingEquipment from './bookingEquipment.model';
import Payment from './payment.model';
import PrepTemplate from './prepTemplate.model';
import SentPrep from './sentPrep.model';
import Notification from './notification.model';

// Database configuration
import { sequelize } from '../config/database';

dotenv.config();

// Initialize models
User.initialize(sequelize);
Studio.initialize(sequelize);
Equipment.initialize(sequelize);
StudioAvailability.initialize(sequelize);
Booking.initialize(sequelize);
BookingEquipment.initialize(sequelize);
Payment.initialize(sequelize);
PrepTemplate.initialize(sequelize);
SentPrep.initialize(sequelize);
Notification.initialize(sequelize);

// Define associations
User.associate();
Studio.associate();
Equipment.associate();
StudioAvailability.associate();
Booking.associate();
BookingEquipment.associate();
Payment.associate();
PrepTemplate.associate();
SentPrep.associate();
Notification.associate();

export {
  sequelize,
  User,
  Studio,
  Equipment,
  StudioAvailability,
  Booking,
  BookingEquipment,
  Payment,
  PrepTemplate,
  SentPrep,
  Notification,
};
