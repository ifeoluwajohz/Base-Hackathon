const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    wallet_address: {
        type: String,
        required: true,
        unique: true
    },
    fullname:{
        type: String,
        required :true,
        lowercase: true,
        trim: true
    },
    username:{
        type: String,
        lowercase: true,
        required: true ,
        unique: true

    },
    home_address: {
        type: String,
        lowercase: true
    },
    email: {
        unique: true,
        type : String,
        required : [true, 'please enter an email'],
        lowercase : true,
        validate : [isEmail, 'please enter a valid email']
    },
    password : {
        type: String,
        required : [true, 'please enter a password'],
        minlength : [8, 'Minimum password length is 8 characters']
    },
    otpCode: {
        type: String,
        default: null
    },
    otpExpiration : {
        type: Date,
        dafault: null
    },
    bio: { 
        type: String, 
        required: true
     },
    dateOfBirth: { 
        type: Date, 
    },
    workExperience: [{ 
        company: String, 
        position: String, 
        years: Number 
    }],
    role: { 
        type: String, 
        enum: ['employer', 'employee'], 
        required: true ,
        lowercase: true,

    },
    location: { 
        type: String, 
        required: true 
    },
    ratings: { 
        type: Number, 
        min: 0, 
        max: 5, 
    },
    feedbacks: [{ 
        comment: String, 
        date: { type: Date, default: Date.now } 
    }],
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], 
        lowercase: true,

    },
    profilePicture: { 
        type: String 
    }, // URL for profile picture
    availableJobs: [{ 
        title: String, 
        description: String, 
        salary: Number 
    }]

})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next()
});

// static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if (user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
};


const User = mongoose.model('user', userSchema);
module.exports = User;