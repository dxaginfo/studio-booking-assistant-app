import { Request, Response } from 'express';
import { Studio, Equipment, StudioAvailability } from '../models';

// Get all studios
export const getStudios = async (req: Request, res: Response) => {
  try {
    const studios = await Studio.findAll({
      include: [
        {
          model: Equipment,
          as: 'equipment',
        },
        {
          model: StudioAvailability,
          as: 'availability',
        },
      ],
      order: [['name', 'ASC']],
    });

    res.json(studios);
  } catch (error) {
    console.error('Get studios error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get studio by ID
export const getStudioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const studio = await Studio.findByPk(id, {
      include: [
        {
          model: Equipment,
          as: 'equipment',
        },
        {
          model: StudioAvailability,
          as: 'availability',
        },
      ],
    });

    if (!studio) {
      return res.status(404).json({ message: 'Studio not found' });
    }

    res.json(studio);
  } catch (error) {
    console.error('Get studio by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new studio
export const createStudio = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      capacity,
      hourlyRate,
      availability,
      equipment,
    } = req.body;

    // Create the studio
    const studio = await Studio.create({
      name,
      description,
      capacity,
      hourlyRate,
    });

    // Add availability if provided
    if (availability && availability.length > 0) {
      const availabilityPromises = availability.map((avail: any) => {
        return StudioAvailability.create({
          studioId: studio.id,
          dayOfWeek: avail.dayOfWeek,
          startTime: avail.startTime,
          endTime: avail.endTime,
          isAvailable: true,
        });
      });

      await Promise.all(availabilityPromises);
    }

    // Add equipment if provided
    if (equipment && equipment.length > 0) {
      const equipmentPromises = equipment.map((equip: any) => {
        return Equipment.create({
          studioId: studio.id,
          name: equip.name,
          description: equip.description,
          hourlyRate: equip.hourlyRate,
          isAvailable: true,
        });
      });

      await Promise.all(equipmentPromises);
    }

    // Fetch the created studio with all associations
    const createdStudio = await Studio.findByPk(studio.id, {
      include: [
        {
          model: Equipment,
          as: 'equipment',
        },
        {
          model: StudioAvailability,
          as: 'availability',
        },
      ],
    });

    res.status(201).json(createdStudio);
  } catch (error) {
    console.error('Create studio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a studio
export const updateStudio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      capacity,
      hourlyRate,
      isActive,
    } = req.body;

    // Find studio
    const studio = await Studio.findByPk(id);
    if (!studio) {
      return res.status(404).json({ message: 'Studio not found' });
    }

    // Update studio fields
    studio.name = name || studio.name;
    studio.description = description !== undefined ? description : studio.description;
    studio.capacity = capacity !== undefined ? capacity : studio.capacity;
    studio.hourlyRate = hourlyRate !== undefined ? hourlyRate : studio.hourlyRate;
    studio.isActive = isActive !== undefined ? isActive : studio.isActive;

    await studio.save();

    // Get updated studio with associations
    const updatedStudio = await Studio.findByPk(id, {
      include: [
        {
          model: Equipment,
          as: 'equipment',
        },
        {
          model: StudioAvailability,
          as: 'availability',
        },
      ],
    });

    res.json(updatedStudio);
  } catch (error) {
    console.error('Update studio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
