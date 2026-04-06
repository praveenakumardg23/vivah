import Booking from '../models/booking.model.js';
import Hall from '../models/hall.model.js';

// POST create booking (User)
export const createBooking = async (req, res) => {
  try {
    const { hallId, date, guests, notes } = req.body;

    const hall = await Hall.findById(hallId);
    if (!hall) return res.status(404).json({ msg: 'Hall not found' });

    // Check if date is blocked
    const bookingDate = new Date(date);
    const isBlocked = hall.blockedDates.some(
      (d) => new Date(d).toDateString() === bookingDate.toDateString()
    );
    if (isBlocked) {
      return res.status(400).json({ msg: 'This date is not available' });
    }

    // Check if already booked (confirmed booking)
    const existingBooking = await Booking.findOne({
      hall: hallId,
      date: bookingDate,
      status: { $in: ['PENDING', 'CONFIRMED'] }
    });
    if (existingBooking) {
      return res.status(400).json({ msg: 'This date is already booked' });
    }

    const booking = await Booking.create({
      hall: hallId,
      user: req.user.id,
      date: bookingDate,
      guests,
      notes,
      totalPrice: hall.price
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id, isOfflineBooking: false })
      .populate('hall', 'name location images price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET bookings for owner's halls (also works for agent viewing managed halls)
export const getOwnerBookings = async (req, res) => {
  try {
    const role = req.user.role;
    let hallIds = [];

    if (role === 'ADMIN') {
      // Admin sees all bookings
      const allHalls = await Hall.find({}).select('_id');
      hallIds = allHalls.map((h) => h._id);
    } else if (role === 'AGENT') {
      // Agent sees bookings for halls they manage
      const halls = await Hall.find({ managedBy: req.user.id }).select('_id');
      hallIds = halls.map((h) => h._id);
    } else {
      // Owner sees bookings for halls they own
      const halls = await Hall.find({ owner: req.user.id }).select('_id');
      hallIds = halls.map((h) => h._id);
    }

    const bookings = await Booking.find({ hall: { $in: hallIds } })
      .populate('hall', 'name location city')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// PUT update booking status (Owner: confirm/reject)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('hall');

    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // Only owner of the hall can confirm/reject
    const isOwner = booking.hall.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const isAgent = req.user.role === 'AGENT';

    if (!isOwner && !isAdmin && !isAgent) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // If confirmed, block that date
    if (status === 'CONFIRMED') {
      const hall = await Hall.findById(booking.hall._id);
      if (!hall.blockedDates.some(
        (d) => new Date(d).toDateString() === new Date(booking.date).toDateString()
      )) {
        hall.blockedDates.push(booking.date);
        await hall.save();
      }
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// DELETE cancel booking (User who made it / Admin)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    const isOwner = booking.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.json({ msg: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// POST create offline booking (Owner - manual entry)
export const createOfflineBooking = async (req, res) => {
  try {
    const { hallId, date, guests, offlineGuestName, offlineGuestPhone, notes } = req.body;

    const hall = await Hall.findById(hallId);
    if (!hall) return res.status(404).json({ msg: 'Hall not found' });

    const isOwner = hall.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    const isAgent = hall.managedBy?.toString() === req.user.id;

    if (!isOwner && !isAdmin && !isAgent) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const bookingDate = new Date(date);

    // Block the date
    if (!hall.blockedDates.some(
      (d) => new Date(d).toDateString() === bookingDate.toDateString()
    )) {
      hall.blockedDates.push(bookingDate);
      await hall.save();
    }

    const booking = await Booking.create({
      hall: hallId,
      user: req.user.id, // owner adds it on behalf
      date: bookingDate,
      guests,
      notes,
      totalPrice: hall.price,
      status: 'CONFIRMED',
      isOfflineBooking: true,
      offlineGuestName,
      offlineGuestPhone
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};