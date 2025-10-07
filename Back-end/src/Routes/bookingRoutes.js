import express from 'express';
import {
  createBooking,
  getBookingById,
  getBookingsByUser,
  getBookingsByGuide,
  cancelBooking,
  deleteBooking,
  getAllBookings
} from '../Controllers/bookingController.js';
import { verifyToken } from '../Middlewares/verifyJwtToken.js';
import { authorizeRoles } from '../Middlewares/authorizeRole.js';

const router = express.Router();

router.get('/guide', verifyToken, authorizeRoles(["guide","admin"]), getBookingsByGuide);
router.get('/user', verifyToken, authorizeRoles(["client","admin"]), getBookingsByUser);
router.get('/all', verifyToken , authorizeRoles(["admin"]), getAllBookings);
router.post('/', verifyToken, authorizeRoles(["client","admin"]), createBooking);
router.get('/:id', verifyToken, authorizeRoles(["client" ,"guide","admin"]), getBookingById);
router.patch('/cancel/:bookingID', verifyToken, authorizeRoles(["client","admin"]), cancelBooking);
router.delete('/:id', verifyToken, authorizeRoles(["admin"]), deleteBooking);

export default router;
