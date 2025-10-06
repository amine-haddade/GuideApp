import Booking from '../Models/Booking.js';
import TripPack from '../Models/Pack.js';

export const createBooking = async (req, res) => {
  try {
    const { userID, tripID } = req.body;
    if (!userID || !tripID) return res.status(400).json({ message: 'userID and tripID are required.' });

    const trip = await TripPack.findById(tripID);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });

    const currentBookings = await Booking.countDocuments({ tripID, isCancelled: false });
    if (currentBookings >= trip.maxCapacity) return res.status(403).json({ message: 'Trip is fully booked.' });

    const existingBooking = await Booking.findOne({ userID, tripID, isCancelled: false });
    if (existingBooking) return res.status(409).json({ message: 'You have already booked this trip.' });

    const newBooking = new Booking({ userID, tripID });
    await newBooking.save();

    res.status(201).json({ message: 'Booking created.', booking: newBooking });
  } catch (error) {
  console.error('Booking error:', error);
  res.status(500).json({ message: 'Server error.' });
}
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userID tripID');
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.status(200).json(booking);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ userID: req.params.userID }).populate('tripID');
    res.status(200).json(bookings);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getBookingsByGuide = async (req, res) => {
  try {
    const trips = await TripPack.find({ guideID: req.params.guideID });
    const tripIDs = trips.map(trip => trip._id);
    const bookings = await Booking.find({ tripID: { $in: tripIDs } }).populate('userID tripID');
    res.status(200).json(bookings);
  } catch {
    res.status(500).json({ message: 'Server error.' });
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
