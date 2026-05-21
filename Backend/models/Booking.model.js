const mongoose=require('mongoose');
const bookingSchema=new mongoose.Schema({
    userId : {type : mongoose.Schema.ObjectId,ref : "user",required : true},
    eventId : {type : mongoose.Schema.ObjectId,ref :"event",required : true},
    status : {type :String, enum : ['pending','confirmed','cancelled'],default : 'pending'},
    paymentStatus : {type : String,enum : ['non_paid','paid'],default : 'non_paid'},
    amount : {type : Number,required : true}

},{timestamps : true})

const model=mongoose.model('bookings',bookingSchema);
module.exports=model;