import Booking from '../Models/Booking.js';
import Pack from '../Models/Pack.js';
import User from '../Models/userModel.js'
import mongoose from 'mongoose';


export const createBooking = async (req, res) => {
  try {
    const { userID, packID, isVip = false, spotsBooked = 1 } = req.body;

    if (!userID || !packID || spotsBooked < 1) {
      return res.status(400).json({ message: 'userID, packID, and valid spotsBooked are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(packID)) {
      return res.status(400).json({ message: 'Invalid pack ID.' });
    }

    const trip = await Pack.findById(packID);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const user = await User.findOne({ _id: userID, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found or has been deleted.' });
    }

    const existingBookings = await Booking.find({ packID, isCancelled: false });

    // VIP logic
    if (isVip) {
      if (existingBookings.length > 0) {
        return res.status(403).json({ message: 'VIP booking not allowed. This pack already has bookings.' });
      }
    } else {
      const vipExists = existingBookings.some(b => b.isVip);
      if (vipExists) {
        return res.status(403).json({ message: 'Normal booking not allowed. This pack is reserved for a VIP.' });
      }
    }

    // Calculate total spots already booked
    const totalSpotsBooked = existingBookings.reduce((sum, b) => sum + (b.spotsBooked || 1), 0);

    if (totalSpotsBooked + spotsBooked > trip.maxClients) {
      return res.status(403).json({ message: 'Not enough spots available for this booking.' });
    }

    const alreadyBooked = existingBookings.find(b => b.userID.toString() === userID);
    if (alreadyBooked) {
      return res.status(409).json({ message: 'You have already booked this trip.' });
    }

    const newBooking = new Booking({ userID, packID, isVip, spotsBooked });
    await newBooking.save();

    res.status(201).json({ message: 'Booking created.', booking: newBooking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking ID.' });
    }

    const booking = await Booking.findById(id).populate('userID packID');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const getBookingsByUser = async (req, res) => {
  try {
    const { userID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user = await User.findOne({ _id: userID, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const bookings = await Booking.find({ userID }).populate('packID');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get bookings by user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const getBookingsByGuide = async (req, res) => {
  try {
    const { guideID } = req.params;

    // Validate guideID format
    if (!mongoose.Types.ObjectId.isValid(guideID)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid guide ID.',
        count: 0,
        data: []
      });
    }

    // Check if guide exists and is active
    const guide = await User.findOne({ _id: guideID, role: 'guide', isDeleted: false });
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found.',
        count: 0,
        data: []
      });
    }

    // Adapt to schema: query using 'guideId' instead of 'guideID'
    const packs = await Pack.find({ guideId: guideID });
    const packIDs = packs.map(pack => pack._id);

    // Find all bookings for those packs
    const bookings = await Booking.find({ packID: { $in: packIDs } })
      .populate('userID')
      .populate('packID');

    res.status(200).json({
      success: true,
      message: bookings.length === 0
        ? 'No bookings found for this guide.'
        : 'Bookings retrieved successfully.',
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings by guide error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      count: 0,
      data: []
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingID } = req.params;
    const userID = req.user._id; // comes from auth middleware

    const booking = await Booking.findById(bookingID);
    if (!booking || booking.isCancelled) {
      return res.status(404).json({ message: 'Booking not found or already cancelled.' });
    }

    if (booking.userID.toString() !== userID.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own bookings.' });
    }

    booking.isCancelled = true;
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


// export const updateBooking = async (req, res) => {
//   try {
//     const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: 'Booking not found.' });
//     res.status(200).json({ message: 'Booking updated.', booking: updated });
//   } catch {
//     res.status(500).json({ message: 'Server error.' });
//   }
// };

export const deleteBooking = async (req, res) => {
  try {
    const { bookingID } = req.params;
    const user = req.user; // comes from auth middleware

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const booking = await Booking.findById(bookingID);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    await Booking.findByIdAndDelete(bookingID);

    res.status(200).json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
