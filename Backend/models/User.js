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
    fullname: {
        type: String,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        lowercase: true
    },
    home_address: {
        type: String,
        lowercase: true
    },

    email: {
        // unique: true,
        type: String,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        minlength: [8, 'Minimum password length is 8 characters']
    },
    otpCode: {
        type: String,
        default: null
    },
    otpExpiration: {  // Corrected 'default'
        type: Date,
        default: null
    },
    bio: {
        type: String,
        lowercase: true

    },
    dateOfBirth: {
        type: Date,
    },
    workExperience: [{
        company: String,
        position: String,
        JoinedFrom: Date,
        Till: Date,
        description: String
    }],
    role: {
        type: String,
        enum: ['employer', 'employee'],
        lowercase: true
    },
    location: {
        type: String
    },
    portfolio: {
        type: String
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5,
    },
    joinedAt: {
        type: Date
    },
    occupation:{
        type: String
    },
    feedbacks: [{
        comment: String,
        date: { type: Date, default: Date.now }
    }],
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        lowercase: true
    },
    profilePicture: {
        type: String
    },
    jobsCreated: [{
        title: String,
        description: String,
        salary: Number,
        stillAvailable: {
            type: Boolean,
            default: true
        }
    }],
    SkillAndExpertise: [{
        skill: { type: String, lowercase: true },  // Applied to the string
        Expertise: { type: String, lowercase: true }  // Applied to the string
    }],
    certification: [{
        role: { type: String, lowercase: true },  // Applied to the string
        CertificationName: { type: String, lowercase: true },  // Applied to the string
        certificationStatus: {
            type: String,  // Added `type`
            enum: ['completed', 'ongoing']
        },
        year: Date
    }]
});

// userSchema.pre('save', async function(next){
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt);
//     next()
// });

// // static method to login user
userSchema.statics.login = async function(wallet_address){
    const user = await this.findOne({ wallet_address });
    if (user){
        // const auth = await bcrypt.compare(password, user.password);
        // if(auth){
            return user
        }
        // throw Error('Incorrect password');
        // throw Error('Login error');

    // }
    // throw Error('Incorrect email');
};


const User = mongoose.model('user', userSchema);
module.exports = User;