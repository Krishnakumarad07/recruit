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
    }

});
const userDB=mongoose.model('Users',userSchema);
module.exports=userDB;
