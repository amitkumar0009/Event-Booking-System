const Booking=require('../models/Booking.model');
const OTP=require('../models/opt');
const Event=require('../models/Event');
const mail=require('../utils/email');


const generateOtp=()=>{
    return Math.floor(100000+Math.random*900000).toString();
}


async function sendBookingOTP(req,res){
    try{
        const otp=generateOtp();
        await OTP.findOneAndDelete({email : req.user.email,action : 'event_booking'});
        await OTP.create({email : req.user.email,otp,action : 'event_booking'});
        await mail.sendBookingEmail(req.user.email,otp,'event_booking');
        res.json({message : 'Otp sent to email '});
    }
    catch (error){
        res.status(500).json({message : "Error sendtin otp",error : error.message});
    }
}

async function bookEvent(req,res){
    try{
        const {eventId,otp}=req.body;
        const validOtp=await OTP.find({email : req.user.email,otp,action : 'event_booking'});
        if(!validOtp){
            return res.status(400).json({message : 'Invalid or expired OTP for booking '});
        }
        const event = await Event.findById(eventId);
        if(!event){
            return res.status(404).json({message : 'Event not found'});
        }
        if(event.availableSeats<=0)return res.status(400).json({message : 'No seat Available'});

        const existingBooking=await Booking.findOne({userId: req.user.id,eventId});
        if(existingBooking && existingBooking.status!=='cancelled'){
            return res.status(400).json({message:  'Already booked or pending'});
        }

        const booking = await Booking.create({
            userId : req.user.id,
            eventId,
            status: 'pending',
            paymentStatus : 'not_paid',
            amount:event.ticketPrice
        })
        await OTP.deleteOne({_id : validOtp._id});
        res.status(201).json({message : 'Booking request submitte',booking});
    }
    catch (error){
        res.status(500).json({message : 'Server Error',error : error.message});
    }

}

async function confirmBooking(req,res){
    try{
        const {paymentStatus}=req.body;
        const booking=await Booking.findById(req.param.id).populate('userId').populate('eventId');
        if(!booking)return res.status(404).json({message : 'Booking not found'});
        if(booking.status==='confirmed')return res.status(400).json({message : 'Booking is already confirmed'});

        const event=await Event.findById(booking.eventId._id);

        if(event.availableSeats<=0){
            return res.status(400).json({message : 'No seats available o confirm'});
        }

        booking.status='confirmed';

        if(paymentStatus){
            booking.paymentStatus=paymentStatus;
        }
        await booking.save();

        event.availableSeats-=1;

        await event.save();

        await mail.sendBookingEmail(booking.userId,email,booking.userId.name,booking.eventId.title);

        res.json({message : 'Booking confirmd successfully',booking});
    }
    catch(error){
        res.status(500).json({message : 'Server Error',error : error.message});
    }
}



