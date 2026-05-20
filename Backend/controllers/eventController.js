const Event=require('../models/Event')
async function getAllEvents(req,res){
    try{
        const filters={};
        if(req.query.category){
            filters.category=req.query.category;
        }
        
        if(req.query.location){
            filters.location=req.query.location;
        }
        const events=await Event.find(filters);
        res.json(events);
        console.log("sent events");
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
}


async function getEventsById(req,res){
    try{
        const id=req.params.id;
        
        const event=await Event.findById(id);
        if(!event){
            return res.status(404).json({error : 'Event Not Found'});
        }
        res.json(event);
    }catch(error){
        res.json({error : error.message});
    }
}


async function createEvent(req,res){
    const {title,description,date,location,category,totalSeats,availableSeats,ticketPrice,imageUrl,createdBy}=req.body;
    try{
        const event=await Event.create({title,description,date,location,category,totalSeats,availableSeats,ticketPrice,imageUrl,createdBy});
        res.status(201).json(event);
    }
    catch (error){
        return res.status(500).json({error : error.message});
    }
}

async function updateEvent(req,res){
    const {title,description,date,location,category,totalSeats,availableSeats,ticketPrice,imageUrl}=req.body;
    try{
        const id=req.params.id;
        console.log(id);
        const event=await Event.findByIdAndUpdate(id,{title,description,date,location,category,totalSeats,availableSeats,
            ticketPrice,imageUrl},{new : true});
        if(!event){
            return res.status(404).json({error : "event not found "});
        }
        res.json(event);
    }
    catch (error){
        res.json({error : error.message});
    }
}
async function deleteEvent(req,res){
    try{
        const id = req.params.id;
        const event = await Event.findByIdAndDelete(id);
        if(!event){
            return res.status(404).json({error : 'Event Not Found'});
        }
        res.json({message : "Event Deleted Successfully"});
    }
    catch (error){
        res.status(500).json({error : error.message});
    }
}

module.exports={getAllEvents,getEventsById,createEvent,updateEvent,deleteEvent}