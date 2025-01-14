const mongoose= require('mongoose')

const UserSchema= new mongoose.Schema(
    {
        noms:{type:String, required:true},
        email:{type:String, required:true, unique:true,trim:true},
        mdp:{type:String, required:true,trim:true}  
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", UserSchema);
module.exports=User;