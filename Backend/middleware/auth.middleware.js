const jwt=require('jsonwebtoken');  
const User=require('../models/user')


const protect = async (req,res,next)=>{
    
    let token=req.headers.authorization;
    if(token && token.startsWith('Bearer')){
        try {
            token=token.split(' ')[1];
            
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
            console.log(decoded)
            req.user=await User.findById(decoded.id).select('-password');
            console.log(req.user);
            if(!req.user){
                return res.status(401).json({message : 'Not authorized, token failed'});
            }
            next();
        }
        catch(error){
            res.status(401).json({message : 'Not authorized, no token'});
        }
    }
    else{
        return res.status(401).json({message : 'Not authorized, no token'});
    }
}


const admin=(req,res,next)=>{
    if(req.user.role==='admin'){
        next();
    }
    else{
        res.status(403).json({message : 'Not authorized as an admin'});
    }
}

module.exports={admin,protect}