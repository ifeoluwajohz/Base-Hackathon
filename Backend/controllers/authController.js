require('dotenv').config();

const User = require('../models/User');
const Job = require('../models/Job');
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


// const handleErrors = (err) => {
//     let errors = { email: "", password :""}

//     //incorrect email
//     if(err.message === 'Incorrect email') {
//         errors.email = 'That email is not correct'
//     }

//     //incorrect password
//     if(err.message === 'Incorrect password') {
//         errors.password = 'That password is not correct'
//     };


//     //duplicate error code
//     if(err.code === 11000){
//         errors.email = 'That email is registered';
//         return errors;
//     }

//     //validation errors
//     if(err.message.includes('user validation failed')){
//         Object.values(err.errors).forEach(({properties}) => {
//             errors[properties.path] = properties.message;
//         })
//     }
//     return errors;
// }

// module.exports.signup_get = (req, res) =>{
//     res.send('signup');
// }

module.exports.login_get = (req, res) =>{
    res.redirect('/login')
}

module.exports.register_post = async (req, res) =>{
    const { fullname, email, joinedAt, portfolio, password, bio, location, workExperience, SkillAndExpertise, ocuupation, gender, role, username, wallet_address, ratings, profilePicture, certification } = req.body;
    

    try{
        const Finduser = await User.findOne({ wallet_address });
        if(Finduser){
            return res.status(400).json({ err: 'Account already exists in database'})
        }
        const user = await User.create({fullname, portfolio, email, password,workExperience, joinedAt , ocuupation, SkillAndExpertise, bio, location , gender, role, username, wallet_address, ratings, certification, profilePicture});
        // const json = res.locals.user;

        const token = createToken(user._id);
        // res.cookie('jwt', token, {httpOnly :true, maxaAge: 3600 * 1000})
        res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000, secure: true, // Set to true if using HTTPS
            sameSite: 'lax',})
        res.cookie('wallet_address', wallet_address, {httpOnly:true, maxAge: maxAge * 9000, secure: true, sameSite: 'lax',})
        res.status(200).json({message : "Successfully Registered the user", wallet_address : wallet_address});

    }catch(err){
        return res.status(400).json({ err: err.message });
    }

}

module.exports.get_user = async (req, res) =>{
    const { wallet_address } = req.params;
    

    try{
        const data = await User.findOne({ wallet_address });
        if(data){
            return res.status(200).json({data})
        }
    }catch(err){
        return res.status(400).json({ err: err.message });
    }

}

module.exports.login_post =  async(req, res) =>{
    // const { wallet_address, email, password} = req.body;
    const { wallet_address} = req.body;


    try{  
        const Finduser = await User.findOne({ wallet_address });
        if(!Finduser){
            return res.status(400).json({ errors: 'User not found in database'})
        }
        // if(Finduser.email === '' || Finduser.password === ''){
        //     return res.status(200).json({message: 'login'})
        // }
        
        
        
        // const user = await User.login( email, password );
        const user = await User.login( wallet_address );

        const token = createToken(user._id);
        const userId = user._id;

        res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge * 1000, secure: true, // Set to true if using HTTPS
            sameSite: 'lax',})
        res.cookie('wallet_address', wallet_address, {httpOnly:true, maxAge: maxAge * 9000, secure: true, sameSite: 'lax',})
        
        res.status(200).json({wallet_address});

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
    const { email, fullname, password, bio, portfolio, occupation, joinedAt, location, workExperience,SkillAndExpertise, gender, role, certification } = req.body;
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
        if (SkillAndExpertise) user.SkillAndExpertise = SkillAndExpertise;
        if (certification) user.certification = certification;
        if (joinedAt) user.joinedAt = joinedAt;
        if (occupation) user.occupation = occupation
        if (portfolio) user.portfolio = portfolio



        // Save updated user
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.log({ err: err.message });
        return res.status(400).json({ err: err.message });
    }
};


module.exports.post_related_jobs = async (req, res) => {
    const walletAddress = req.params.wallet_address;
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
            salary,
            stillAvailable: true
        };

        // Add the new job to the jobsCreated array
        user.jobsCreated.push(newJob);

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

module.exports.list_jobs_for_user = async (req, res) => {
    const { wallet_address } = req.params; // Get user ID from params

    try {
        // Fetch the user based on wallet_address
        const user = await User.findOne({ wallet_address });

        if (!user) {
            return res.status(404).json({ err: 'User not found' });
        }

        // Extract keywords from the user's bio and work experience
        const keywords = [];
        if (user.bio) {
            keywords.push(...user.bio.split(' ')); // Split bio into words (basic example)
        }

        if (user.workExperience) {
            user.workExperience.forEach(exp => {
                if (exp.company) keywords.push(exp.company);
                if (exp.position) keywords.push(exp.position);
            });
        }

        // Query for jobs based on keywords (matching title or description)
        const matchingJobs = await Job.find({
            $or: [
                { title: { $regex: new RegExp(keywords.join('|'), 'i') } },
                { description: { $regex: new RegExp(keywords.join('|'), 'i') } }
            ]
        });

        if (matchingJobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found matching your profile' });
        }

        res.status(200).json({
            message: 'Matching jobs found',
            jobs: matchingJobs
        });

    } catch (err) {
        console.log({ err: err.message });
        return res.status(500).json({ err: 'An error occurred while fetching jobs' });
    }
};

module.exports.list_and_update_job_availability = async (req, res) => {
    const walletAddress = req.params.wallet_address; // Assuming the user is identified by wallet_address
    const { jobId, stillAvailable } = req.body; // Optional parameters for updating a job

    try {
        // Find the user by wallet_address
        const user = await User.findOne({ wallet_address: walletAddress });
        if (!user) {
            return res.status(404).json({ err: 'User not found' });
        }

        // Check if the user is an employer
        if (user.role !== 'employer') {
            return res.status(403).json({ err: 'Only employers can manage jobs' });
        }

        // List all jobs created by the employer
        const jobsCreated = user.jobsCreated;

        // If no jobId is provided, just return the list of jobs
        if (!jobId) {
            return res.status(200).json({
                message: `Total jobs created: ${jobsCreated.length}`,
                jobs: jobsCreated
            });
        }

        // If jobId is provided, update the availability of the job
        const job = user.jobsCreated.id(jobId); // Get the specific job by ID
        if (!job) {
            return res.status(404).json({ err: 'Job not found or does not belong to this user' });
        }

        // Update the stillAvailable field
        job.stillAvailable = stillAvailable !== undefined ? stillAvailable : job.stillAvailable;

        // Save the user with the updated job availability
        await user.save();

        res.status(200).json({
            message: 'Job availability updated successfully',
            jobs: user.jobsCreated // Return updated jobs list
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: 'An error occurred while managing jobs' });
    }
};

