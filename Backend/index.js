const express=require("express")
const cors=require('cors');
const authRoutes=require('./routes/auth.routes')
const eventRoutes=require('./routes/events.routes');
const bookingRoutes=require('./routes/booking.routes')
const app=express();


app.use(cors());
app.use(express.json());


//routes

app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
// app.use('/api/bookings',bookingRoutes);

module.exports=app;