const express=require('express')
const router=express.Router();
const eventController=require('../controllers/eventController')
const {protect,admin}=require('../middleware/auth.middleware')

router.get('/',eventController.getAllEvents);
router.get('/:id',eventController.getEventsById);
router.post('/',protect,admin,eventController.createEvent)
router.put('/:id',protect,admin,eventController.updateEvent);
router.delete('/:id',protect,admin,eventController.deleteEvent);

module.exports=router;