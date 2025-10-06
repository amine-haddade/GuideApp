import Booking from '../Models/Booking.js';
import TripPack from '../Models/Pack.js';
import User from '../Models/userModel.js'
import mongoose from 'mongoose';


export const createBooking = async (req, res) => {
  try {
    const { userID, packID } = req.body;
    if (!userID || !packID) return res.status(400).json({ message: 'userID and packID are required.' });

    const trip = await TripPack.findById(packID);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });

    const user = await User.findOne({ _id: userID, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'User not found or has been deleted.' });
    }

    const currentBookings = await Booking.countDocuments({ packID, isCancelled: false });
    if (currentBookings >= trip.maxCapacity) return res.status(403).json({ message: 'Trip is fully booked.' });

    const existingBooking = await Booking.findOne({ userID, packID, isCancelled: false });
    if (existingBooking) return res.status(409).json({ message: 'You have already booked this trip.' });

    const newBooking = new Booking({ userID, packID });
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
    const packs = await TripPack.find({ guideId: guideID });
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

export const updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Booking not found.' });
    res.status(200).json({ message: 'Booking updated.', booking: updated });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Booking not found.' });
    res.status(200).json({ message: 'Booking deleted.' });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};
