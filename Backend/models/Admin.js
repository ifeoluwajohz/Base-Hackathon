const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const adminSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required :true,
        lowercase: true,
        trim: true
    },
    username:{
        type: String,
        lowercase: true
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
    }
})

adminSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next()
});

// static method to login user
adminSchema.statics.login = async function(email, password){
    const admin = await this.findOne({ email });
    if (admin){
        const auth = await bcrypt.compare(password, admin.password);
        if(auth){
            return admin
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
};


const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;