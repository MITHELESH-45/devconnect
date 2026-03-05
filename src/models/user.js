require('dotenv').config();
const jwt= require('jsonwebtoken');
const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');


const userSchema=new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email"+value);
            }
        },
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        validate(value){
            if(!validator.isStrongPassword(value)) {
                throw new Error("password not strong"+value);
            }
        },

    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        /* validate only execulte at user creation first time not on the 
        updating so we need to add runValidators:true 
        in findByIdAndUpdate method in app.js file*/
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    },

    about:{
        type:String,
        maxlength:500,
        default:"this is a default about section"
    },

    photoUrl:{
        type:String,
        default:"https://www.w3schools.com/howto/img_avatar.png",
        validate(value){
            if(!validator.isURL(value)) {
                throw new Error("Invalid URL:"+value);
            }
        },
    },

    skills:{
        type:[String],
    },
},
{
   timestamps:true,
},
);

userSchema.methods.toJWT=function(){
    const user=this;

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
    return token;
}

userSchema.methods.verifyPassword=async function(passwordByUser){
     const user=this;

     const passwordMatch= await bcrypt.compare(passwordByUser,user.password);
    return passwordMatch;
}

const User=mongoose.model("User",userSchema);

module.exports=User;

