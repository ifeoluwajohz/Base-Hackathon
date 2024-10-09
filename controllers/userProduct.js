require('dotenv').config();
const User = require('../models/User');
const Product = require('../models/Product')
// const flw = require('flutter')
const jwt = require('jsonwebtoken');


module.exports.getCart = async (req, res) => {
    const userId = req.userId; // Access the userId set in the middleware
    // const user = req.user;
    const user = await User.findById(userId);
    try {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        //fetch product details for each cart item
        const cartWithDetails = [];
        for (const cartItem of user.cart){
            const product = await Product.findById(cartItem.productId);
            if (product) {
                cartWithDetails.push({
                    productId: cartItem.productId,
                    productName: product.ProductName,
                    productPrice: product.ProductPrice,
                    productQuantity: cartItem.quantity
                })
            }
        }
        res.status(200).json({ cart: cartWithDetails });

    } catch (err) {
        if (!res.headersSent) {
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports.addToCart = async (req, res) => {
    const userId = req.userId;
    const { productId } = req.query;
    const { quantity } = req.body;

    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const existingProduct = user.cart.find(item => item.productId.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += parseInt(quantity); // Add specified quantity
        } else {
            user.cart.push({ productId, quantity: parseInt(quantity) });
        }
        
        await user.save();
        res.status(200).json({ message: 'Product added to cart', quantity });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.updateCartItem = async (req, res) => {
    const userId = req.userId;
    const { productId } = req.query; // action can be 'increase' or 'decrease'
    const { action, quantity } = req.body; // action can be 'increase' or 'decrease'

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the cart item index with the productId
        const cartItem = user.cart.find(item => item.productId.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }
        // Update quantity based on action
        if (action === 'increase') {
            cartItem.quantity += parseInt(quantity);
        } else if (action === 'decrease') {
            cartItem.quantity -= parseInt(quantity);
            if (cartItem.quantity < 0) {
                cartItem.quantity = 0; // Ensure quantity doesn't go below zero
            }
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        await user.save();

        res.status(200).json({ message: 'Product quantity updated successfully', cartItem });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.removeCart = async (req, res) => {
    const userId = req.userId;
    const { productId } = req.body;

    try {
        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const cartItemIndex = user.cart.find(item =>item.productId && item.productId.toString() === productId)

        if(!cartItemIndex){
            return res.status(404).json({ error: 'Product not found in cart'})
        } 
        
        user.cart.pull(cartItemIndex);
        await user.save();

        res.status(200).json({ message: 'Product removed from cart', cartItemIndex });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.removeAll = async (req, res) => {
    const  userId  = req.userId; // action can be 'increase' or 'decrease'

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Clear all items from the cart
        user.cart = [];
        await user.save();

        res.status(200).json({ message: 'All products removed from cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.postCheckout = async (req, res) => {
    const {userName, userEmail, phone_number, cartItems, totalAmount} = req.body;
    const userId = req.userId;

    try{
        // return res.status(400).json({request: userId, userName, userEmail, phone_number, cartItems, totalAmount})
    }catch(err){
        return res.status(500).json({err: err.message})
    }
}

module.exports.account_info_get = async (req, res)=> {
    const  userId  = req.userId;
    try{
        const user = await User.findById(userId).select('-__v');
        if(!user) {
            return res.status(404).json({error: "User not found"})
        }
        return res.status(200).json(user)

    }catch(err){
        res.status(500).json({error: err.message})
    }
}
module.exports.account_update_patch = async (req, res) => {
    const  userId  = req.userId;
    const { email, fullname, password, username,  tel_number, home_address, gender } = req.body;
    let updates = {};

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update email with validation
        if (email) {
            if (!isEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            updates.email = email.toLowerCase().trim();
        }

        // Update password with validation and hashing
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ error: 'Minimum password length is 8 characters' });
            }
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            updates.password = hashedPassword;
        }

        // Update fullname
        if (fullname) {
            updates.fullname = fullname.toLowerCase().trim();
        }

        // Update username
        if (username) {
            updates.username = username.toLowerCase().trim();
        }

        // Update tel_number with a check for uniqueness
        if (tel_number) {
            const telExists = await User.findOne({ tel_number, _id: { $ne: userId } });
            if (telExists) {
                return res.status(400).json({ error: 'Telephone number already in use' });
            }
            updates.tel_number = tel_number;
        }
        // Update home_address with basic validation
        if (home_address) {
            const validAddress = /^[a-zA-Z0-9\s,'-]*$/.test(home_address);
            if (!validAddress) {
                return res.status(400).json({ error: 'Invalid address format. Only letters, numbers, spaces, commas, apostrophes, and hyphens are allowed.' });
            }
            if (home_address.length > 100) {
                return res.status(400).json({ error: 'Address is too long. Maximum length is 100 characters.' });
            }
            updates.home_address = home_address.toLowerCase().trim();
        }
        // Update gender with basic validation
        if (gender !== undefined) {
            if (typeof gender !== 'boolean') {
                return res.status(400).json({ error: 'Invalid gender value. Expected boolean.' });
            }
            updates.gender = gender;
        }

        // Apply updates
        Object.assign(user, updates);
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports.security_update_patch = async (req, res) => {
    const { userId } = req.query;
    const { email, password } = req.body;
    let updates = {};

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update email with validation
        if (email) {
            if (!isEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            updates.email = email.toLowerCase().trim();
        }

        // Update password with validation and hashing
        if (password) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }
        }

        // Apply updates
        Object.assign(user, updates);
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

