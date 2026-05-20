const User=require('../models/user');
const bcrypt=require('bcrypt')
const {sendOTPEmail}=require('../utils/email')
const OTP=require('../models/opt')
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const ganerateOTP=()=>Math.floor(100000+Math.random()*900000).toString();
const genereteToken=(id,role)=>jwt.sign({id,role},process.env.JWT_SECRET_KEY,{expiresIn:'30d'});
async function registerUser(req,res){



    const {name,email,password}=req.body;
    const  userExist=await User.findOne({email});
    if(userExist){
        return res.status(400).json({error:'User already Existed'})
    }
    const salt=await bcrypt.genSalt(10);
    const hashedpassword=await bcrypt.hash(password,salt);

    try {
        const user=await User.create({name,email,password : hashedpassword})
        const otp=Math.floor(100000+Math.random()*900000).toString();
        console.log(`OTP for ${email} : ${otp}`);
        await OTP.create({email,otp,action:'account_verification'});
        await sendOTPEmail(email,otp,'account_verification');

        res.status(201).json({
            message : "User registered successfully. Please check your email for otp to verify your account",
            email : user.email
        })

    }
    catch (error){
        res.status(400).json({error : error.message});
    }

}



async function loginUser(req,res){
    try{    
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message : "Invalid Credential"});
        const isMatched=await bcrypt.compare(password,user.password);

        if(!isMatched)return res.status(400).json({message : "Invalid Credential"});
        console.log(user);
        if(!user.isVarified && user.role==='user'){
            console.log("user is not verified sending otp");
            const otp=ganerateOTP();
            await User.findOneAndDelete({email : user.email,action:'account_verification'});
            await OTP.create({email : user.email,otp,action : 'account_verification'});
            await sendOTPEmail(user.email,otp,'account_verification');
            console.log("sent otp")
            return res.status(403).json({message : 'Acount not verified',needsVerification:true,email : user.email});
        }
        console.log("User is verified and sending details to client");
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            token : genereteToken(user._id,user.role)
        })

    }
    catch(error){
        res.json({message : "Server Error",error : error.message});
    }
}


async function verifyOTP(req,res){
    try{
        const {email,otp}=req.body;
        const validOTP=await OTP.findOne({email,otp,action : 'account_verification'});
        if(!validOTP){  
            return res.status(400).json({message : "Invalid or expired OTP"})
        }
        console.log("verified otp")
        const user =await User.findOneAndUpdate({email},{isVarified : true});
        await OTP.deleteOne({_id:validOTP._id});
        const token=genereteToken(user._id,user.role);
        console.log(`token generated : ${token}`);
        return res.json({
            _id : user.id,
            name : user.name,
            email : user.email,
            role : user.role,
            token :  token
        })
    }
    catch (error){
        return res.status(500).json({message : 'Server Error'});
    }
}

module.exports={registerUser,loginUser,verifyOTP};