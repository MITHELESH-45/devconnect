const validator=require("validator");

const validateSignUpData=(req)=>{
    const{firstName,lastName,email,password,skills}=req.body;

    if(!firstName||!lastName){
        throw new Error("First name and last name are required");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Invalid email address");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }
    else if(skills && skills.length>10){
        throw new Error("Skills should be less than 10");
    }
    return true;

}

const validateEmail=(email)=>{
     
    if(!validator.isEmail(email)){
        throw new error("Invalid email address");
    }
    return true;
}

const validateAllowedList=(req)=>{
     
    const AllowedList=["firstName","lastName","age","gender","about","photoUrl"];

    const isAllowed=Object.keys(req.body).every((key)=>AllowedList.includes(key));

    return isAllowed;

}




module.exports={
    validateSignUpData,validateEmail,validateAllowedList
};
