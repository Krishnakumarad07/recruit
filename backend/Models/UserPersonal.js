const mongoose=require("mongoose");

const UserPersonal=new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref:'Users',
        required: true,
    },
    name:
    {
        type:String,
        required: true,
    },
    role:{
        type:String,
        required:true,
    },
    Location:{
        type:String,
        required:true,
    },
    State:{
        type:String,
        required:true,
    },
    Gender:
    {
        type:String,
        enum:["Male","Female","Not to say"],
        required:true,
    },

});
const UserPersonalDB=mongoose.model('UserPersonal',UserPersonal);
module.exports = UserPersonalDB;