const express=require('express');
const router=express.Router();
const {protect,admin}=require('../middleware/auth.middleware');
const bookingController=require('../controllers/booking.Controller');

router.post('/send-otp',protect,bookingController.sendBookingOTP);
router.post('/',protect,bookingController.bookEvent);
router.put('/:id/confirm',protect,admin,bookingController.confirmBooking);
router.get('/my',protect,bookingController.getMyBooking);
router.delete('/:id',protect,bookingController.cancelBooking);




module.exports=router;