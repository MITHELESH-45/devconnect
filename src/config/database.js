const mongoose = require('mongoose');

const connectDb= async()=>{
    await mongoose.connect("mongodb+srv://mitheleshk3005_db_user:D5QVBXvwS16VnRYj@cluster0.86pzodr.mongodb.net/devconnect=Cluster0");
}

module.exports=connectDb;

