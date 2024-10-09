require('dotenv').config();

const Admin = require('../models/Admin');
const Product = require('../models/Product')


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
const createToken = (_id) =>{
    return jwt.sign({ _id }, process.env.SECRET, {
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
    res.send('login')
}

module.exports.signup_post = async (req, res) =>{
    const { fullname, email, password } = req.body;

    try{
        if(!fullname || !email || !password){
            return res.status(400).json({ error: "Please provide fullname, email and password"})
        }
        const Findadmin = await Admin.findOne({ email });
        if(Findadmin){
            return res.status(400).json({ message: 'Email already exists in database'})
        }
        if (!validator.isStrongPassword(password)) {
            throw Error('Password not strong enough')
        }
        const admin = await Admin.create({fullname, email, password});
        const token = createToken(admin._id);
        const adminId = admin._id ;
        res.cookie('jwt', token, {httpOnly :true, maxaAge: maxAge * 1000})
        res.status(200).json({fullname, adminId, email, token});

    }catch(err){
        const errors = handleErrors(err);
        return res.status(400).json({ err: err.message });
    }

}

module.exports.login_post = async(req, res) =>{
    const { email, password} = req.body;

    try{
        const Findadmin = await Admin.findOne({ email });
        if(!Findadmin){
            return res.status(400).json({ message: 'Email not found in database'})
        }
        const admin = await Admin.login( email, password );
        const token = createToken(admin._id);
        res.cookie('jwt', token, {httpOnly :true, maxaAge: maxAge * 1000});
        res.status(200).json({ message: 'login successfully', adminId: admin._id, token })
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};
module.exports.logout_get = async(req, res)=>{
    res.cookie('jwt', '', {maxAge : 1});
    res.redirect('/login')
};
module.exports.forget_password_post = async (req, res)=> {
    const { email } = req.body;

    try{
        // Check if the email exists in the database
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Email not found in the database' });
        }
        const otpCode = await generateOTP();
        const otpExpiration = new Date(Date.now() + 5 * 60 * 100);

        admin.otpCode = otpCode;
        admin.otpExpiration = otpExpiration;
        await admin.save();

        // const mailOptions = {
        //     from: process.env.EMAIL_ADDRESS,
        //     to: email,
        //     subject: 'Password Reset OTP',
        //     text: `Your one-time password for password reset is: ${otpCode}`,
        // };
      
        // await transporter.sendMail(mailOptions);
        console.log(otpCode)
        res.status(201).json({Message: `Code has been sent to ${email}`})

        //send to email address
    }catch(err){
        return res.status(500).json({ message: 'Internal server error', err: err.message})
    }

}
module.exports.confirm_otp_post = async (req, res)=> {
    const { email, code } = req.body
    try{
        const admin = await Admin.findOne({ email });
        if(!admin || !admin.otpCode || !admin.otpExpiration || admin.otpExpiration < Date.now){
            console.log(email, code)
            return res.status(400).json({ message: 'Invalid email address or Otp'})
        }
        if(admin.otpCode !== code){
            return res.status(400).json({ message: 'Incorrect code'})
        }


        admin.otpCode = null;
        admin.otpExpiration = null;
        await admin.save();
        return res.status(500).json({ message: 'Code is correct'})
    }catch(err){
        console.log(email, code);
        return res.status(500).json({ message: err.message})
    }
}
module.exports.change_password_post = async (req, res)=> {
    const { email, newPassword } = req.body;
    try{
        const admin = await Admin.findOne({ email });

        if(!admin){
            return res.status(404).json({ message: `${email} not found in the database`})
        }

        if (!validator.isStrongPassword(newPassword)) {
            throw Error('Password not strong enough')
          }

        const salt = await bcrypt.genSalt(8)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        admin.password == hashedPassword;
        await admin.save();
        return res.status(201).json({ message: 'Password Updated Successfully' })
    }catch(err){
        return res.status(500).json({ message: 'Internal server Error', error: err.message});
    }
}

