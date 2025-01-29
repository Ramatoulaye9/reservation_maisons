const mongoose= require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema= new mongoose.Schema(
    {
        noms:{type:String, required:true},
        email:{type:String, required:true, unique:true,trim:true},
        mdp:{type:String, required:true,trim:true},
        role:{type:String, enum:['admin','user'],default:'user'}
    },
    {
        timestamps: true
    }
);

//Avant de sauvegarder, hacher le mot de passe
UserSchema.pre('save', async function(next) {
    if(!this.isModified('mdp')) return next();
    const salt = await bcrypt.genSalt(10);
    this.mdp = await bcrypt.hash(this.mdp,salt);
    next();
})

const User = mongoose.model("User", UserSchema);
module.exports=User;