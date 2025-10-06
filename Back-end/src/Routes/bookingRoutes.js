import express from 'express';
import {
  createBooking,
  getBookingById,
  getBookingsByUser,
  getBookingsByGuide,
  updateBooking,
  deleteBooking
} from '../Controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/:id', getBookingById);
router.get('/user/:userID', getBookingsByUser);
router.get('/guide/:guideID', getBookingsByGuide);
router.patch('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
