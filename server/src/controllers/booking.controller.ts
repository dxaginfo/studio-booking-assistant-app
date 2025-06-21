import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Booking, Studio, User, Equipment, BookingEquipment } from '../models';
import { sendNotification } from '../services/notification.service';

// Get all bookings (with filters)
export const getBookings = async (req: Request, res: Response) => {
  try {
    const {
      status,
      startDate,
      endDate,
      studioId,
      clientId,
      staffId,
    } = req.query;

    // Build filter object
    const filters: any = {};
    
    if (status) {
      filters.status = status;
    }
    
    if (studioId) {
      filters.studioId = studioId;
    }
    
    if (clientId) {
      filters.clientId = clientId;
    }
    
    if (staffId) {
      filters.staffId = staffId;
    }
    
    // Filter by date range if provided
    if (startDate || endDate) {
      filters.startDatetime = {};
      
      if (startDate) {
        filters.startDatetime[Op.gte] = new Date(startDate as string);
      }
      
      if (endDate) {
        filters.startDatetime[Op.lte] = new Date(endDate as string);
      }
    }

    // Get bookings with associated data
    const bookings = await Booking.findAll({
      where: filters,
      include: [
        {
          model: Studio,
          attributes: ['id', 'name', 'hourlyRate'],
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: BookingEquipment,
          as: 'bookingEquipment',
          include: [{
            model: Equipment,
            attributes: ['id', 'name', 'hourlyRate'],
          }],
        },
      ],
      order: [['startDatetime', 'ASC']],
    });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Studio,
          attributes: ['id', 'name', 'hourlyRate'],
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: BookingEquipment,
          as: 'bookingEquipment',
          include: [{
            model: Equipment,
            attributes: ['id', 'name', 'hourlyRate'],
          }],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      studioId,
      startDatetime,
      endDatetime,
      notes,
      equipment,
    } = req.body;

    // User ID is from authenticated user
    const clientId = req.user.id;

    // Check if studio exists
    const studio = await Studio.findByPk(studioId);
    if (!studio) {
      return res.status(404).json({ message: 'Studio not found' });
    }

    // Check if the studio is available during the requested time slot
    const conflictingBooking = await Booking.findOne({
      where: {
        studioId,
        status: {
          [Op.notIn]: ['cancelled'], // Exclude cancelled bookings
        },
        [Op.or]: [
          {
            // New booking starts during an existing booking
            startDatetime: {
              [Op.lt]: new Date(endDatetime),
            },
            endDatetime: {
              [Op.gt]: new Date(startDatetime),
            },
          },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(409).json({
        message: 'The studio is not available during the requested time slot',
      });
    }

    // Create booking
    const booking = await Booking.create({
      studioId,
      clientId,
      startDatetime: new Date(startDatetime),
      endDatetime: new Date(endDatetime),
      status: 'pending',
      notes,
    });

    // Add equipment to booking if provided
    if (equipment && equipment.length > 0) {
      for (const item of equipment) {
        await BookingEquipment.create({
          bookingId: booking.id,
          equipmentId: item.equipmentId,
          quantity: item.quantity || 1,
        });
      }
    }

    // Send notification to staff about new booking
    await sendNotification({
      type: 'booking_confirmation',
      userId: clientId,
      bookingId: booking.id,
      content: `Your booking request for ${studio.name} has been received and is pending confirmation.`,
    });

    // Fetch the created booking with all associations
    const createdBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Studio,
          attributes: ['id', 'name', 'hourlyRate'],
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: BookingEquipment,
          as: 'bookingEquipment',
          include: [{
            model: Equipment,
            attributes: ['id', 'name', 'hourlyRate'],
          }],
        },
      ],
    });

    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, staffId, notes } = req.body;

    // Find booking
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking
    booking.status = status || booking.status;
    booking.staffId = staffId || booking.staffId;
    booking.notes = notes !== undefined ? notes : booking.notes;

    await booking.save();

    // Send notification based on status update
    let notificationContent = '';
    
    switch (status) {
      case 'confirmed':
        notificationContent = `Your booking for ${new Date(booking.startDatetime).toLocaleString()} has been confirmed.`;
        break;
      case 'cancelled':
        notificationContent = `Your booking for ${new Date(booking.startDatetime).toLocaleString()} has been cancelled.`;
        break;
      case 'completed':
        notificationContent = `Your booking for ${new Date(booking.startDatetime).toLocaleString()} has been marked as completed.`;
        break;
      default:
        notificationContent = `Your booking status has been updated to ${status}.`;
    }

    // Send notification to client
    await sendNotification({
      type: status,
      userId: booking.clientId,
      bookingId: booking.id,
      content: notificationContent,
    });

    // Get updated booking with associations
    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: Studio,
          attributes: ['id', 'name', 'hourlyRate'],
        },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
