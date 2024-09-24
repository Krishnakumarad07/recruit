const mongoose= require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:false
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },

    name:
    {
        type:String,
    },
    role:{
        type:String,
    },
    Location:{
        type:String
    },
    State:{
        type:String,

    },
    Gender:
    {
        type:String,
        enum:["Male","Female","Not to say"],
    },

});
const userDB=mongoose.model('Users',userSchema);
module.exports=userDB;
