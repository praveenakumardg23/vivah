import Hall from '../models/hall.model.js';
import User from '../models/user.model.js';

// GET all halls (public - for users to browse)
export const getAllHalls = async (req, res) => {
  try {
    const { city, location, date } = req.query;
    const filter = { isActive: true };

    if (city) filter.city = { $regex: city, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };

    let halls = await Hall.find(filter)
      .populate('owner', 'name phone')
      .populate('managedBy', 'name phone');

    // Filter out halls with blocked dates if date provided
    if (date) {
      const bookingDate = new Date(date);
      halls = halls.filter(
        (hall) => !hall.blockedDates.some(
          (d) => new Date(d).toDateString() === bookingDate.toDateString()
        )
      );
    }

    res.json(halls);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET single hall
export const getHallById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id)
      .populate('owner', 'name phone email')
      .populate('managedBy', 'name phone');

    if (!hall) return res.status(404).json({ msg: 'Hall not found' });

    res.json(hall);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET halls managed by agent
export const getAgentHalls = async (req, res) => {
  try {
    const halls = await Hall.find({ managedBy: req.user.id })
      .populate('owner', 'name phone');
    res.json(halls);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET halls owned by owner
export const getOwnerHalls = async (req, res) => {
  try {
    const halls = await Hall.find({ owner: req.user.id })
      .populate('managedBy', 'name phone');
    res.json(halls);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// POST create hall (Agent / Admin)
export const createHall = async (req, res) => {
  try {
    const {
      name, description, location, city, address,
      capacity, price, amenities, images, ownerPhone
    } = req.body;

    // Find or create owner by phone
    let owner = await User.findOne({ phone: ownerPhone });

    if (!owner) {
      // Register new owner
      owner = await User.create({
        phone: ownerPhone,
        role: 'OWNER'
      });
    } else if (owner.role === 'USER') {
      // Upgrade USER to OWNER
      owner.role = 'OWNER';
      await owner.save();
    }

    const hall = await Hall.create({
      name, description, location, city, address,
      capacity, price,
      amenities: amenities || [],
      images: images || [],
      owner: owner._id,
      managedBy: req.user.id
    });

    res.status(201).json(hall);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// PUT update hall (Agent who manages it / Admin)
export const updateHall = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) return res.status(404).json({ msg: 'Hall not found' });

    // Only the managing agent or admin can update
    const isAdmin = req.user.role === 'ADMIN';
    const isManager = hall.managedBy?.toString() === req.user.id;

    if (!isAdmin && !isManager) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // If ownerPhone is being updated, reassign owner
    if (req.body.ownerPhone) {
      let owner = await User.findOne({ phone: req.body.ownerPhone });
      if (!owner) {
        owner = await User.create({ phone: req.body.ownerPhone, role: 'OWNER' });
      } else if (owner.role === 'USER') {
        owner.role = 'OWNER';
        await owner.save();
      }
      req.body.owner = owner._id;
      delete req.body.ownerPhone;
    }

    const updated = await Hall.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// DELETE hall (Agent who manages it / Admin)
export const deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) return res.status(404).json({ msg: 'Hall not found' });

    const isAdmin = req.user.role === 'ADMIN';
    const isManager = hall.managedBy?.toString() === req.user.id;

    if (!isAdmin && !isManager) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Hall.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Hall deleted' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// PUT add/remove blocked dates (Owner / Agent / Admin)
export const updateBlockedDates = async (req, res) => {
  try {
    const { date, action } = req.body; // action: 'add' | 'remove'
    const hall = await Hall.findById(req.params.id);

    if (!hall) return res.status(404).json({ msg: 'Hall not found' });

    const isAdmin = req.user.role === 'ADMIN';
    const isManager = hall.managedBy?.toString() === req.user.id;
    const isOwner = hall.owner.toString() === req.user.id;

    if (!isAdmin && !isManager && !isOwner) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const blockDate = new Date(date);

    if (action === 'add') {
      hall.blockedDates.push(blockDate);
    } else if (action === 'remove') {
      hall.blockedDates = hall.blockedDates.filter(
        (d) => new Date(d).toDateString() !== blockDate.toDateString()
      );
    }

    await hall.save();
    res.json(hall);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};