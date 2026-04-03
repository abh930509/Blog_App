import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name']
    },
    email:{
        type:String,
        required:[true,'please provide email.'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'please provide password.']
    },
    mobile:{
        type:Number,
        default:null
    },
     refresh_token:{
        type:String,
        default:""
    },
    last_login_date:{
        type:Date,
        default:""
    },
    posts:[
        {  type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }
    ]
},{
    timestamps:true
})

const UserModel =mongoose.model('User',userSchema);
export default UserModel;