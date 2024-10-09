require('dotenv').config();

const User = require('../models/User');
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

module.exports.register_post = async (req, res) =>{
    const { fullname, email, password, bio, location, workExperience,  availableJobs , gender, role, username, wallet_address, ratings, profilePicture } = req.body;
    

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
        const user = await User.create({fullname, email, password,workExperience, availableJobs , bio, location , gender, role, username, wallet_address, ratings, profilePicture});
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
    const { wallet_address, email, password} = req.body;

    try{
        const Finduser = await User.findOne({ wallet_address });
        if(!Finduser){
            return res.status(400).json({ errors: 'User not found in database'})
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

//Additional code for job listing from here Onward.....



module.exports.update_user_patch = async (req, res) => {
    const { email, fullname, password, bio, location, workExperience, availableJobs, gender, role } = req.body;
    const walletAddress = req.params.wallet_address; // Assumes wallet_address is provided in the URL
    
    try {
        // Use findOne to find user by wallet_address (instead of findById)
        const user = await User.findOne({ wallet_address: walletAddress });
        if (!user) {
            return res.status(404).json({ err: 'User not found' });
        }

        // Check if email is being updated and already exists
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ err: 'Email already exists in the database' });
            }
        }

        // Check if password is provided and validate its strength
        if (password && !validator.isStrongPassword(password)) {
            return res.status(400).json({ err: 'Password not strong enough' });
        }

        // Update user fields only if they exist in the request
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (password) user.password = password; // Ensure password is hashed before saving
        if (bio) user.bio = bio;
        if (location) user.location = location;
        if (gender) user.gender = gender;
        if (role) user.role = role;
        if (workExperience) user.workExperience = workExperience;
        if (availableJobs) user.availableJobs = availableJobs;



        // Save updated user
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.log({ err: err.message });
        return res.status(400).json({ err: err.message });
    }
};


//jobs contraollers
module.exports.post_related_jobs = async (req, res) => {
    const walletAddress = req.params.wallet_address; // Assuming wallet_address is used for identification
    const { title, description, salary } = req.body;

    try {
        // Find the user by wallet_address
        const user = await User.findOne({ wallet_address: walletAddress });
        if (!user) {
            return res.status(404).json({ err: 'User not found' });
        }

        // Check if the user is an employer
        if (user.role !== 'employer') {
            return res.status(403).json({ err: 'Only employers can post jobs' });
        }

        // Ensure that all required job fields are provided
        if (!title || !description || !salary) {
            return res.status(400).json({ err: 'Title, description, and salary are required to post a job' });
        }

        // Create the new job object
        const newJob = {
            title,
            description,
            salary
        };

        // Add the new job to the availableJobs array
        user.availableJobs.push(newJob);

        // Save the user with the updated jobs
        await user.save();

        res.status(200).json({
            message: 'Job posted successfully',
            job: newJob
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'An error occurred while posting the job' });
    }
}


  module.exports.get_related_jobs = async (req, res) => {
    const walletAddress = req.params.wallet_address; // Assuming you're using wallet_address to identify the user

    try {
        // Find the user by wallet_address
        const user = await User.findOne({ wallet_address: walletAddress });
        if (!user) {
            return res.status(404).json({ err: 'User not found' });
        }

        // Extract user profile data for matching (bio and work experience)
        const { bio, workExperience } = user;

        // Combine bio and work experience into a search string
        let searchKeywords = bio || ''; // Start with bio if it exists
        workExperience.forEach(exp => {
            searchKeywords += ` ${exp.company} ${exp.position}`;
        });

        // Create a regex to match jobs containing keywords from user's bio and work experience
        const searchPattern = new RegExp(searchKeywords, 'i'); // 'i' for case-insensitive matching

        // Find jobs posted by employers where the title or description matches the search pattern
        const employersWithJobs = await User.find({
            role: 'employer',
            'availableJobs.title': searchPattern // Match jobs based on title or description
        });

        // Collect all related jobs
        let relatedJobs = [];
        employersWithJobs.forEach(employer => {
            const matchingJobs = employer.availableJobs.filter(job => {
                return searchPattern.test(job.title) || searchPattern.test(job.description);
            });
            relatedJobs = relatedJobs.concat(matchingJobs);
        });

        // If no jobs were found
        if (relatedJobs.length === 0) {
            return res.status(404).json({ message: 'No related jobs found' });
        }

        // Return the related jobs
        res.status(200).json({
            message: 'Related jobs found',
            jobs: relatedJobs
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: 'An error occurred while fetching related jobs' });
    }
};
