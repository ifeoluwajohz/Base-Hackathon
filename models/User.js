const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
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
    tel_number: {
        type: Number,
        unique: true
    },
    gender: {
        type: Boolean,
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
    cart: [
        {
            quantity: {type: Number, default: 1},
            productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        }
    ],
    Favorites: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
    }] // Reference to Product model for favorites

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