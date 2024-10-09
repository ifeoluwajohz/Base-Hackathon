require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product')
const { isEmail } = require('validator');


const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const speakeasy = require('speakeasy');
const validator = require('validator'); 


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
});


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) =>{
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge
    })
}

async function generateOTP() {
    return speakeasy.totp({
        secret: process.env.SECRET,
        encoding: 'base32',
        step: 30,
    })
}


const handleErrors = (err) => {
    let errors = { email: "", password :""}

    //incorrect email
    if(err.message === 'Incorrect email') {
        errors.email = 'That email is not correct'
    }

    //incorrect password
    if(err.message === 'Incorrect password') {
        errors.password = 'That password is not correct'
    };


    //duplicate error code
    if(err.code === 11000){
        errors.email = 'That email is registered';
        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

module.exports.signup_get = (req, res) =>{
    res.send('signup');
}

module.exports.login_get = (req, res) =>{
    res.redirect('/login')
}

module.exports.signup_post = async (req, res) =>{
    const { fullname, email, password } = req.body;
    

    try{
        const Finduser = await User.findOne({ email });
        if(Finduser){
            return res.status(400).json({ err: 'Email already exists in database'})
        }
        if(!fullname){
            return res.status(400).json({message: 'fullname is required for a new account'})
        }
        if (!validator.isStrongPassword(password)) {
            throw Error('Password not strong enough')
        }
        const user = await User.create({fullname, email, password});
        // const json = res.locals.user;

        const token = createToken(user._id);
        // res.cookie('jwt', token, {httpOnly :true, maxaAge: 3600 * 1000})
        res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000, secure: true, // Set to true if using HTTPS
            sameSite: 'lax',})

        res.status(200).json({email});

    }catch(err){
        return res.status(400).json({ err: err.message });
    }

}

module.exports.login_post =  async(req, res) =>{
    const { email, password} = req.body;

    try{
        const Finduser = await User.findOne({ email });
        if(!Finduser){
            return res.status(400).json({ errors: 'Email not found in database'})
        }
        const user = await User.login( email, password );
        const token = createToken(user._id);
        const userId = user._id;

        res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000, secure: true, // Set to true if using HTTPS
            sameSite: 'lax',})
        res.status(200).json({email});

    }catch(err){
        return res.status(400).json({ err: err.message });
    }
};

module.exports.logout_get = async(req, res)=>{
    res.cookie('jwt', '', {maxAge : 1});
    res.redirect('/Home')
};

module.exports.forget_password_post = async (req, res)=> {
    const { email } = req.body;

    try{
        // Check if the email exists in the database
        const user = await User.findOne( {email} );
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not found in the database' });
        }
        const otpCode = await generateOTP();
        const otpExpiration = new Date(Date.now() + 5 * 60 * 100);

        user.otpCode = otpCode;
        user.otpExpiration = otpExpiration;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your one-time password for password reset is: ${otpCode}`,
        };
      
        await transporter.sendMail(mailOptions);
        // console.log(otpCode)
        res.status(201).json({Message: `Code has been sent to ${email}`})

    }catch(err){
        return res.status(500).json({ message: 'Internal server error', err: err.message})
    }

}
 
module.exports.confirm_otp_post = async (req, res)=> {
    const { email, code } = req.body
    const user = await User.findOne({ email });

    try{
        if(!user || !user.otpCode || !user.otpExpiration || user.otpExpiration < Date.now){
            return res.status(400).json({ message: 'Invalid email address or Otp'})
        }
        if(user.otpCode !== code){
            return res.status(400).json({ message: 'Incorrect code'})
        }

        user.otpCode = null;
        user.otpExpiration = null;
        await user.save();

        return res.status(200).json({ message: 'Code is correct'})
    }catch(err){
        return res.status(500).json({ message: err.message})
    }
}

module.exports.change_password_post = async (req, res)=> {
    const { email, newPassword } = req.body;
    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({ message: `${email} not found in the database`})
        }
        if (!validator.isStrongPassword(newPassword)) {
            throw Error('Password not strong enough')
          }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        const token = createToken(user._id);

        user.password == hashedPassword;
        await user.save();
        res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000, secure: true, // Set to true if using HTTPS
            sameSite: 'lax',})
        res.status(200).json({email});
    }catch(err){

        return res.status(500).json({ message: err.message});
    }
}



module.exports.productId_get = async (req, res) => {
    const {productId} = req.query;
    try{
        const product = await Product.findById(productId)

        if(!product) {
            return res.status(404).json({ message: 'Product not found'})
        }
        res.status(201).json(product)
    }catch(err){
        return res.status(400).json({err: err.message})
    }
}

// for the products

module.exports.product_get = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        let query = {};

        if (searchTerm) {
            query = {
                $or: [
                    { ProductName: { $regex: searchTerm, $options: 'i' } },
                    { ProductDetail: { $regex: searchTerm, $options: 'i' } },
                    { Category: { $regex: searchTerm, $options: 'i' } }
                ],
            };
        }

        const products = await Product.find(query);
        if (!res.headersSent) {
            res.json(products);
        }

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message });
        }
    }
}
