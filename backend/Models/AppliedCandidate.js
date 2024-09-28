const mongoose=require ('mongoose')
AppliedCandidatesSchema=new mongoose.Schema({
    Company:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"organisations",
        require:true,
    },
    position:{
        type:String
    },
    jobType:{
        type:String,
        enum:["Full-Time","Part-Time"],
    },
    name:{
        type:String,

    },
    email:{
        type:String,
        unique:true
    },
    Gender:{
        type:String,
        enum: ["Male", "Female", "Not to say"],

    },
    dateOfBirth:{
        type:Date,
    },
    address:{
        type:String,
    },
    state:{
        type:String,
    },
    country:{
        type:String,
    },
    educationqualification:{
        type:String,
    },
    percentage:{
        type:mongoose.Schema.Types.Decimal128,
    },
    resume:{
        type:String,
    },
    phone:{
        type:Number,
    },
    status:{
        type:String,
        enum:['waiting','round-1','round-2',"Technical","HR","Selected","Rejected"],
        default:"waiting",
    },
    hrRoundDate:{
        type:Date,
    }
});
const Candidates=mongoose.model("Candidates", AppliedCandidatesSchema);
module.exports=Candidates;

